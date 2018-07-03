import { IContainer } from './common';
/**
* An abstract resolver used to allow functions/classes to specify custom dependency resolution logic.
*
* @class Resolver
* @constructor
*/
export declare abstract class Resolver {
    /**
    * Called by the container to allow custom resolution of dependencies for a function/class.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Object} Returns the resolved object.
    */
    abstract get(container: IContainer): any;
}
/**
* Used to allow functions/classes to specify lazy resolution logic.
*
* @class Lazy
* @constructor
* @extends Resolver
* @param {Object} key The key to lazily resolve.
*/
export declare class Lazy<T> extends Resolver {
    key: any;
    constructor(key: any);
    /**
    * Called by the container to lazily resolve the dependency into a lazy locator function.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Function} Returns a function which can be invoked at a later time to obtain the actual dependency.
    */
    get(container: IContainer): () => T;
    /**
    * Creates a Lazy Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to lazily resolve.
    * @return {Lazy} Returns an insance of Lazy for the key.
    */
    static of<T = any>(key: any): Lazy<T>;
}
/**
* Used to allow functions/classes to specify resolution of all matches to a key.
*
* @class All
* @constructor
* @extends Resolver
* @param {Object} key The key to lazily resolve all matches for.
*/
export declare class All<T> extends Resolver {
    key: any;
    constructor(key: any);
    /**
    * Called by the container to resolve all matching dependencies as an array of instances.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Object[]} Returns an array of all matching instances.
    */
    get(container: IContainer): T[];
    /**
    * Creates an All Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to resolve all instances for.
    * @return {All} Returns an insance of All for the key.
    */
    static of<T = any>(key: any): All<T>;
}
/**
* Used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
*
* @class Optional
* @constructor
* @extends Resolver
* @param {Object} key The key to optionally resolve for.
* @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
*/
export declare class Optional<T> extends Resolver {
    checkParent: boolean;
    key: any;
    constructor(key: any, checkParent?: boolean);
    /**
    * Called by the container to provide optional resolution of the key.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Object} Returns the instance if found; otherwise null.
    */
    get(container: IContainer): T | null;
    /**
    * Creates an Optional Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to optionally resolve for.
    * @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
    * @return {Optional} Returns an insance of Optional for the key.
    */
    static of<T = any>(key: any, checkParent?: boolean): Optional<T>;
}
/**
* Used to inject the dependency from the parent container instead of the current one.
*
* @class Parent
* @constructor
* @extends Resolver
* @param {Object} key The key to resolve from the parent container.
*/
export declare class Parent<T> extends Resolver {
    key: any;
    constructor(key: any);
    /**
    * Called by the container to load the dependency from the parent container
    *
    * @method get
    * @param {Container} container The container to resolve the parent from.
    * @return {Function} Returns the matching instance from the parent container
    */
    get(container: IContainer): T | null;
    /**
    * Creates a Parent Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to resolve.
    * @return {Parent} Returns an insance of Parent for the key.
    */
    static of<T = any>(key: any): Parent<T>;
}
