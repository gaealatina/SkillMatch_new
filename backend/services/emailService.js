import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendOTP(email, otpCode) {
    // For testing purposes, skip email sending if using default OTP
    if (process.env.NODE_ENV === 'development' && otpCode === '123456') {
      console.log('🧪 TESTING MODE: OTP email would be sent to:', email);
      console.log('🔑 TESTING OTP CODE:', otpCode);
      return { success: true, messageId: 'test-mode' };
    }

    const mailOptions = {
      from: `"SkillMatch" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset - Verification Code',
      html: this.generateOTPEmailTemplate(otpCode)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetConfirmation(email, userName) {
    const mailOptions = {
      from: `"SkillMatch" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Successfully Reset',
      html: this.generateConfirmationEmailTemplate(userName)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Confirmation email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  generateOTPEmailTemplate(otpCode) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - SkillMatch</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #14b8a6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .otp-container { background: #f8fafc; border: 2px dashed #2563eb; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px; margin: 10px 0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>SkillMatch Account Security</p>
          </div>
          
          <div class="content">
            <h2>Hello!</h2>
            <p>We received a request to reset your password for your SkillMatch account. Use the verification code below to proceed:</p>
            
            <div class="otp-container">
              <p><strong>Your verification code is:</strong></p>
              <div class="otp-code">${otpCode}</div>
              <p><small>This code expires in 10 minutes</small></p>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ Security Notice:</strong></p>
              <ul>
                <li>This code is valid for 10 minutes only</li>
                <li>Never share this code with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
            </div>
            
            <p>If you're having trouble, please contact our support team.</p>
          </div>
          
          <div class="footer">
            <p>© 2024 SkillMatch. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateConfirmationEmailTemplate(userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Complete - SkillMatch</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #14b8a6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Password Reset Complete</h1>
            <p>Your SkillMatch account is secure</p>
          </div>
          
          <div class="content">
            <div class="success-icon">🎉</div>
            <h2>Hello ${userName || 'there'}!</h2>
            <p>Your password has been successfully reset. Your SkillMatch account is now secure with your new password.</p>
            
            <p><strong>What's next?</strong></p>
            <ul>
              <li>You can now log in with your new password</li>
              <li>Your account security has been restored</li>
              <li>All your data and progress are safe</li>
            </ul>
            
            <p>If you didn't make this change, please contact our support team immediately.</p>
          </div>
          
          <div class="footer">
            <p>© 2024 SkillMatch. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();
