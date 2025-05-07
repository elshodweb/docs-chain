import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import {
  HistorySchema,
  HistorySchemaFactory,
} from '../../schemas/history.schema';
import { BlockchainService } from './blockchain.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistorySchema.name, schema: HistorySchemaFactory },
    ]),
  ],
  controllers: [HistoryController],
  providers: [HistoryService, BlockchainService],
  exports: [HistoryService],
})
export class HistoryModule {}
