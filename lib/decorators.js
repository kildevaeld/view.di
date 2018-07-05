import { MetaKeys, emptyParameters } from './common';
import { TransientRegistration, SingletonRegistration } from './registers';
import { FactoryActivator } from './activators';
/**
 * Auto inject dependencies.
 */
export function autoinject(target) {
    target.inject = Reflect.getOwnMetadata(MetaKeys.paramTypes, target) || emptyParameters;
}
export function inject(...rest) {
    return function (target) {
        if (rest.length === 1 && typeof rest[0] === 'string')
            target.inject = rest[0];
        else
            target.inject = rest;
    };
}
export function registration(value, targetKey) {
    return function (target) {
        Reflect.defineMetadata(MetaKeys.registration, value, target, targetKey);
    };
}
export function transient(key, targetKey) {
    return registration(new TransientRegistration(key), targetKey);
}
export function singleton(keyOrRegisterInChild, registerInChild = false, targetKey) {
    return registration(new SingletonRegistration(keyOrRegisterInChild, registerInChild), targetKey);
}
export function instanceActivator(value, targetKey) {
    return function (target) {
        Reflect.defineMetadata(MetaKeys.instanceActivator, value, target, targetKey);
    };
}
export function factory() {
    return instanceActivator(FactoryActivator.instance);
}
export function dependencyResolve(value, targetKey) {
    return function (target) {
        Reflect.defineMetadata(MetaKeys.dependencyResolver, value, target, targetKey);
    };
}
