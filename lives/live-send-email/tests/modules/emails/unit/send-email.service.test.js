import { describe, expect, test, jest, beforeEach } from "@jest/globals";

import { SendEmailService } from "../../../../src/modules/emails/send-email.service.js";

let service;

class MainEmailProviderDummy {
  send() {}
}

class SecondaryEmailProviderDummy {
  send() {}
}

const makeSut = () => {
  const mainEmailProvider = new MainEmailProviderDummy();
  const secondaryEmailProvider = new SecondaryEmailProviderDummy();
  return new SendEmailService({ mainEmailProvider, secondaryEmailProvider });
};

describe("Send email controller", () => {
  beforeEach(() => {
    service = makeSut();
  });

  test("Should call secondary email provider when the main provider return error", async () => {
    jest
      .spyOn(MainEmailProviderDummy.prototype, "send")
      .mockImplementation(() => {
        return true;
      });
    const spy = jest.spyOn(SecondaryEmailProviderDummy.prototype, "send");
    await service.execute({});
    expect(spy).toBeCalledTimes(1);
  });
});
