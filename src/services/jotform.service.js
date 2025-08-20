import jotformClient from "../clients/jotform.client.js";
import SubmissionResponse from "../dtos/submission.response.js";
import { logUtil } from "../utils/log.util.js";

export const jotformService = {
    getClient() {
        return jotformClient;
    },

    async getSubmission(submissionId) {
        try {
            const jotformClient = this.getClient();
            const responseData = await this._retryCall(() => jotformClient.submission.get(submissionId));

            return SubmissionResponse.fromJotform(responseData);
        } catch (error) {
            const axiosError = error?.response;
            const message = axiosError?.data?.message || axiosError?.statusText || 'Unknown error when getting submission from Jotform';

            logUtil.error(`Error fetching submission ${submissionId}: ${message}`);
            
            throw {
                code: axiosError?.data.responseCode || 500,
                message: message,
            };
        }
    },

    _retryCall(fn, retries = 3, delay = 1000) {
        return new Promise((resolve, reject) => {
            const attempt = (n) => {
                fn()
                    .then(resolve)
                    .catch((error) => {
                        if (n <= 1) {
                            reject(error);
                        } else {
                            setTimeout(() => attempt(n - 1), delay);
                        }
                    });
            };
            attempt(retries);
        });
    }
}