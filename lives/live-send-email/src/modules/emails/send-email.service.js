export class SendEmailService {
  #mainEmailProvider;
  #secondaryEmailProvider;

  constructor({ mainEmailProvider, secondaryEmailProvider }) {
    this.#mainEmailProvider = mainEmailProvider;
    this.#secondaryEmailProvider = secondaryEmailProvider;
  }

  async execute(email) {
    const error = await this.#mainEmailProvider.send(email);
    if (error) await this.#secondaryEmailProvider.send(email);
  }
}
