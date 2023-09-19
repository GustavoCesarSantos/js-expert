import { Guard } from "../../utils/guard.js";

export class SendEmailController {
  #sendEmailService;

  constructor({ sendEmailService }) {
    this.#sendEmailService = sendEmailService;
  }

  async handle(request, response) {
    try {
      const email = request.body;
      const validationResult = Guard.againstInvalidEmail(email);
      if (validationResult?.status === "invalid_request") {
        return response.status(400).json(validationResult);
      }
      if (validationResult?.status === "syntactically_invalid_request") {
        return response.status(422).json(validationResult);
      }
      await this.#sendEmailService.execute(email);
      response.status(200).json({ status: "Email successfully sent" });
    } catch (error) {
      response.status(500).json({
        status: "internal_server_error",
        message: "An internal server error occurred",
        path: "",
        received: "",
        expected: "",
      });
    }
  }
}
