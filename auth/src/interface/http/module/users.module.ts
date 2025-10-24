import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from '@/interface/http/controller/users.controller';
import { UsersService } from '@/application/service/users.service';
import { UserDocument, UserSchema } from '@/domain/entity/user.schema';
import { UserRepository } from '@/infrastructure/repository/user.repository';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_db'
    ),
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}