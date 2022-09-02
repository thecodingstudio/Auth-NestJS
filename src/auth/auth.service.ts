import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as argon from 'argon2';
import { User, Bookmark } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO, LoginDTO } from '../pkg/dto';
import { Response } from '../pkg/common/index';

@Injectable()

export class AuthService {

    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    async singup(body: AuthDTO) {
        try {
            const hash = await argon.hash(body.password);
            const user = await this.prisma.user.create(
                {
                    data: {
                        email: body.email,
                        hash,
                        firstName: body.first_name,
                        lastName: body.last_name
                    },
                }
            )

            delete user.hash;

            return user;
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        'Credentials taken'
                    )
                }
            }
            throw error;
        }
    }

    async singin(body: LoginDTO) {
        try {
            const user = await this.prisma.user.findUnique(
                {
                    where: { email: body.email }
                }
            );

            if (!user) throw new NotFoundException(
                'Credentials not found!'
            );

            const validPass = await argon.verify(
                user.hash,
                body.password
            );

            if (!validPass) throw new ForbiddenException(
                'Invalid credentials'
            );

            delete user.hash;

            const jwt_token = await this.signToken(user.id, user.email);

            const ttl = new Date();
            ttl.setMinutes(ttl.getMinutes() + this.GetMinutes());

            return Response(
                HttpStatus.OK,
                'Login Succeed.',
                { jwt_token, ttl, user }
            );
        }
        catch (error) {
            throw error;
        }
    }

    signToken(
        userId: number,
        email: string
    ): Promise<string> {
        const payload = {
            sub: userId,
            email
        }

        return this.jwt.signAsync(
            payload,
            {
                expiresIn: this.config.get('JWT_EXPIRESIN'),
                secret: this.config.get('JWT_SECRET')
            }
        )
    }

    GetMinutes() {
        const time = this.config.get('JWT_EXPIRESIN').split(' ');

        let newMinutes: number;

        if (time[1] === 'm') {
            newMinutes = parseInt(time[0]);
        } else if (time[1] === 'h') {
            newMinutes = parseInt(time[0]) * 60;
        } else if (time[1] === 'd') {
            newMinutes = parseInt(time[0]) * 24 * 60;
        } else if (time[1] === 'w') {
            newMinutes = parseInt(time[0]) * 24 * 60 * 7;
        } else if (time[1] === 'y') {
            newMinutes = parseInt(time[0]) * 24 * 60 * 365;
        } else if (time[1] === 's') {
            newMinutes = parseInt(time[0]) / 60;
        }

        return newMinutes
    }
}