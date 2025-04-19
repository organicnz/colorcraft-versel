"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useErrorHandler = useErrorHandler;
exports.useAsyncErrorHandler = useAsyncErrorHandler;
exports.withErrorHandling = withErrorHandling;
var react_1 = require("react");
var monitoring_1 = require("./monitoring");
var initialErrorState = {
    message: '',
    code: undefined,
    hasError: false,
};
/**
 * Hook for handling errors in React components with integration
 * to our error monitoring system
 */
function useErrorHandler() {
    var _a = (0, react_1.useState)(initialErrorState), error = _a[0], setError = _a[1];
    /**
     * Handle and capture an error
     */
    var handleError = (0, react_1.useCallback)(function (err, contextMessage) {
        var errorMessage = 'An unexpected error occurred';
        var errorCode = monitoring_1.ErrorCode.UNEXPECTED_ERROR;
        if (err instanceof monitoring_1.AppError) {
            errorMessage = err.message;
            errorCode = err.code;
            // Let the monitoring system handle it
            monitoring_1.errorMonitor.captureError(err);
        }
        else if (err instanceof Error) {
            errorMessage = contextMessage ? "".concat(contextMessage, ": ").concat(err.message) : err.message;
            // Track standard errors too
            monitoring_1.errorMonitor.captureError(err);
        }
        else if (typeof err === 'string') {
            errorMessage = err;
            // Create and track an error from the string
            monitoring_1.errorMonitor.captureError(new Error(err));
        }
        setError({
            message: errorMessage,
            code: errorCode,
            hasError: true,
        });
        return { message: errorMessage, code: errorCode };
    }, []);
    /**
     * Clear the current error
     */
    var clearError = (0, react_1.useCallback)(function () {
        setError(initialErrorState);
    }, []);
    return {
        error: error,
        handleError: handleError,
        clearError: clearError,
    };
}
/**
 * Wrap an async function with error handling
 */
function useAsyncErrorHandler(asyncFn, options) {
    var _this = this;
    var handleError = useErrorHandler().handleError;
    return (0, react_1.useCallback)(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var error_1, context;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, asyncFn.apply(void 0, args)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_1 = _b.sent();
                        context = (_a = options === null || options === void 0 ? void 0 : options.context) !== null && _a !== void 0 ? _a : 'Error executing operation';
                        handleError(error_1, context);
                        if ((options === null || options === void 0 ? void 0 : options.onError) && error_1 instanceof Error) {
                            options.onError(error_1);
                        }
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, [asyncFn, handleError, options]);
}
/**
 * Higher-order component that adds error boundary functionality
 * to a React component using hooks
 */
function withErrorHandling(Component, fallback) {
    var WithErrorHandling = function (props) {
        var _a = useErrorHandler(), error = _a.error, handleError = _a.handleError, clearError = _a.clearError;

        // Create error boundary effect - moved up before the conditional rendering
        (0, react_1.useEffect)(function () {
            var errorHandler = function (event) {
                handleError(event.error || event.message);
            };
            // Catch unhandled errors
            window.addEventListener('error', errorHandler);
            return function () {
                window.removeEventListener('error', errorHandler);
            };
        }, [handleError]);

        if (error.hasError && fallback) {
            var Fallback = fallback;
            return React.createElement(Fallback, { error: error, reset: clearError });
        }

        return React.createElement(Component, __assign({}, props));
    };

    var displayName = Component.displayName || Component.name || 'Component';
    WithErrorHandling.displayName = "withErrorHandling(".concat(displayName, ")");
    return WithErrorHandling;
}
