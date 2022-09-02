import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDTO {
    
    @IsString()
    first_name: string;
    
    @IsString()
    last_name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}

export class LoginDTO {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}