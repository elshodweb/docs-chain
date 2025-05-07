import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserSchema } from '../../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserSchema> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      passwordHash: hashedPassword,
    });
    return createdUser.save();
  }

  async findAll(): Promise<UserSchema[]> {
    return this.userModel.find({ deletedAt: null }).exec();
  }

  async findOne(id: string): Promise<UserSchema> {
    const user = await this.userModel
      .findOne({ _id: id, deletedAt: null })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserSchema | null> {
    return this.userModel.findOne({ email, deletedAt: null }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserSchema> {
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      delete updateData.password;
    }

    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        { $set: updateData },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        { $set: { deletedAt: new Date() } },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async restore(id: string): Promise<UserSchema> {
    const restoredUser = await this.userModel
      .findOneAndUpdate(
        { _id: id, deletedAt: { $ne: null } },
        { $unset: { deletedAt: 1 } },
        { new: true },
      )
      .exec();

    if (!restoredUser) {
      throw new NotFoundException(
        `User with ID ${id} not found or not deleted`,
      );
    }

    return restoredUser;
  }
}
