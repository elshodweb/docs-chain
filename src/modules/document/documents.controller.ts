import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentSchema } from '../../schemas/document.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new document' })
  @ApiBody({ type: CreateDocumentDto })
  @ApiResponse({
    status: 201,
    description: 'Document successfully created',
    type: DocumentSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  create(
    @Body() createDocumentDto: CreateDocumentDto,
    @Request() req,
  ): Promise<DocumentSchema> {
    return this.documentsService.create(createDocumentDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({
    status: 200,
    description: 'Return all documents',
    type: [DocumentSchema],
  })
  findAll(): Promise<DocumentSchema[]> {
    return this.documentsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get a document by id' })
  @ApiParam({
    name: 'id',
    description: 'Document ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Return the document',
    type: DocumentSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  findOne(@Param('id') id: string, @Request() req): Promise<DocumentSchema> {
    return this.documentsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a document' })
  @ApiParam({
    name: 'id',
    description: 'Document ID',
    type: String,
  })
  @ApiBody({ type: UpdateDocumentDto })
  @ApiResponse({
    status: 200,
    description: 'Document successfully updated',
    type: DocumentSchema,
  })
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Request() req,
  ): Promise<DocumentSchema> {
    return this.documentsService.update(id, updateDocumentDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a document' })
  @ApiParam({
    name: 'id',
    description: 'Document ID',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Document successfully deleted',
  })
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.documentsService.remove(id, req.user.id);
  }

  @Post(':id/approve')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a document' })
  @ApiParam({
    name: 'id',
    description: 'Document ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Document successfully approved',
    type: DocumentSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  approve(@Param('id') id: string, @Request() req): Promise<DocumentSchema> {
    return this.documentsService.approve(id, req.user.id);
  }

  @Post(':id/reject')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a document' })
  @ApiParam({
    name: 'id',
    description: 'Document ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Document successfully rejected',
    type: DocumentSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  reject(@Param('id') id: string, @Request() req): Promise<DocumentSchema> {
    return this.documentsService.reject(id, req.user.id);
  }
}
