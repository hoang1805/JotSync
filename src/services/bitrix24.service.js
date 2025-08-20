import axios from "axios";
import { logUtil } from "../utils/log.util.js";

// Service object for Bitrix24 CRM operations
export const bitrix24Service = {
    /**
     * Adds a contact to Bitrix24 CRM.
     * @param {string} firstName - Contact's first name
     * @param {string} middleName - Contact's middle name
     * @param {string} lastName - Contact's last name
     * @param {string} phone - Contact's phone number
     * @param {string} email - Contact's email address
     * @throws {Object} Error object with code and message if request fails
     */
    async addContact(firstName, middleName, lastName, phone, email) {
        try {
            // Send POST request to Bitrix24 API to add a new contact
            await axios.post(`${process.env.BITRIX24_WEBHOOK_URL}/crm.contact.add`, {
                FIELDS: {
                    NAME: firstName,
                    SECOND_NAME: middleName,
                    LAST_NAME: lastName,
                    PHONE: [{ VALUE: phone, VALUE_TYPE: "WORK" }],
                    EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }]
                }
            });
        } catch (error) {
            // Extract error details from Axios response
            const axiosError = error?.response;
            const message = axiosError?.data.error_description || axiosError?.statusText || 'Unknown error when adding contact to Bitrix24';
            // Log the error for debugging
            logUtil.error(`Error adding contact: ${message}`);
            // Throw a custom error object
            throw {
                code: axiosError?.data.error_code || 500,
                message: message,
            };
        }
    }
};