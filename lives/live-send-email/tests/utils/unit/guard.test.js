import { describe, expect, test } from "@jest/globals";

import { Guard } from "../../../src/utils/guard.js";

describe("Guard", () => {
  test("Should return error object when not provide email object", async () => {
    const result = Guard.againstInvalidEmail(undefined);
    expect(result).toEqual({
      status: "invalid_request",
      message: "email object not provided",
      path: "request.body",
      received: "undefined",
      expected: "string",
    });
  });

  test("Should return error object when not provide property from in email object", async () => {
    const result = Guard.againstInvalidEmail({});
    expect(result).toEqual({
      status: "invalid_request",
      message: "email from field not found",
      path: "request.body.from",
      received: "undefined",
      expected: "string",
    });
  });

  test("Should return error object when provide a non string in property 'from'", async () => {
    const result = Guard.againstInvalidEmail({ from: 1 });
    expect(result).toEqual({
      status: "syntactically_invalid_request",
      message: "invalid email from field",
      path: "request.body.from",
      received: "number",
      expected: "string",
    });
  });

  test("Should return error object when not provide property 'to' in email object", async () => {
    const result = Guard.againstInvalidEmail({ from: "success" });
    expect(result).toEqual({
      status: "invalid_request",
      message: "email to field not found",
      path: "request.body.to",
      received: "undefined",
      expected: "string",
    });
  });

  test("Should return error object when provide a non string in property 'to'", async () => {
    const result = Guard.againstInvalidEmail({ from: "success", to: 1 });
    expect(result).toEqual({
      status: "syntactically_invalid_request",
      message: "invalid email to field",
      path: "request.body.to",
      received: "number",
      expected: "string",
    });
  });

  test("Should return error object when not provide property 'subject' in email object", async () => {
    const result = Guard.againstInvalidEmail({
      from: "success",
      to: "success",
    });
    expect(result).toEqual({
      status: "invalid_request",
      message: "email subject field not found",
      path: "request.body.subject",
      received: "undefined",
      expected: "string",
    });
  });

  test("Should return error object when provide a non string in property 'subject'", async () => {
    const result = Guard.againstInvalidEmail({
      from: "success",
      to: "success",
      subject: 1,
    });
    expect(result).toEqual({
      status: "syntactically_invalid_request",
      message: "invalid email subject field",
      path: "request.body.subject",
      received: "number",
      expected: "string",
    });
  });

  test("Should return error object when provide a non string in property 'text'", async () => {
    const result = Guard.againstInvalidEmail({
      from: "success",
      to: "success",
      subject: "success",
      text: 1,
    });
    expect(result).toEqual({
      status: "syntactically_invalid_request",
      message: "invalid email text field",
      path: "request.body.text",
      received: "number",
      expected: "string",
    });
  });

  test("Should return error object when provide a non string in property 'text'", async () => {
    const result = Guard.againstInvalidEmail({
      from: "success",
      to: "success",
      subject: "success",
      html: 1,
    });
    expect(result).toEqual({
      status: "syntactically_invalid_request",
      message: "invalid email html field",
      path: "request.body.html",
      received: "number",
      expected: "string",
    });
  });
});
