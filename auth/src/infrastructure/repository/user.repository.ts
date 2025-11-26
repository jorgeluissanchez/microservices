import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';

import { UserDocument } from '@/domain/entity/user.schema';

@Injectable()
export class UserRepository {
  protected readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectModel(UserDocument.name)
    protected readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: any) {
    const user = new this.userModel(data);
    return user.save();
  }

  async findOne(filter: any) {
    return this.userModel.findOne(filter).exec();
  }

  async findOneAndUpdate(filter: any, update: any) {
    return this.userModel.findOneAndUpdate(filter, update, { new: true }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }
}
