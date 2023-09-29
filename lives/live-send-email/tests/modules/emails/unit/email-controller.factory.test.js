import "dotenv/config";
import { describe, expect, test } from "@jest/globals";

import { EmailControllerFactory } from "../../../../src/modules/emails/email-controller.factory.js";
import { SendEmailController } from "../../../../src/modules/emails/send-email.controller.js";

describe("Email controller factory", () => {
  test("makeSendEmailController should return a SendEmailController class instance", () => {
    const controller = EmailControllerFactory.makeSendEmailController();
    expect(controller).toBeInstanceOf(SendEmailController);
  });
});
