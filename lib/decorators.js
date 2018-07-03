"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const registers_1 = require("./registers");
const activators_1 = require("./activators");
/**
 * Auto inject dependencies.
 */
function autoinject(target) {
    target.inject = Reflect.getOwnMetadata(common_1.MetaKeys.paramTypes, target) || common_1.emptyParameters;
}
exports.autoinject = autoinject;
function inject(...rest) {
    return function (target) {
        target.inject = rest;
    };
}
exports.inject = inject;
function registration(value, targetKey) {
    return function (target) {
        Reflect.defineMetadata(common_1.MetaKeys.registration, value, target, targetKey);
    };
}
exports.registration = registration;
function transient(key, targetKey) {
    return registration(new registers_1.TransientRegistration(key), targetKey);
}
exports.transient = transient;
function singleton(keyOrRegisterInChild, registerInChild = false, targetKey) {
    return registration(new registers_1.SingletonRegistration(keyOrRegisterInChild, registerInChild), targetKey);
}
exports.singleton = singleton;
function instanceActivator(value, targetKey) {
    return function (target) {
        Reflect.defineMetadata(common_1.MetaKeys.instanceActivator, value, target, targetKey);
    };
}
exports.instanceActivator = instanceActivator;
function factory() {
    return instanceActivator(activators_1.FactoryActivator.instance);
}
exports.factory = factory;
function dependencyResolve(value, targetKey) {
    return function (target) {
        Reflect.defineMetadata(common_1.MetaKeys.dependencyResolver, value, target, targetKey);
    };
}
exports.dependencyResolve = dependencyResolve;
