import SESV2 from "aws-sdk/clients/sesv2.js";

export class SESClient {
  #client;

  constructor() {
    this.#client = new SESV2();
  }

  async send(email) {
    try {
      const result = await this.#client
        .sendEmail({
          Content: {
            Simple: {
              Body: {
                Text: { Data: email.text ?? "Teste SES", Charset: "UTF-8" },
              },
              Subject: { Data: email.subject, Charset: "UTF-8" },
            },
          },
          FromEmailAddress: email.from,
          Destination: {
            ToAddresses: [email.to],
          },
        })
        .promise();
      if (result.MessageId) return;
      return result;
    } catch (error) {
      return error;
    }
  }
}
