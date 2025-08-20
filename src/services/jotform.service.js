import jotformClient from "../clients/jotform.client.js";
import SubmissionResponse from "../dtos/submission.response.js";
import { logUtil } from "../utils/log.util.js";

// Service object for interacting with Jotform API
export const jotformService = {
    // Returns the Jotform client instance
    getClient() {
        return jotformClient;
    },

    // Fetches a submission by its ID, with retry logic and error handling
    async getSubmission(submissionId) {
        try {
            const jotformClient = this.getClient();
            // Attempt to get submission data, retrying on failure
            const responseData = await this._retryCall(() => jotformClient.submission.get(submissionId));

            // Transform raw response into SubmissionResponse DTO
            return SubmissionResponse.fromJotform(responseData);
        } catch (error) {
            // Extract error details from Axios error object
            const axiosError = error?.response;
            const message = axiosError?.data?.message || axiosError?.statusText || 'Unknown error when getting submission from Jotform';

            // Log error for debugging
            logUtil.error(`Error fetching submission ${submissionId}: ${message}`);
            
            // Throw a custom error object with code and message
            throw {
                code: axiosError?.data.responseCode || 500,
                message: message,
            };
        }
    },

    // Helper function to retry a promise-returning function on failure
    _retryCall(fn, retries = 3, delay = 1000) {
        return new Promise((resolve, reject) => {
            // Attempt function call, retrying if necessary
            const attempt = (n) => {
                fn()
                    .then(resolve)
                    .catch((error) => {
                        if (n <= 1) {
                            // No retries left, reject with error
                            reject(error);
                        } else {
                            // Wait for delay, then retry
                            setTimeout(() => attempt(n - 1), delay);
                        }
                    });
            };
            attempt(retries);
        });
    }
}