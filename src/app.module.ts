import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const MONGODB_URI =
  process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/docs-chain';

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
