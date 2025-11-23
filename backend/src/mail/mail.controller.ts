import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() body: { name: string; email: string; message: string }) {
    const { name, email, message } = body;
    await this.mailService.sendMail(name, email, message);
    return { message: 'Email sent successfully' };
  }
}
