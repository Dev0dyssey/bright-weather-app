class WeatherAPIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

class ValidationError extends WeatherAPIError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

class NotFoundError extends WeatherAPIError {
    constructor(message) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

class ServiceUnavailableError extends WeatherAPIError {
    constructor(message) {
        super(message, 503);
        this.name = 'ServiceUnavailableError';
    }
}

module.exports = {
    WeatherAPIError,
    ValidationError,
    NotFoundError,
    ServiceUnavailableError
};