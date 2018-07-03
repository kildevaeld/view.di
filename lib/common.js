"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaKeys = {
    registration: Symbol.for('di:registration'),
    instanceActivator: Symbol.for('di:instance-activator'),
    dependencyResolver: Symbol.for('di:dependency-resolver'),
    paramTypes: 'design:paramtypes',
    properties: 'design:properties' // This should match, what tsc is emitting
};
exports.emptyParameters = Object.freeze([]);
const paramRegEx = /function[^(]*\(([^)]*)\)/i;
function getFunctionParameters(fn, cache = true) {
    let params = Reflect.getOwnMetadata(exports.MetaKeys.paramTypes, fn);
    if (!params) {
        const match = fn.toString().match(paramRegEx);
        if (match) {
            params = match[1].replace(/\W+/, ' ').split(' ').map(x => x.replace(',', '').trim())
                .filter(m => m !== '');
            if (cache)
                Reflect.defineMetadata(exports.MetaKeys.paramTypes, params, fn);
        }
    }
    return params || [];
}
exports.getFunctionParameters = getFunctionParameters;
