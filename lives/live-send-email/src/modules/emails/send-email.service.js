export class SendEmailService {
  #emailProviderMain;
  #emailProviderSecondary;

  constructor({ emailProviderMain, emailProviderSecondary }) {
    this.#emailProviderMain = emailProviderMain;
    this.#emailProviderSecondary = emailProviderSecondary;
  }

  async execute(email) {
    const error = await this.#emailProviderMain.send(email);
    if (error) await this.#emailProviderSecondary.send(email);
  }
}
