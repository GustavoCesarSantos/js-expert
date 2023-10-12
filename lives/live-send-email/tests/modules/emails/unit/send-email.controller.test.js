import { describe, expect, test, jest, beforeEach } from "@jest/globals";

import { Guard } from "../../../../src/utils/guard.js";
import { SendEmailController } from "../../../../src/modules/emails/send-email.controller.js";

let controller;

class SendEmailServiceDummy {
  execute() {}
}

class SendEmailErrorServiceDummy {
  execute() {
    throw new Error("Unexpected error");
  }
}

const makeSut = () => {
  const sendEmailServiceDummy = new SendEmailServiceDummy();
  return new SendEmailController({
    sendEmailService: sendEmailServiceDummy,
  });
};

const makeSutWithError = () => {
  const sendEmailServiceDummy = new SendEmailErrorServiceDummy();
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

  test("Should return status 400 when invalid request error occur", async () => {
    const errorObject = {
      status: "invalid_request",
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

  test("Should return status 422 when syntactically invalid request error occur", async () => {
    const errorObject = {
      status: "syntactically_invalid_request",
    };
    jest.spyOn(Guard, "againstInvalidEmail").mockImplementation(() => {
      return errorObject;
    });
    const request = { body: {} };
    const response = mockResponse();
    await controller.handle(request, response);
    expect(response.status).toHaveBeenCalledWith(422);
    expect(response.json).toHaveBeenCalledWith(errorObject);
  });

  test("Should return status 500 when a unexpected error occur", async () => {
    const errorObject = {
      status: "internal_server_error",
      message: "An internal server error occurred",
      path: "",
      received: "",
      expected: "",
    };
    jest.spyOn(Guard, "againstInvalidEmail").mockImplementation(() => {
      return { status: "success" };
    });
    const controllerWithError = makeSutWithError();
    const request = { body: {} };
    const response = mockResponse();
    await controllerWithError.handle(request, response);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(errorObject);
  });

  test("Should return status 200", async () => {
    jest.spyOn(Guard, "againstInvalidEmail").mockImplementation(() => {
      return { status: "success" };
    });
    const request = { body: {} };
    const response = mockResponse();
    await controller.handle(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      status: "Email successfully sent",
    });
  });
});
