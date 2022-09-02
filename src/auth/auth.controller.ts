import { Body, Controller, HttpCode, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { AuthDTO } from "../pkg/dto";

@Controller('auth')

export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('singup')
    singup(@Body() ReqBody: AuthDTO) {
        return this.authService.singup(ReqBody);
    }

    @Post('login')
    @HttpCode(200)
    singin(@Body() ReqBody: AuthDTO) {
        return this.authService.singin(ReqBody);
    }
}