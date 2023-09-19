import { ResendClient } from "../../utils/resendClient.js";
import { SendEmailService } from "./send-email.service.js";
import { SESClient } from "../../utils/sesClient.js";

const resendClient = new ResendClient();
const sesClient = new SESClient();

export class EmailServiceFactory {
  static makeSendEmailService() {
    return new SendEmailService({
      emailProviderMain: resendClient,
      emailProviderSecondary: sesClient,
    });
  }
}
