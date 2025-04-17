import { ApiProperty } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserDto implements Prisma.UserMaxAggregateOutputType {

    @Exclude()
    passwordHash: string;

    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    role: Role;

    @ApiProperty()
    name: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}