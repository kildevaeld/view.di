/**
* Used to instantiate a class.
*
* @class ClassActivator
* @constructor
*/
export class ClassActivator {
    invoke(fn, args) {
        return Reflect.construct(fn, args);
    }
}
ClassActivator.instance = new ClassActivator();
/**
* Used to invoke a factory method.
*
* @class FactoryActivator
* @constructor
*/
export class FactoryActivator {
    invoke(fn, args) {
        return fn.apply(undefined, args);
    }
}
FactoryActivator.instance = new FactoryActivator();
export class AsyncClassActivator {
    invoke(fn, args) {
        return Promise.all(args).then(args => {
            return Reflect.construct(fn, args);
        });
    }
}
AsyncClassActivator.instance = new AsyncClassActivator();
