import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendMail(name: string, email: string, message: string) {
    const myEmail = this.configService.get<string>('MAIL_USER'); // Send to self
    
    const mailOptions = {
      from: `"${name}" <${email}>`, // sender address (note: many SMTPs overwrite this with auth user)
      to: myEmail, // list of receivers
      subject: `Portfolio Contact: ${name}`, // Subject line
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // plain text body
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`, // html body
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
