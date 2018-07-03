"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DIError extends Error {
    constructor(message = '') {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, DIError.prototype);
    }
    toString() {
        return `[${this.name}: ${this.message}]`;
    }
}
exports.DIError = DIError;
class DIAggregateError extends DIError {
    constructor(message, errors) {
        super(message);
        this.error = errors;
        Object.setPrototypeOf(this, DIAggregateError.prototype);
    }
    get inner() {
        if (this.error && this.error.inner)
            return this.error.inner;
        return this.error;
    }
    toString() {
        if (this.error == null) {
            return `[${this.name}: ${this.message}]`;
        }
        else {
            return String.prototype.toString.call(this.error);
        }
    }
}
exports.DIAggregateError = DIAggregateError;
function createError(name, message, error) {
    let e;
    if (error) {
        e = new DIAggregateError(message, error);
    }
    else {
        e = new DIError(message);
    }
    e.name = name;
    return e;
}
exports.createError = createError;
