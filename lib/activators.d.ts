import { IActivator } from './common';
/**
* Used to instantiate a class.
*
* @class ClassActivator
* @constructor
*/
export declare class ClassActivator implements IActivator {
    static instance: ClassActivator;
    invoke(fn: Function, args: any[]): any;
}
/**
* Used to invoke a factory method.
*
* @class FactoryActivator
* @constructor
*/
export declare class FactoryActivator implements IActivator {
    static instance: FactoryActivator;
    invoke(fn: Function, args: any[]): any;
}
export declare class AsyncClassActivator implements IActivator {
    static instance: AsyncClassActivator;
    invoke(fn: Function, args: any[]): any;
}
