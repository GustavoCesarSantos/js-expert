import { EmailServiceFactory } from "./email-service.factory.js";
import { SendEmailController } from "./send-email.controller.js";

export class EmailControllerFactory {
  static makeSendEmailController() {
    return new SendEmailController({
      sendEmailService: EmailServiceFactory.makeSendEmailService(),
    });
  }
}
