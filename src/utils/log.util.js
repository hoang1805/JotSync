import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],  
});

export const logUtil = {
    info(message, req = null) {
        logger.info(this._getFormattedMessage(message, req));
    },

    error(message, req = null) {
        logger.error(this._getFormattedMessage(message, req));
    },

    warn(message, req = null) {
        logger.warn(this._getFormattedMessage(message, req));
    },

    debug(message, req = null) {
        logger.debug(this._getFormattedMessage(message, req));
    },

    _getFormattedMessage(message, req) {
        if (req) {
            return `${req.method} ${req.originalUrl} - ${message}`;
        }
        return message;
    }
}