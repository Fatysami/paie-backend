import nodemailer from "nodemailer";

export const emailService = {
  async sendActivationEmail(to, token) {
    const activationUrl = `${process.env.FRONTEND_URL}/activate?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"PaieFlow" <${process.env.SMTP_FROM}>`,
      to,
      subject: "Activez votre compte",
      html: `
        <h2>Bienvenue sur PaieFlow !</h2>
        <p>Merci pour votre inscription. Cliquez ci-dessous pour activer votre compte :</p>
        <a href="${activationUrl}">Activer mon compte</a>
      `
    });
  },

  async sendWelcomeEmail(to, companyName) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"PaieFlow" <${process.env.SMTP_FROM}>`,
      to,
      subject: "Bienvenue sur PaieFlow 🎉",
      html: `
        <h1>Bienvenue ${companyName} !</h1>
        <p>
          Votre espace entreprise est maintenant prêt.<br>
          Vous bénéficiez de <strong>14 jours d'essai gratuit</strong>.
        </p>
        <p>Bonne découverte de PaieFlow 🚀</p>
      `
    });
  }
};
