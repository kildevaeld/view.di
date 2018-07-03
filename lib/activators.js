"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* Used to instantiate a class.
*
* @class ClassActivator
* @constructor
*/
class ClassActivator {
    invoke(fn, args) {
        return Reflect.construct(fn, args);
    }
}
ClassActivator.instance = new ClassActivator();
exports.ClassActivator = ClassActivator;
/**
* Used to invoke a factory method.
*
* @class FactoryActivator
* @constructor
*/
class FactoryActivator {
    invoke(fn, args) {
        return fn.apply(undefined, args);
    }
}
FactoryActivator.instance = new FactoryActivator();
exports.FactoryActivator = FactoryActivator;
class AsyncClassActivator {
    invoke(fn, args) {
        return Promise.all(args).then(args => {
            return Reflect.construct(fn, args);
        });
    }
}
AsyncClassActivator.instance = new AsyncClassActivator();
exports.AsyncClassActivator = AsyncClassActivator;
