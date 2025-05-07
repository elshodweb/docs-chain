import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import {
  DocumentSchema,
  DocumentSchemaFactory,
} from '../../schemas/document.schema';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentSchema.name, schema: DocumentSchemaFactory },
    ]),
    HistoryModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
