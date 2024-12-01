"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ReactiveMap_instances, _ReactiveMap_subscriptions, _ReactiveMap_cache, _ReactiveMap_deltaKeyVal, _ReactiveMap_propagate;
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./utils/enums");
class ReactiveMap extends Map {
    constructor(entries) {
        super(entries);
        _ReactiveMap_instances.add(this);
        _ReactiveMap_subscriptions.set(this, new Set());
        _ReactiveMap_cache.set(this, void 0);
        _ReactiveMap_deltaKeyVal.set(this, {
            key: undefined,
            value: undefined
        });
    }
    set(key, value) {
        super.set(key, value);
        __classPrivateFieldGet(this, _ReactiveMap_deltaKeyVal, "f").key = key;
        __classPrivateFieldGet(this, _ReactiveMap_deltaKeyVal, "f").value = value;
        __classPrivateFieldGet(this, _ReactiveMap_instances, "m", _ReactiveMap_propagate).call(this, enums_1.ReactiveMapEvents.set);
        return this;
    }
    delete(key) {
        const results = super.delete(key);
        if (results) {
            __classPrivateFieldGet(this, _ReactiveMap_deltaKeyVal, "f").key = key;
            __classPrivateFieldGet(this, _ReactiveMap_deltaKeyVal, "f").value = super.get(key);
            __classPrivateFieldGet(this, _ReactiveMap_instances, "m", _ReactiveMap_propagate).call(this, enums_1.ReactiveMapEvents.delete);
        }
        return results;
    }
    clear() {
        __classPrivateFieldSet(this, _ReactiveMap_cache, new Map(this), "f");
        super.clear();
        __classPrivateFieldGet(this, _ReactiveMap_instances, "m", _ReactiveMap_propagate).call(this, enums_1.ReactiveMapEvents.clear);
    }
    subscribe(callback) {
        const wrapper = { callback };
        __classPrivateFieldGet(this, _ReactiveMap_subscriptions, "f").add(wrapper);
        return {
            unsubscribe: () => {
                __classPrivateFieldGet(this, _ReactiveMap_subscriptions, "f").delete(wrapper);
            }
        };
    }
}
_ReactiveMap_subscriptions = new WeakMap(), _ReactiveMap_cache = new WeakMap(), _ReactiveMap_deltaKeyVal = new WeakMap(), _ReactiveMap_instances = new WeakSet(), _ReactiveMap_propagate = function _ReactiveMap_propagate(event) {
    for (const subscription of __classPrivateFieldGet(this, _ReactiveMap_subscriptions, "f")) {
        new Promise((resolve) => {
            if (__classPrivateFieldGet(this, _ReactiveMap_deltaKeyVal, "f").key) {
                subscription.callback(event, { key: __classPrivateFieldGet(this, _ReactiveMap_deltaKeyVal, "f").key, value: __classPrivateFieldGet(this, _ReactiveMap_deltaKeyVal, "f").value });
                __classPrivateFieldGet(this, _ReactiveMap_deltaKeyVal, "f").key = undefined;
                __classPrivateFieldGet(this, _ReactiveMap_deltaKeyVal, "f").value = undefined;
            }
            else {
                if (!__classPrivateFieldGet(this, _ReactiveMap_cache, "f"))
                    throw new EvalError('Internal error, #cache should not be undefined');
                subscription.callback(event, __classPrivateFieldGet(this, _ReactiveMap_cache, "f"));
                __classPrivateFieldSet(this, _ReactiveMap_cache, undefined, "f");
            }
            resolve();
        });
    }
};
//# sourceMappingURL=main.js.map