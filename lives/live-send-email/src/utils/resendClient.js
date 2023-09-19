import { Resend } from "resend";

export class ResendClient {
  #client;

  constructor() {
    this.#client = new Resend(process.env.RESEND_API_KEY);
  }

  async send(msg) {
    try {
      const result = await this.#client.emails.send({
        from: msg.from,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
      });
      if (result.id) return;
      return result;
    } catch (error) {
      return error;
    }
  }
}
