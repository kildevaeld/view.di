export declare const MetaKeys: {
    registration: symbol;
    instanceActivator: symbol;
    dependencyResolver: symbol;
    paramTypes: string;
    properties: string;
};
export declare var emptyParameters: ReadonlyArray<never>;
export declare function getFunctionParameters(fn: Function, cache?: boolean): string[];
export interface IHandlerFunc {
    (c: IActivator): any;
}
/**
 * IActivator has the responsibility to instantiate a function
 *
 * @export
 * @interface IActivator
 */
export interface IActivator {
    invoke(fn: Function, args?: any[], targetKey?: string): any;
}
export interface IDependencyResolver {
    resolveDependencies(fn: Function, targetKey?: string): any[];
}
export interface IContainer {
    parent?: IContainer;
    root?: IContainer;
    get<T>(key: any): T;
    getAll<T>(key: any): T[];
    hasHandler(key: any, parent: boolean): boolean;
    registerTransient(key: any, fn: Function, targetKey?: string): this;
    registerSingleton(key: any, fn: Function, targetKey?: string): this;
    registerInstance(key: any, instance: any): this;
    registerFactory(key: any, fn: Function, targetKey?: string): this;
    registerHandler(key: any, handler: IHandlerFunc): this;
}
