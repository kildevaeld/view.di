(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('reflect-metadata')) :
	typeof define === 'function' && define.amd ? define(['exports', 'reflect-metadata'], factory) :
	(factory((global.viewjs = global.viewjs || {}, global.viewjs.di = {})));
}(this, (function (exports) { 'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var MetaKeys = {
  registration: Symbol.for('di:registration'),
  instanceActivator: Symbol.for('di:instance-activator'),
  dependencyResolver: Symbol.for('di:dependency-resolver'),
  paramTypes: 'design:paramtypes',
  properties: 'design:properties' // This should match, what tsc is emitting

};
var emptyParameters = Object.freeze([]);
var paramRegEx = /function[^(]*\(([^)]*)\)/i;
function getFunctionParameters(fn) {
  var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var params = Reflect.getOwnMetadata(MetaKeys.paramTypes, fn);

  if (!params) {
    var match = fn.toString().match(paramRegEx);

    if (match) {
      params = match[1].replace(/\W+/, ' ').split(' ').map(function (x) {
        return x.replace(',', '').trim();
      }).filter(function (m) {
        return m !== '';
      });
      if (cache) Reflect.defineMetadata(MetaKeys.paramTypes, params, fn);
    }
  }

  return params || [];
}

var DIError =
/*#__PURE__*/
function (_Error) {
  _inherits(DIError, _Error);

  function DIError() {
    var _this;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, DIError);

    _this = _possibleConstructorReturn(this, (DIError.__proto__ || Object.getPrototypeOf(DIError)).call(this, message));
    _this.message = message;
    Object.setPrototypeOf(_this, DIError.prototype);
    return _this;
  }

  _createClass(DIError, [{
    key: "toString",
    value: function toString() {
      return "[".concat(this.name, ": ").concat(this.message, "]");
    }
  }]);

  return DIError;
}(Error);

var DIAggregateError =
/*#__PURE__*/
function (_DIError) {
  _inherits(DIAggregateError, _DIError);

  function DIAggregateError(message, errors) {
    var _this2;

    _classCallCheck(this, DIAggregateError);

    _this2 = _possibleConstructorReturn(this, (DIAggregateError.__proto__ || Object.getPrototypeOf(DIAggregateError)).call(this, message));
    _this2.error = errors;
    Object.setPrototypeOf(_this2, DIAggregateError.prototype);
    return _this2;
  }

  _createClass(DIAggregateError, [{
    key: "toString",
    value: function toString() {
      if (this.error == null) {
        return "[".concat(this.name, ": ").concat(this.message, "]");
      } else {
        return String.prototype.toString.call(this.error);
      }
    }
  }, {
    key: "inner",
    get: function get() {
      if (this.error && this.error.inner) return this.error.inner;
      return this.error;
    }
  }]);

  return DIAggregateError;
}(DIError);

function createError(name, message, error) {
  var e;

  if (error) {
    e = new DIAggregateError(message, error);
  } else {
    e = new DIError(message);
  }

  e.name = name;
  return e;
}

/**
* Used to instantiate a class.
*
* @class ClassActivator
* @constructor
*/
var ClassActivator =
/*#__PURE__*/
function () {
  function ClassActivator() {
    _classCallCheck(this, ClassActivator);
  }

  _createClass(ClassActivator, [{
    key: "invoke",
    value: function invoke(fn, args) {
      return Reflect.construct(fn, args);
    }
  }]);

  return ClassActivator;
}();

ClassActivator.instance = new ClassActivator();
/**
* Used to invoke a factory method.
*
* @class FactoryActivator
* @constructor
*/

var FactoryActivator =
/*#__PURE__*/
function () {
  function FactoryActivator() {
    _classCallCheck(this, FactoryActivator);
  }

  _createClass(FactoryActivator, [{
    key: "invoke",
    value: function invoke(fn, args) {
      return fn.apply(undefined, args);
    }
  }]);

  return FactoryActivator;
}();

FactoryActivator.instance = new FactoryActivator();

var AsyncClassActivator =
/*#__PURE__*/
function () {
  function AsyncClassActivator() {
    _classCallCheck(this, AsyncClassActivator);
  }

  _createClass(AsyncClassActivator, [{
    key: "invoke",
    value: function invoke(fn, args) {
      return Promise.all(args).then(function (args) {
        return Reflect.construct(fn, args);
      });
    }
  }]);

  return AsyncClassActivator;
}();

AsyncClassActivator.instance = new AsyncClassActivator();

/**
* An abstract resolver used to allow functions/classes to specify custom dependency resolution logic.
*
* @class Resolver
* @constructor
*/
var Resolver = function Resolver() {
  _classCallCheck(this, Resolver);
};
/**
* Used to allow functions/classes to specify lazy resolution logic.
*
* @class Lazy
* @constructor
* @extends Resolver
* @param {Object} key The key to lazily resolve.
*/


var Lazy =
/*#__PURE__*/
function (_Resolver) {
  _inherits(Lazy, _Resolver);

  function Lazy(key) {
    var _this;

    _classCallCheck(this, Lazy);

    _this = _possibleConstructorReturn(this, (Lazy.__proto__ || Object.getPrototypeOf(Lazy)).call(this));
    _this.key = key;
    return _this;
  }
  /**
  * Called by the container to lazily resolve the dependency into a lazy locator function.
  *
  * @method get
  * @param {Container} container The container to resolve from.
  * @return {Function} Returns a function which can be invoked at a later time to obtain the actual dependency.
  */


  _createClass(Lazy, [{
    key: "get",
    value: function get(container) {
      var _this2 = this;

      return function () {
        return container.get(_this2.key);
      };
    }
    /**
    * Creates a Lazy Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to lazily resolve.
    * @return {Lazy} Returns an insance of Lazy for the key.
    */

  }], [{
    key: "of",
    value: function of(key) {
      return new Lazy(key);
    }
  }]);

  return Lazy;
}(Resolver);
/**
* Used to allow functions/classes to specify resolution of all matches to a key.
*
* @class All
* @constructor
* @extends Resolver
* @param {Object} key The key to lazily resolve all matches for.
*/


var All =
/*#__PURE__*/
function (_Resolver2) {
  _inherits(All, _Resolver2);

  function All(key) {
    var _this3;

    _classCallCheck(this, All);

    _this3 = _possibleConstructorReturn(this, (All.__proto__ || Object.getPrototypeOf(All)).call(this));
    _this3.key = key;
    return _this3;
  }
  /**
  * Called by the container to resolve all matching dependencies as an array of instances.
  *
  * @method get
  * @param {Container} container The container to resolve from.
  * @return {Object[]} Returns an array of all matching instances.
  */


  _createClass(All, [{
    key: "get",
    value: function get(container) {
      return container.getAll(this.key);
    }
    /**
    * Creates an All Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to resolve all instances for.
    * @return {All} Returns an insance of All for the key.
    */

  }], [{
    key: "of",
    value: function of(key) {
      return new All(key);
    }
  }]);

  return All;
}(Resolver);
/**
* Used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
*
* @class Optional
* @constructor
* @extends Resolver
* @param {Object} key The key to optionally resolve for.
* @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
*/


var Optional =
/*#__PURE__*/
function (_Resolver3) {
  _inherits(Optional, _Resolver3);

  function Optional(key) {
    var _this4;

    var checkParent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, Optional);

    _this4 = _possibleConstructorReturn(this, (Optional.__proto__ || Object.getPrototypeOf(Optional)).call(this));
    _this4.key = key;
    _this4.checkParent = checkParent;
    return _this4;
  }
  /**
  * Called by the container to provide optional resolution of the key.
  *
  * @method get
  * @param {Container} container The container to resolve from.
  * @return {Object} Returns the instance if found; otherwise null.
  */


  _createClass(Optional, [{
    key: "get",
    value: function get(container) {
      if (container.hasHandler(this.key, this.checkParent)) {
        return container.get(this.key);
      }

      return null;
    }
    /**
    * Creates an Optional Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to optionally resolve for.
    * @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
    * @return {Optional} Returns an insance of Optional for the key.
    */

  }], [{
    key: "of",
    value: function of(key) {
      var checkParent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return new Optional(key, checkParent);
    }
  }]);

  return Optional;
}(Resolver);
/**
* Used to inject the dependency from the parent container instead of the current one.
*
* @class Parent
* @constructor
* @extends Resolver
* @param {Object} key The key to resolve from the parent container.
*/


var Parent =
/*#__PURE__*/
function (_Resolver4) {
  _inherits(Parent, _Resolver4);

  function Parent(key) {
    var _this5;

    _classCallCheck(this, Parent);

    _this5 = _possibleConstructorReturn(this, (Parent.__proto__ || Object.getPrototypeOf(Parent)).call(this));
    _this5.key = key;
    return _this5;
  }
  /**
  * Called by the container to load the dependency from the parent container
  *
  * @method get
  * @param {Container} container The container to resolve the parent from.
  * @return {Function} Returns the matching instance from the parent container
  */


  _createClass(Parent, [{
    key: "get",
    value: function get(container) {
      return container.parent ? container.parent.get(this.key) : null;
    }
    /**
    * Creates a Parent Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to resolve.
    * @return {Parent} Returns an insance of Parent for the key.
    */

  }], [{
    key: "of",
    value: function of(key) {
      return new Parent(key);
    }
  }]);

  return Parent;
}(Resolver);

/**
* Used to allow functions/classes to indicate that they should be registered as transients with the container.
*
* @class TransientRegistration
* @constructor
* @param {Object} [key] The key to register as.
*/
var TransientRegistration =
/*#__PURE__*/
function () {
  function TransientRegistration(key) {
    _classCallCheck(this, TransientRegistration);

    this.key = key;
  }
  /**
  * Called by the container to register the annotated function/class as transient.
  *
  * @method register
  * @param {Container} container The container to register with.
  * @param {Object} key The key to register as.
  * @param {Object} fn The function to register (target of the annotation).
  */


  _createClass(TransientRegistration, [{
    key: "register",
    value: function register(container, key, fn) {
      container.registerTransient(this.key || key, fn);
    }
  }]);

  return TransientRegistration;
}();
/**
* Used to allow functions/classes to indicate that they should be registered as singletons with the container.
*
* @class SingletonRegistration
* @constructor
* @param {Object} [key] The key to register as.
*/


var SingletonRegistration =
/*#__PURE__*/
function () {
  function SingletonRegistration(keyOrRegisterInChild) {
    var registerInChild = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, SingletonRegistration);

    if (typeof keyOrRegisterInChild === 'boolean') {
      this.registerInChild = keyOrRegisterInChild;
    } else {
      this.key = keyOrRegisterInChild;
      this.registerInChild = registerInChild;
    }
  }
  /**
  * Called by the container to register the annotated function/class as a singleton.
  *
  * @method register
  * @param {Container} container The container to register with.
  * @param {Object} key The key to register as.
  * @param {Object} fn The function to register (target of the annotation).
  */


  _createClass(SingletonRegistration, [{
    key: "register",
    value: function register(container, key, fn) {
      var destination = this.registerInChild ? container : container.root;
      destination.registerSingleton(this.key || key, fn);
    }
  }]);

  return SingletonRegistration;
}();

/**
 * Auto inject dependencies.
 */

function autoinject(target) {
  target.inject = Reflect.getOwnMetadata(MetaKeys.paramTypes, target) || emptyParameters;
}
function inject() {
  for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
    rest[_key] = arguments[_key];
  }

  return function (target) {
    target.inject = rest;
  };
}
function registration(value, targetKey) {
  return function (target) {
    Reflect.defineMetadata(MetaKeys.registration, value, target, targetKey);
  };
}
function transient(key, targetKey) {
  return registration(new TransientRegistration(key), targetKey);
}
function singleton(keyOrRegisterInChild) {
  var registerInChild = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var targetKey = arguments[2];
  return registration(new SingletonRegistration(keyOrRegisterInChild, registerInChild), targetKey);
}
function instanceActivator(value, targetKey) {
  return function (target) {
    Reflect.defineMetadata(MetaKeys.instanceActivator, value, target, targetKey);
  };
}
function factory() {
  return instanceActivator(FactoryActivator.instance);
}
function dependencyResolve(value, targetKey) {
  return function (target) {
    Reflect.defineMetadata(MetaKeys.dependencyResolver, value, target, targetKey);
  };
}

var counter = 0;

function genid() {
  return ++counter + "";
}

var DIBadKeyError =
/*#__PURE__*/
function (_DIError) {
  _inherits(DIBadKeyError, _DIError);

  function DIBadKeyError(message) {
    var _this;

    _classCallCheck(this, DIBadKeyError);

    _this = _possibleConstructorReturn(this, (DIBadKeyError.__proto__ || Object.getPrototypeOf(DIBadKeyError)).call(this, message));
    _this.name = 'BadKeyError';
    _this.message = "key not registered with container";
    return _this;
  }

  return DIBadKeyError;
}(DIError);

var Container =
/*#__PURE__*/
function () {
  function Container(info, parent) {
    _classCallCheck(this, Container);

    this.entries = new Map();
    this.constructionInfo = info || new Map();
    this.id = genid();
    this.parent = parent;
  }

  _createClass(Container, [{
    key: "makeGlobal",
    value: function makeGlobal() {
      _makeGlobal(this);
    }
    /**
    * Inspects the container to determine if a particular key has been registred.
    *
    * @method hasHandler
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    * @param {Boolean} [checkParent=false] Indicates whether or not to check the parent container hierarchy.
    * @return {Boolean} Returns true if the key has been registred; false otherwise.
    */

  }, {
    key: "hasHandler",
    value: function hasHandler(key) {
      var checkParent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (key === null || key === undefined) {
        throw new DIBadKeyError();
      }

      return !!(this.entries.has(key) || checkParent && this.parent && this.parent.hasHandler(key, checkParent));
    }
    /**
    * Registers a type (constructor function) by inspecting its registration annotations. If none are found, then the default transient registration is used.
    *
    * @method autoRegister
    * @param {Function} fn The constructor function to use when the dependency needs to be instantiated.
    * @param {Object} [key] The key that identifies the dependency at resolution time; usually a constructor function.
    */

  }, {
    key: "autoRegister",
    value: function autoRegister(fn, key, targetKey, resolveIn) {
      var registration$$1;
      var container = resolveIn || this;

      if (fn === null || fn === undefined) {
        throw new DIBadKeyError('no key');
      }

      if (typeof fn === 'function') {
        registration$$1 = Reflect.getOwnMetadata(MetaKeys.registration, fn, targetKey); // Metadata.get(Metadata.registration, fn, targetKey);

        if (registration$$1 !== undefined) {
          registration$$1.register(container, key || fn, fn);
        } else {
          container.registerTransient(key || fn, fn, targetKey);
        }
      } else {
        container.registerInstance(fn, fn);
      }
    }
    /**
    * Unregisters based on key.
    *
    * @method unregister
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    */

  }, {
    key: "unregister",
    value: function unregister(key) {
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

  }, {
    key: "get",
    value: function get(key, targetKey, resolveIn) {
      //debug("%s: Get %s, target: %s", this.id, String(key), targetKey);
      var entry;

      if (key === null || key === undefined) {
        throw new DIBadKeyError();
      }

      if (key === Container) {
        return this;
      }

      if (key instanceof Resolver) {
        return key.get(this);
      }

      entry = this.entries.get(key);

      if (entry !== undefined) {
        return entry[0](this);
      }

      if (this.parent && this.parent.hasHandler(key, true)) {
        //debug("%s: found key '%s' on parent", this.id, key);
        return this.parent.get(key, targetKey, resolveIn);
      } // No point in auto registrering a string or symbol or number


      if (typeof key === 'string' || _typeof(key) === 'symbol' || typeof key === 'number') {
        throw createError('DIResolveError', 'no component registered for key: ' + String(key));
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

  }, {
    key: "getAll",
    value: function getAll(key) {
      var _this2 = this;

      var entry;

      if (key === null || key === undefined) {
        throw new DIBadKeyError();
      }

      entry = this.entries.get(key);

      if (entry !== undefined) {
        return entry.map(function (x) {
          return x(_this2);
        });
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

  }, {
    key: "createChild",
    value: function createChild() {
      var childContainer = new Container(this.constructionInfo, this); //debug("%s: Create child container: %s", this.id, childContainer.id);

      return childContainer;
    }
    /**
     * Resolve dependencies for the given function
     * @method resolveDependencies
     * @param {Function} fn
     * @return {Array<any>}
     */

  }, {
    key: "resolveDependencies",
    value: function resolveDependencies(fn, targetKey) {
      //debug("%s: Resolve dependencies for: %j", this.id, fn.name);
      var info = this._getOrCreateConstructionSet(fn, targetKey),
          keys = info.keys || [],
          args = new Array(keys.length);

      var i = 0,
          ii = 0;

      try {
        for (i = 0, ii = keys.length; i < ii; ++i) {
          args[i] = this.get(keys[i]);
        }
      } catch (e) {
        var message = "Error";

        if (i < ii) {
          message += " The argument at index ".concat(i, " (key:").concat(keys[i], ") could not be satisfied.");
        }

        throw createError("DependencyError", message, e);
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

  }, {
    key: "invoke",
    value: function invoke(fn, deps, targetKey) {
      var info = this._getOrCreateConstructionSet(fn, targetKey);

      try {
        var keys, args;

        if (info.dependencyResolver) {
          args = info.dependencyResolver.resolveDependencies(fn);
        } else {
          args = this.resolveDependencies(fn, targetKey);
        }

        if (deps !== undefined && Array.isArray(deps)) {
          args = args.concat(deps);
        }

        return info.activator.invoke(fn, args, targetKey, keys);
      } catch (e) {
        var activatingText = info.activator instanceof ClassActivator ? 'instantiating' : 'invoking';
        var message = "Error ".concat(activatingText, " ").concat(fn.name, ".");
        message += ' Check the inner error for details.';
        throw createError("DIInvokeError", message, e);
      }
    }
  }, {
    key: "registerInstance",
    value: function registerInstance(key, instance) {
      return this.registerHandler(key, function (_) {
        return instance;
      });
    }
  }, {
    key: "registerTransient",
    value: function registerTransient(key, fn, targetKey) {
      return this.registerHandler(key, function (x) {
        return x.invoke(fn, void 0, targetKey);
      });
    }
  }, {
    key: "registerSingleton",
    value: function registerSingleton(key, fn, targetKey) {
      var singleton$$1;
      return this.registerHandler(key, function (x) {
        return singleton$$1 || (singleton$$1 = x.invoke(fn, void 0, targetKey));
      });
    }
  }, {
    key: "registerFactory",
    value: function registerFactory(key, fn, targetKey) {
      factory()(fn);
      return this.registerTransient(key, fn, targetKey);
    }
  }, {
    key: "registerHandler",
    value: function registerHandler(key, handler) {
      this._getOrCreateEntry(key).push(handler);

      return this;
    }
  }, {
    key: "_getOrCreateEntry",
    value: function _getOrCreateEntry(key) {
      if (key === null || key === undefined) {
        throw new DIError('key cannot be null or undefined.  (Are you trying to inject something that doesn\'t exist with DI?)');
      }

      var entry = this.entries.get(key);

      if (entry === undefined) {
        entry = [];
        this.entries.set(key, entry);
      }

      return entry;
    }
  }, {
    key: "_getOrCreateConstructionSet",
    value: function _getOrCreateConstructionSet(fn, targetKey) {
      var info = this.constructionInfo.get(fn);

      if (info === undefined) {
        info = this._createConstructionSet(fn, targetKey);
        this.constructionInfo.set(fn, info);
      }

      return info;
    }
  }, {
    key: "_createConstructionSet",
    value: function _createConstructionSet(fn, targetKey) {
      var info = {
        activator: Reflect.getOwnMetadata(MetaKeys.instanceActivator, fn, targetKey) || ClassActivator.instance,
        dependencyResolver: Reflect.getOwnMetadata(MetaKeys.dependencyResolver, fn, targetKey) || this
      };

      if (fn.inject !== undefined) {
        if (typeof fn.inject === 'function') {
          info.keys = fn.inject();
        } else {
          info.keys = fn.inject;
        }

        return info;
      }

      info.keys = Reflect.getOwnMetadata(MetaKeys.paramTypes, fn, targetKey) || getFunctionParameters(fn, true) || emptyParameters;
      return info;
    }
  }, {
    key: "root",
    get: function get() {
      var root = this,
          tmp = root;

      while (tmp) {
        tmp = root.parent;
        if (tmp) root = tmp;
      }

      return root;
    }
  }]);

  return Container;
}();

var _global;

function _makeGlobal(container) {
  _global = container;
}

function global() {
  if (!_global) _global = new Container();
  return _global;
}

exports.makeGlobal = _makeGlobal;
exports.global = global;
exports.DIBadKeyError = DIBadKeyError;
exports.Container = Container;
exports.createError = createError;
exports.DIError = DIError;
exports.DIAggregateError = DIAggregateError;
exports.autoinject = autoinject;
exports.inject = inject;
exports.registration = registration;
exports.transient = transient;
exports.singleton = singleton;
exports.instanceActivator = instanceActivator;
exports.factory = factory;
exports.dependencyResolve = dependencyResolve;
exports.ClassActivator = ClassActivator;
exports.FactoryActivator = FactoryActivator;
exports.AsyncClassActivator = AsyncClassActivator;
exports.Resolver = Resolver;
exports.Lazy = Lazy;
exports.All = All;
exports.Optional = Optional;
exports.Parent = Parent;
exports.MetaKeys = MetaKeys;
exports.emptyParameters = emptyParameters;
exports.getFunctionParameters = getFunctionParameters;

Object.defineProperty(exports, '__esModule', { value: true });

})));
