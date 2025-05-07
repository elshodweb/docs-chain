import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistorySchema, DocumentAction } from '../../schemas/history.schema';
import { BlockchainService } from './blockchain.service';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    @InjectModel(HistorySchema.name)
    private historyModel: Model<HistorySchema>,
    private blockchainService: BlockchainService,
  ) {}

  async recordAction(
    documentId: string,
    userId: string,
    action: DocumentAction,
  ): Promise<HistorySchema> {
    try {
      // Record transaction in blockchain
      const blockchainTx = await this.blockchainService.recordTransaction(
        documentId,
        userId,
        action,
      );

      // Create history record
      const historyRecord = new this.historyModel({
        document: documentId,
        user: userId,
        action,
        blockchainTx,
      });

      await historyRecord.save();
      this.logger.log(`History record created for document ${documentId}`);

      return historyRecord;
    } catch (error) {
      this.logger.error(`Failed to record action: ${error.message}`);
      throw error;
    }
  }

  async getDocumentHistory(documentId: string): Promise<HistorySchema[]> {
    try {
      const history = await this.historyModel
        .find({ document: documentId })
        .sort({ timestamp: -1 })
        .populate('user', 'name email')
        .exec();

      // Verify blockchain transactions
      for (const record of history) {
        if (record.blockchainTx) {
          const isValid = await this.blockchainService.verifyTransaction(
            record.blockchainTx,
          );
          if (!isValid) {
            this.logger.warn(
              `Invalid blockchain transaction found for record ${record._id}`,
            );
          }
        }
      }

      return history;
    } catch (error) {
      this.logger.error(`Failed to get document history: ${error.message}`);
      throw error;
    }
  }

  async getUserHistory(userId: string): Promise<HistorySchema[]> {
    try {
      return this.historyModel
        .find({ user: userId })
        .sort({ timestamp: -1 })
        .populate('document')
        .exec();
    } catch (error) {
      this.logger.error(`Failed to get user history: ${error.message}`);
      throw error;
    }
  }

  async verifyHistory(documentId: string): Promise<boolean> {
    try {
      const history = await this.historyModel
        .find({ document: documentId })
        .select('blockchainTx')
        .exec();

      for (const record of history) {
        if (record.blockchainTx) {
          const isValid = await this.blockchainService.verifyTransaction(
            record.blockchainTx,
          );
          if (!isValid) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      this.logger.error(`Failed to verify history: ${error.message}`);
      return false;
    }
  }
}
