import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    // Em ambiente local sem SMTP, mantemos log para facilitar testes.
    console.info(`Password reset link for ${to}: ${resetLink}`)
    return
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  })

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject: 'Recuperacao de senha - Studio Karine Reverte',
    html: `<p>Voce solicitou recuperacao de senha.</p><p><a href="${resetLink}">Clique aqui para redefinir sua senha</a></p>`,
  })
}

