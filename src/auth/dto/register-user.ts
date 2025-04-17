import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Exclude } from "class-transformer";
import { IsEmail, IsString, IsStrongPassword, Min, MinLength, ValidateBy } from "class-validator";
import { UserDto } from "../../user/dto/user-dto";

export class RegisterUserDto {
    @ApiProperty({ example: "someuser@example.com" })
    @IsEmail({}, { message: "email must be valid" })
    email: string;

    @ApiProperty({ example: "Secure@password0" })
    @IsStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }, { message: "password must be atleast 8 chars long, contain atleast 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol" })
    password: string;

    @ApiProperty({ example: "Secure@password0" })
    @ValidateBy({
        name: "isEqual",
        constraints: ["password"],
        validator: {
            validate: (value: string, args: any) => {
                const [relatedPropertyName] = args.constraints;
                const relatedValue = (args.object as any)[relatedPropertyName];
                return value === relatedValue;
            },
            defaultMessage: (args: any) => {
                const [relatedPropertyName] = args.constraints;
                return `passwordConfirm and ${relatedPropertyName} must match`;
            }
        }
    })
    passwordConfirm: string;


    @MinLength(5, { message: "name must be atleast 5 chars long" })
    @IsString({ message: "name must be a string" })
    @ApiProperty({ example: "Some Name" })

    name: string;
}



export class RegisterUserResponseDto {
    @ApiProperty()
    success: boolean;

    @ApiProperty({ required: false })
    message?: string;

    @ApiProperty()
    payload: UserDto | undefined;

    constructor(sucess: boolean, message: string, user: UserDto | undefined) {
        this.payload = user;
        this.success = sucess;
        this.message = message;
    }
}
