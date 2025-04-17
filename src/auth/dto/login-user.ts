import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsEmail, IsNotEmpty, IsString, IsStrongPassword, ValidateBy } from "class-validator";
import { UserDto } from "src/user/dto/user-dto";

export class LoginUserDto {
    @ApiProperty({ example: "someuser@example.com" })
    @IsEmail({}, { message: "email must be valid" })
    email: string;

    @ApiProperty({ example: "Secure@password0" })
    password: string;

}

export class LoginUserResponseDto {

    @ApiProperty()
    message: string;

    @ApiProperty()
    tokens: {
        access_token: string;
        refresh_token: string;
    }

    constructor(payload: { access_token: string; refresh_token: string }, message: string) {
        this.tokens = payload;
        this.message = message;
    }
}
