import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UserController],
  providers: [PrismaService, UserService], // Register PrismaService as a provider
  exports: [UserService], // Export UserService to be used in other modules
})
export class UserModule { }
