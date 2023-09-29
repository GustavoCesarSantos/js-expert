import { describe, expect, test, jest, beforeEach } from "@jest/globals";

import { Guard } from "../../../../src/utils/guard.js";
import { SendEmailController } from "../../../../src/modules/emails/send-email.controller.js";

let controller;

class SendEmailServiceDummy {
  execute() {}
}

const makeSut = () => {
  const sendEmailServiceDummy = new SendEmailServiceDummy();
  return new SendEmailController({ sendEmailServiceDummy });
};

const mockResponse = () => {
  const response = {};
  response.status = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);
  return response;
};

describe("Send email controller", () => {
  beforeEach(() => {
    controller = makeSut();
  });

  test("teste", async () => {
    const errorObject = {
      status: "invalid_request",
      message: "email not found",
      path: "request.body.from",
      received: "number",
      expected: "string",
    };
    jest.spyOn(Guard, "againstInvalidEmail").mockImplementation(() => {
      return errorObject;
    });
    const request = { body: {} };
    const response = mockResponse();
    await controller.handle(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(errorObject);
  });
});
