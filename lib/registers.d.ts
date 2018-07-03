import { IContainer } from './common';
/**
* Used to allow functions/classes to indicate that they should be registered as transients with the container.
*
* @class TransientRegistration
* @constructor
* @param {Object} [key] The key to register as.
*/
export declare class TransientRegistration {
    key: any;
    constructor(key: any);
    /**
    * Called by the container to register the annotated function/class as transient.
    *
    * @method register
    * @param {Container} container The container to register with.
    * @param {Object} key The key to register as.
    * @param {Object} fn The function to register (target of the annotation).
    */
    register(container: IContainer, key: any, fn: Function): void;
}
/**
* Used to allow functions/classes to indicate that they should be registered as singletons with the container.
*
* @class SingletonRegistration
* @constructor
* @param {Object} [key] The key to register as.
*/
export declare class SingletonRegistration {
    registerInChild: boolean;
    key: any;
    constructor(keyOrRegisterInChild: any, registerInChild?: boolean);
    /**
    * Called by the container to register the annotated function/class as a singleton.
    *
    * @method register
    * @param {Container} container The container to register with.
    * @param {Object} key The key to register as.
    * @param {Object} fn The function to register (target of the annotation).
    */
    register(container: IContainer, key: any, fn: Function): void;
}
