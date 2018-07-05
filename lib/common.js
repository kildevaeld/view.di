export const MetaKeys = {
    registration: Symbol.for('di:registration'),
    instanceActivator: Symbol.for('di:instance-activator'),
    dependencyResolver: Symbol.for('di:dependency-resolver'),
    paramTypes: 'design:paramtypes',
    properties: 'design:properties' // This should match, what tsc is emitting
};
export var emptyParameters = Object.freeze([]);
const paramRegEx = /function[^(]*\(([^)]*)\)/i;
export function getFunctionParameters(fn, cache = true) {
    let params = Reflect.getOwnMetadata(MetaKeys.paramTypes, fn);
    if (!params) {
        const match = fn.toString().match(paramRegEx);
        if (match) {
            params = match[1].replace(/\W+/, ' ').split(' ').map(x => x.replace(',', '').trim())
                .filter(m => m !== '');
            if (cache)
                Reflect.defineMetadata(MetaKeys.paramTypes, params, fn);
        }
    }
    return params || [];
}
