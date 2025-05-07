import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/user/users.module';
import { DocumentsModule } from './modules/document/documents.module';
import { AuthModule } from './modules/auth/auth.module';
import { HistoryModule } from './modules/history/history.module';
const MONGODB_URI =
  process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/docs-chain';

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI),
    UsersModule,
    DocumentsModule,
    AuthModule,
    HistoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
