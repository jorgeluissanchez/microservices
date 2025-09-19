import { Module } from '@nestjs/common';
import { UsersController } from '../../../infrastructure/http/controller/users.controller';
import { UsersService } from '../../../application/service/users.service';
import { DatabaseModule } from '@app/common';
import { UserDocument, UserSchema } from '../../../domain/entity/user.schema';
import { UserRepository } from '../../../infrastructure/repository/user.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}