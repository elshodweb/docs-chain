import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema, UserSchemaFactory } from '../../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaFactory },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
