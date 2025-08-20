import axios from "axios";
import { logUtil } from "../utils/log.util.js";

export const bitrix24Service = {
    async addContact(firstName, middleName, lastName, phone, email) {
        try {
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
            const axiosError = error?.response;
            const message = axiosError?.data.error_description || axiosError?.statusText || 'Unknown error when adding contact to Bitrix24';
            logUtil.error(`Error adding contact: ${message}`);
            throw {
                code: axiosError?.data.error_code || 500,
                message: message,
            };
        }
    }
};