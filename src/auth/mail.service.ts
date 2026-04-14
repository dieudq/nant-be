import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetLink: string,
  ): Promise<void> {
    const from =
      this.configService.get<string>('SENDGRID_FROM') ??
      'no-reply@nannymatch.com';

    await sgMail.send({
      from,
      to: email,
      subject: 'Reset your password — NannyMatch',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to set a new password. This link expires in <strong>15 minutes</strong>.</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    this.logger.log(`Password reset email sent to ${email}`);
  }
}
