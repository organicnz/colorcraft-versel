"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMonitor = exports.ErrorMonitor = exports.ExternalApiError = exports.DatabaseError = exports.RateLimitError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = exports.AppError = exports.ErrorCode = void 0;
var logger_1 = require("../logger");
/**
 * Error codes for consistent error handling
 */
var ErrorCode;
(function (ErrorCode) {
    // User-facing errors
    ErrorCode["VALIDATION_FAILED"] = "validation_failed";
    ErrorCode["RESOURCE_NOT_FOUND"] = "resource_not_found";
    ErrorCode["UNAUTHORIZED"] = "unauthorized";
    ErrorCode["FORBIDDEN"] = "forbidden";
    ErrorCode["RATE_LIMITED"] = "rate_limited";
    // System errors
    ErrorCode["DATABASE_ERROR"] = "database_error";
    ErrorCode["EXTERNAL_API_ERROR"] = "external_api_error";
    ErrorCode["UNEXPECTED_ERROR"] = "unexpected_error";
    ErrorCode["TIMEOUT"] = "timeout";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
/**
 * Base error class for application
 */
var AppError = /** @class */ (function (_super) {
    __extends(AppError, _super);
    function AppError(message, code, statusCode, context, isOperational) {
        if (code === void 0) { code = ErrorCode.UNEXPECTED_ERROR; }
        if (statusCode === void 0) { statusCode = 500; }
        if (isOperational === void 0) { isOperational = true; }
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.code = code;
        _this.statusCode = statusCode;
        _this.context = context;
        _this.isOperational = isOperational; // True if error is expected/handled
        // Maintains proper stack trace
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(_this, _this.constructor);
        }
        return _this;
    }
    return AppError;
}(Error));
exports.AppError = AppError;
/**
 * Validation error
 */
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(message, context) {
        return _super.call(this, message, ErrorCode.VALIDATION_FAILED, 400, context) || this;
    }
    return ValidationError;
}(AppError));
exports.ValidationError = ValidationError;
/**
 * Not found error
 */
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message, context) {
        return _super.call(this, message, ErrorCode.RESOURCE_NOT_FOUND, 404, context) || this;
    }
    return NotFoundError;
}(AppError));
exports.NotFoundError = NotFoundError;
/**
 * Unauthorized error
 */
var UnauthorizedError = /** @class */ (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(message, context) {
        if (message === void 0) { message = 'Unauthorized'; }
        return _super.call(this, message, ErrorCode.UNAUTHORIZED, 401, context) || this;
    }
    return UnauthorizedError;
}(AppError));
exports.UnauthorizedError = UnauthorizedError;
/**
 * Forbidden error
 */
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message, context) {
        if (message === void 0) { message = 'Forbidden'; }
        return _super.call(this, message, ErrorCode.FORBIDDEN, 403, context) || this;
    }
    return ForbiddenError;
}(AppError));
exports.ForbiddenError = ForbiddenError;
/**
 * Rate limit error
 */
var RateLimitError = /** @class */ (function (_super) {
    __extends(RateLimitError, _super);
    function RateLimitError(message, context) {
        if (message === void 0) { message = 'Rate limit exceeded'; }
        return _super.call(this, message, ErrorCode.RATE_LIMITED, 429, context) || this;
    }
    return RateLimitError;
}(AppError));
exports.RateLimitError = RateLimitError;
/**
 * Database error
 */
var DatabaseError = /** @class */ (function (_super) {
    __extends(DatabaseError, _super);
    function DatabaseError(message, context) {
        return _super.call(this, message, ErrorCode.DATABASE_ERROR, 500, context, true) || this;
    }
    return DatabaseError;
}(AppError));
exports.DatabaseError = DatabaseError;
/**
 * External API error
 */
var ExternalApiError = /** @class */ (function (_super) {
    __extends(ExternalApiError, _super);
    function ExternalApiError(message, context) {
        return _super.call(this, message, ErrorCode.EXTERNAL_API_ERROR, 502, context, true) || this;
    }
    return ExternalApiError;
}(AppError));
exports.ExternalApiError = ExternalApiError;
/**
 * Central error handler for reporting and monitoring errors
 */
var ErrorMonitor = /** @class */ (function () {
    function ErrorMonitor() {
        this.environment = process.env.NODE_ENV || 'development';
    }
    /**
     * Get the singleton instance
     */
    ErrorMonitor.getInstance = function () {
        if (!ErrorMonitor.instance) {
            ErrorMonitor.instance = new ErrorMonitor();
        }
        return ErrorMonitor.instance;
    };
    /**
     * Log an error to the monitoring system
     */
    ErrorMonitor.prototype.captureError = function (error, context) {
        var isAppError = error instanceof AppError;
        var errorCode = isAppError ? error.code : ErrorCode.UNEXPECTED_ERROR;
        var errorContext = isAppError ? error.context : context;
        // Log the error with context
        logger_1.apiLogger.error("Error: ".concat(error.message), {
            metadata: __assign({ code: errorCode, stack: error.stack }, errorContext),
        });
        // In production, you would send to external monitoring service
        // Example: if (this.environment === 'production') { this.sendToExternalService(error); }
    };
    /**
     * Handle an error - determine whether to throw or gracefully degrade
     */
    ErrorMonitor.prototype.handleError = function (error, shouldThrow) {
        if (shouldThrow === void 0) { shouldThrow = false; }
        this.captureError(error);
        if (shouldThrow) {
            throw error;
        }
    };
    /**
     * Report an error without throwing
     */
    ErrorMonitor.prototype.reportError = function (error) {
        this.captureError(error);
    };
    /**
     * Create an error boundary component wrapper
     * Would be implemented in a frontend-specific file
     */
    // public createErrorBoundary() { ... }
    /**
     * Would send error to external monitoring service
     * This would be implemented when integrating with a service like Sentry
     */
    ErrorMonitor.prototype.sendToExternalService = function (error) {
        // Integration with external error monitoring service would go here
        // Example: Sentry.captureException(error);
    };
    return ErrorMonitor;
}());
exports.ErrorMonitor = ErrorMonitor;
// Export a singleton instance
exports.errorMonitor = ErrorMonitor.getInstance();
