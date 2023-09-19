import { EmailControllerFactory } from "./modules/emails/email-controller.factory.js";

const sendEmailController = EmailControllerFactory.makeSendEmailController();

export const routes = (router) => {
  router.post(
    "/send-email",
    sendEmailController.handle.bind(sendEmailController)
  );
};
