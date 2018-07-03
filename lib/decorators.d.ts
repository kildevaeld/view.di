import { IActivator, IDependencyResolver } from './common';
/**
 * Auto inject dependencies.
 */
export declare function autoinject(target: any): void;
export declare function inject(...rest: any[]): (target: any) => void;
export declare function registration(value: any, targetKey?: string): (target: any) => void;
export declare function transient(key?: any, targetKey?: string): (target: any) => void;
export declare function singleton(keyOrRegisterInChild?: any, registerInChild?: boolean, targetKey?: string): (target: any) => void;
export declare function instanceActivator(value: IActivator, targetKey?: string): ClassDecorator;
export declare function factory(): ClassDecorator;
export declare function dependencyResolve(value: IDependencyResolver, targetKey?: string): ClassDecorator;
