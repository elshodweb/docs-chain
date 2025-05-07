import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DocumentSchema, DocumentStatus } from '../../schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { HistoryService } from '../history/history.service';
import { DocumentAction } from '../../schemas/history.schema';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentSchema.name)
    private documentModel: Model<DocumentSchema>,
    private historyService: HistoryService,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    userId: string,
  ): Promise<DocumentSchema> {
    const document = new this.documentModel({
      ...createDocumentDto,
      uploadedBy: new Types.ObjectId(userId),
    });
    await document.save();

    // Record upload action
    await this.historyService.recordAction(
      document._id.toString(),
      userId,
      DocumentAction.UPLOAD,
    );

    return document;
  }

  async findAll(): Promise<DocumentSchema[]> {
    return this.documentModel.find({ deletedAt: null }).exec();
  }

  async findOne(id: string, userId: string): Promise<DocumentSchema> {
    const document = await this.documentModel
      .findOne({ _id: id, deletedAt: null })
      .exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Record view action
    await this.historyService.recordAction(
      document._id.toString(),
      userId,
      DocumentAction.VIEW,
    );

    return document;
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    userId: string,
  ): Promise<DocumentSchema> {
    const updatedDocument = await this.documentModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
          $set: {
            ...updateDocumentDto,
            updatedAt: new Date(),
          },
        },
        { new: true },
      )
      .exec();

    if (!updatedDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return updatedDocument;
  }

  async remove(id: string, userId: string): Promise<void> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    await this.documentModel.findByIdAndDelete(id).exec();
  }

  async approve(id: string, userId: string): Promise<DocumentSchema> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    document.status = DocumentStatus.APPROVED;
    document.approvedBy = new Types.ObjectId(userId);
    document.approvedAt = new Date();
    await document.save();

    // Record approve action
    await this.historyService.recordAction(
      document._id.toString(),
      userId,
      DocumentAction.APPROVE,
    );

    return document;
  }

  async reject(id: string, userId: string): Promise<DocumentSchema> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    document.status = DocumentStatus.REJECTED;
    document.rejectedBy = new Types.ObjectId(userId);
    document.rejectedAt = new Date();
    await document.save();

    // Record reject action
    await this.historyService.recordAction(
      document._id.toString(),
      userId,
      DocumentAction.REJECT,
    );

    return document;
  }
}
