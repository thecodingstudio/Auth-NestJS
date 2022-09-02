import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as argon from 'argon2';
import { User, Bookmark } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from '../pkg/dto';
import { Response } from '../pkg/common/index';

@Injectable()

export class AuthService {

    constructor(private prisma: PrismaService) {}

    async singup(body: AuthDTO) {
        try {
            const hash = await argon.hash(body.password);
            const user = await this.prisma.user.create(
                {
                    data: {
                        email: body.email,
                        hash
                    },
                }
            )
    
            delete user.hash;
    
            return user;
        } 
        catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    throw new ForbiddenException(
                        'Credentials taken'
                    )
                }
            }
            throw error;
        }
    }

    async singin(body: AuthDTO) {
        try {
            const user = await this.prisma.user.findUnique(
                {
                    where: { email : body.email}
                }
            );

            if(!user) throw new NotFoundException(
                'Credentials not found!'
            );

            const validPass = await argon.verify(
                user.hash,
                body.password
            );

            if(!validPass) throw new ForbiddenException(
                'Invalid credentials'
            );

            delete user.hash;
            
            return Response(
                HttpStatus.OK, 
                'Login Succeed.',
                user
            );
        } 
        catch (error) {
            throw error;
        }
    }
}