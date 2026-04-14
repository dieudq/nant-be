import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    } else {
      this.logger.warn('SENDGRID_API_KEY is not set — emails will not be sent');
    }

    if (!this.configService.get<string>('SENDGRID_FROM')) {
      this.logger.warn(
        'SENDGRID_FROM is not set — using fallback address which may not be a verified SendGrid Sender Identity',
      );
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
