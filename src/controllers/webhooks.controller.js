import { HttpStatusCode } from "axios";
import { bitrix24Service } from "../services/bitrix24.service.js";
import { jotformService } from "../services/jotform.service.js";
import { logUtil } from "../utils/log.util.js";

// Controller object for handling webhook requests
export const webhooksController = {
  // Handles incoming webhook from Jotform
  async jotformWebhook(req, res) {
    try {
      // Log receipt of webhook
      logUtil.info(`Webhook received from Jotform`);

      // Extract data from request body
      const data = req.body;
      const submissionID = data?.submissionID;

      // Validate submission ID
      if (!submissionID) {
        throw {
          code: 400,
          message: "Submission ID is required in the webhook data.",
        };
      }

      // Fetch submission details from Jotform
      const submissionResponse = await jotformService.getSubmission(
        submissionID
      );

      // Extract answers from submission data
      const submissionData = submissionResponse.submission.release();
      const answers = submissionData.answers;

      // Add contact to Bitrix24 using extracted answers
      await bitrix24Service.addContact(
        answers.name.raw.first,
        answers.name.raw.middle,
        answers.name.raw.last,
        answers.phoneNumber.value,
        answers.email.value
      );

      // Log successful contact addition
      logUtil.info(
        `Contact added to Bitrix24 for submission ID ${submissionID}`,
        req
      );

      // Respond with success message
      res.status(HttpStatusCode.Ok).json({
        message: "Contact added successfully to Bitrix24.",
      });
    } catch (error) {
      // Handle errors and respond with appropriate status and message
      const errorCode = error?.code || HttpStatusCode.InternalServerError;
      const errorMessage =
        error?.message || "An error occurred while processing the webhook.";

      logUtil.error(errorMessage, req);

      res.status(errorCode).json({ message: errorMessage });
    }
  },
};