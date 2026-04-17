interface WhatsAppPayload {
  phone: string
  message: string
}

// Estrutura pronta para integrar provedores como Twilio ou Z-API.
export const whatsappService = {
  notifyAppointment(payload: WhatsAppPayload) {
    void payload
    return Promise.resolve({ queued: false })
  },
}
