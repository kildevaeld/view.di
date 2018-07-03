"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const errors_1 = require("./errors");
const activators_1 = require("./activators");
const resolvers_1 = require("./resolvers");
const decorators_1 = require("./decorators");
var counter = 0;
function genid() {
    return ++counter + "";
}
class DIBadKeyError extends errors_1.DIError {
    constructor(message) {
        super(message);
        this.name = 'BadKeyError';
        this.message = "key not registered with container";
    }
}
exports.DIBadKeyError = DIBadKeyError;
class Container {
    constructor(info, parent) {
        this.entries = new Map();
        this.constructionInfo = info || new Map();
        this.id = genid();
        this.parent = parent;
    }
    get root() {
        let root = this, tmp = root;
        while (tmp) {
            tmp = root.parent;
            if (tmp)
                root = tmp;
        }
        return root;
    }
    makeGlobal() {
        makeGlobal(this);
    }
    /**
    * Inspects the container to determine if a particular key has been registred.
    *
    * @method hasHandler
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    * @param {Boolean} [checkParent=false] Indicates whether or not to check the parent container hierarchy.
    * @return {Boolean} Returns true if the key has been registred; false otherwise.
    */
    hasHandler(key, checkParent = false) {
        if (key === null || key === undefined) {
            throw new DIBadKeyError();
        }
        return !!(this.entries.has(key)
            || (checkParent && this.parent && this.parent.hasHandler(key, checkParent)));
    }
    /**
    * Registers a type (constructor function) by inspecting its registration annotations. If none are found, then the default transient registration is used.
    *
    * @method autoRegister
    * @param {Function} fn The constructor function to use when the dependency needs to be instantiated.
    * @param {Object} [key] The key that identifies the dependency at resolution time; usually a constructor function.
    */
    autoRegister(fn, key, targetKey, resolveIn) {
        var registration;
        let container = resolveIn || this;
        if (fn === null || fn === undefined) {
            throw new DIBadKeyError('no key');
        }
        if (typeof fn === 'function') {
            registration = Reflect.getOwnMetadata(common_1.MetaKeys.registration, fn, targetKey); // Metadata.get(Metadata.registration, fn, targetKey);
            if (registration !== undefined) {
                registration.register(container, key || fn, fn);
            }
            else {
                container.registerTransient(key || fn, fn, targetKey);
            }
        }
        else {
            container.registerInstance(fn, fn);
        }
    }
    /**
    * Unregisters based on key.
    *
    * @method unregister
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    */
    unregister(key) {
        //debug('%s: Unregister key: %s', this.id, key);
        this.entries.delete(key);
    }
    /**
    * Resolves a single instance based on the provided key.
    * If the key is not found, the container will try to auto resolve it.
    *
    * @method get
    * @param {Object} key The key that identifies the object to resolve.
    * @return {Object} Returns the resolved instance.
    */
    get(key, targetKey, resolveIn) {
        //debug("%s: Get %s, target: %s", this.id, String(key), targetKey);
        var entry;
        if (key === null || key === undefined) {
            throw new DIBadKeyError();
        }
        if (key === Container) {
            return this;
        }
        if (key instanceof resolvers_1.Resolver) {
            return key.get(this);
        }
        entry = this.entries.get(key);
        if (entry !== undefined) {
            return entry[0](this);
        }
        if (this.parent && this.parent.hasHandler(key, true)) {
            //debug("%s: found key '%s' on parent", this.id, key);
            return this.parent.get(key, targetKey, resolveIn);
        }
        // No point in auto registrering a string or symbol or number
        if (typeof key === 'string' || typeof key === 'symbol' || typeof key === 'number') {
            throw errors_1.createError('DIResolveError', 'no component registered for key: ' + String(key));
        }
        this.autoRegister(key, null, targetKey, resolveIn);
        entry = this.entries.get(key);
        return entry[0](this);
    }
    /**
    * Resolves all instance registered under the provided key.
    *
    * @method getAll
    * @param {Object} key The key that identifies the objects to resolve.
    * @return {Object[]} Returns an array of the resolved instances.
    */
    getAll(key) {
        var entry;
        if (key === null || key === undefined) {
            throw new DIBadKeyError();
        }
        entry = this.entries.get(key);
        if (entry !== undefined) {
            return entry.map(x => x(this));
        }
        if (this.parent) {
            return this.parent.getAll(key);
        }
        return [];
    }
    /**
    * Creates a new dependency injection container whose parent is the current container.
    *
    * @method createChild
    * @return {Container} Returns a new container instance parented to this.
    */
    createChild() {
        let childContainer = new Container(this.constructionInfo, this);
        //debug("%s: Create child container: %s", this.id, childContainer.id);
        return childContainer;
    }
    /**
     * Resolve dependencies for the given function
     * @method resolveDependencies
     * @param {Function} fn
     * @return {Array<any>}
     */
    resolveDependencies(fn, targetKey) {
        //debug("%s: Resolve dependencies for: %j", this.id, fn.name);
        var info = this._getOrCreateConstructionSet(fn, targetKey), keys = info.keys || [], args = new Array(keys.length);
        var i = 0, ii = 0;
        try {
            for (i = 0, ii = keys.length; i < ii; ++i) {
                args[i] = this.get(keys[i]);
            }
        }
        catch (e) {
            var message = "Error";
            if (i < ii) {
                message += ` The argument at index ${i} (key:${keys[i]}) could not be satisfied.`;
            }
            throw errors_1.createError("DependencyError", message, e);
        }
        return args;
    }
    /**
    * Invokes a function, recursively resolving its dependencies.
    *
    * @method invoke
    * @param {Function} fn The function to invoke with the auto-resolved dependencies.
    * @param {any[]} [deps] Additional function dependencies to use during invocation.
    * @return {Object} Returns the instance resulting from calling the function.
    */
    invoke(fn, deps, targetKey) {
        var info = this._getOrCreateConstructionSet(fn, targetKey);
        try {
            var keys, args;
            if (info.dependencyResolver) {
                args = info.dependencyResolver.resolveDependencies(fn);
            }
            else {
                args = this.resolveDependencies(fn, targetKey);
            }
            if (deps !== undefined && Array.isArray(deps)) {
                args = args.concat(deps);
            }
            return info.activator.invoke(fn, args, targetKey, keys);
        }
        catch (e) {
            var activatingText = info.activator instanceof activators_1.ClassActivator ? 'instantiating' : 'invoking';
            var message = `Error ${activatingText} ${fn.name}.`;
            message += ' Check the inner error for details.';
            throw errors_1.createError("DIInvokeError", message, e);
        }
    }
    registerInstance(key, instance) {
        return this.registerHandler(key, _ => instance);
    }
    registerTransient(key, fn, targetKey) {
        return this.registerHandler(key, x => x.invoke(fn, void 0, targetKey));
    }
    registerSingleton(key, fn, targetKey) {
        var singleton;
        return this.registerHandler(key, x => singleton || (singleton = x.invoke(fn, void 0, targetKey)));
    }
    registerFactory(key, fn, targetKey) {
        decorators_1.factory()(fn);
        return this.registerTransient(key, fn, targetKey);
    }
    registerHandler(key, handler) {
        this._getOrCreateEntry(key).push(handler);
        return this;
    }
    _getOrCreateEntry(key) {
        if (key === null || key === undefined) {
            throw new errors_1.DIError('key cannot be null or undefined.  (Are you trying to inject something that doesn\'t exist with DI?)');
        }
        var entry = this.entries.get(key);
        if (entry === undefined) {
            entry = [];
            this.entries.set(key, entry);
        }
        return entry;
    }
    _getOrCreateConstructionSet(fn, targetKey) {
        var info = this.constructionInfo.get(fn);
        if (info === undefined) {
            info = this._createConstructionSet(fn, targetKey);
            this.constructionInfo.set(fn, info);
        }
        return info;
    }
    _createConstructionSet(fn, targetKey) {
        let info = {
            activator: Reflect.getOwnMetadata(common_1.MetaKeys.instanceActivator, fn, targetKey) || activators_1.ClassActivator.instance,
            dependencyResolver: Reflect.getOwnMetadata(common_1.MetaKeys.dependencyResolver, fn, targetKey) || this
        };
        if (fn.inject !== undefined) {
            if (typeof fn.inject === 'function') {
                info.keys = fn.inject();
            }
            else {
                info.keys = fn.inject;
            }
            return info;
        }
        info.keys = Reflect.getOwnMetadata(common_1.MetaKeys.paramTypes, fn, targetKey)
            || common_1.getFunctionParameters(fn, true) || common_1.emptyParameters;
        return info;
    }
}
exports.Container = Container;
var _global;
function makeGlobal(container) {
    _global = container;
}
exports.makeGlobal = makeGlobal;
function global() {
    if (!_global)
        _global = new Container();
    return _global;
}
exports.global = global;
