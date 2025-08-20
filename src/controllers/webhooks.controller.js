import { bitrix24Service } from "../services/bitrix24.service.js";
import { jotformService } from "../services/jotform.service.js";
import { logUtil } from "../utils/log.util.js";

export const webhooksController = {
  async jotformWebhook(req, res) {
    try {
      logUtil.info(`Webhook received from Jotform`);

      const data = req.body;
      const submissionID = data?.submissionID;
      if (!submissionID) {
        throw {
          code: 400,
          message: "Submission ID is required in the webhook data.",
        };
      }

      const submissionResponse = await jotformService.getSubmission(
        submissionID
      );

      const submissionData = submissionResponse.submission.release();
      const answers = submissionData.answers;

      await bitrix24Service.addContact(
        answers.name.raw.first,
        answers.name.raw.middle,
        answers.name.raw.last,
        answers.phoneNumber.value,
        answers.email.value
      );

      logUtil.info(
        `Contact added to Bitrix24 for submission ID ${submissionID}`,
        req
      );

      res.status(200).json({
        message: "Contact added successfully to Bitrix24.",
      });
    } catch (error) {
      const errorCode = error?.code || 500;
      const errorMessage =
        error?.message || "An error occurred while processing the webhook.";

      logUtil.error(errorMessage, req);

      res.status(errorCode).json({ message: errorMessage });
    }
  },
};
