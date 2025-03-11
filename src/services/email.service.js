const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  static async sendPetReportNotification(
    ownerEmail,
    petName,
    reportLocation,
    reporterPhone
  ) {
    return await resend.emails.send({
      from: "PetFinder <noreply@petfinder.com>",
      to: ownerEmail,
      subject: `¡Han visto a ${petName}!`,
      html: `
        <h1>¡Han visto a ${petName}!</h1>
        <p>Alguien ha reportado haber visto a tu mascota en: ${reportLocation}</p>
        <p>Teléfono de contacto: ${reporterPhone}</p>
        <p>Por favor, contacta a esta persona lo antes posible.</p>
      `,
    });
  }

  static async sendWelcomeEmail(userEmail, userName) {
    return await resend.emails.send({
      from: "PetFinder <noreply@petfinder.com>",
      to: userEmail,
      subject: "¡Bienvenido a PetFinder!",
      html: `
        <h1>¡Bienvenido a PetFinder, ${userName}!</h1>
        <p>Gracias por unirte a nuestra comunidad.</p>
        <p>Juntos podemos ayudar a más mascotas a encontrar su hogar.</p>
      `,
    });
  }
}

module.exports = EmailService;
