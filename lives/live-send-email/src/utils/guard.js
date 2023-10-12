export class Guard {
  static againstInvalidEmail(email) {
    if (!email) {
      return {
        status: "invalid_request",
        message: "email object not provided",
        path: "request.body",
        received: "undefined",
        expected: "string",
      };
    }
    if (!email.from) {
      return {
        status: "invalid_request",
        message: "email from field not found",
        path: "request.body.from",
        received: "undefined",
        expected: "string",
      };
    }
    if (typeof email.from !== "string") {
      return {
        status: "syntactically_invalid_request",
        message: "invalid email from field",
        path: "request.body.from",
        received: `${typeof email.from}`,
        expected: "string",
      };
    }
    if (!email.to) {
      return {
        status: "invalid_request",
        message: "email to field not found",
        path: "request.body.to",
        received: "undefined",
        expected: "string",
      };
    }
    if (typeof email.to !== "string") {
      return {
        status: "syntactically_invalid_request",
        message: "invalid email to field",
        path: "request.body.to",
        received: `${typeof email.to}`,
        expected: "string",
      };
    }
    if (!email.subject) {
      return {
        status: "invalid_request",
        message: "email subject field not found",
        path: "request.body.subject",
        received: "undefined",
        expected: "string",
      };
    }
    if (typeof email.subject !== "string") {
      return {
        status: "syntactically_invalid_request",
        message: "invalid email subject field",
        path: "request.body.subject",
        received: `${typeof email.subject}`,
        expected: "string",
      };
    }
    if (email.text && typeof email.text !== "string") {
      return {
        status: "syntactically_invalid_request",
        message: "invalid email text field",
        path: "request.body.text",
        received: `${typeof email.text}`,
        expected: "string",
      };
    }
    if (email.html && typeof email.html !== "string") {
      return {
        status: "syntactically_invalid_request",
        message: "invalid email html field",
        path: "request.body.html",
        received: `${typeof email.html}`,
        expected: "string",
      };
    }
  }
}
