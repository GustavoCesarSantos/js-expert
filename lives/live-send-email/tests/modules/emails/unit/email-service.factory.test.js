import "dotenv/config";
import { describe, expect, test } from "@jest/globals";

import { EmailServiceFactory } from "../../../../src/modules/emails/email-service.factory.js";
import { SendEmailService } from "../../../../src/modules/emails/send-email.service.js";

describe("Email service factory", () => {
  test("makeSendEmailService should return a SendEmailService class instance", () => {
    const service = EmailServiceFactory.makeSendEmailService();
    expect(service).toBeInstanceOf(SendEmailService);
  });
});
