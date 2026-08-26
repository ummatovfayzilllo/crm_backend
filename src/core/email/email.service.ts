// src/email/email.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailCodeEnum } from '../../common/types/enum.types';
import { messageGenerator } from '../../common/utils/generators';

@Injectable()
export class EmailService {
    private email: nodemailer.Transporter;

    constructor() {
        this.email = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'ummatovfayzillo23@gmail.com',
                pass: 'lfdmgpvcwenprjsy',
            },
        });
    }

    async sendResedPasswordVerify(email: string, code: number, typeMessage : EmailCodeEnum) {

        const result = await this.email.sendMail({
            to: email,
            from: "Verfication Service : '<noreply@gmail.com>'",
            subject: 'Verfication Service : "<noreplay@gmail.com>"',
            text: 'Salom sizning tasdiq kodingiz',
            html: messageGenerator(typeMessage,code),
        });
        return result;
    }
}
