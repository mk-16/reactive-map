import { ReactiveMapEvents } from "./utils/enums.cjs";
import { ReactiveMapCallback, ReactiveMapCallbackWrapper, ReactiveMapEventDelta, ReactiveMapSubscription } from "./utils/types.cjs";

export class ReactiveMap<Key, Value> extends Map<Key, Value> {

    #subscriptions = new Set<ReactiveMapCallbackWrapper<Key, Value>>();
    #cache: Map<Key, Value> | undefined;
    #deltaKeyVal: ReactiveMapEventDelta<Key | undefined, Value> = {
        key: undefined,
        value: undefined
    }

    #propagate(event: ReactiveMapEvents) {
        for (const subscription of this.#subscriptions) {
            new Promise<void>((resolve) => {
                if (this.#deltaKeyVal.key) {
                    subscription.callback(event, { key: this.#deltaKeyVal.key, value: this.#deltaKeyVal.value });
                    this.#deltaKeyVal.key = undefined;
                    this.#deltaKeyVal.value = undefined;
                }
                else {
                    if (!this.#cache)
                        throw new EvalError('Internal error, #cache should not be undefined')
                    subscription.callback(event, this.#cache);
                    this.#cache = undefined;
                }
                resolve()
            });
        }
    }

    constructor(entries?: readonly (readonly [Key, Value])[] | null) {
        super(entries);
    }

    override set(key: Key, value: Value): this {
        super.set(key, value);
        this.#deltaKeyVal.key = key;
        this.#deltaKeyVal.value = value;
        this.#propagate(ReactiveMapEvents.set);
        return this;
    }

    override delete(key: Key): boolean {
        const results = super.delete(key);
        if (results) {
            this.#deltaKeyVal.key = key
            this.#deltaKeyVal.value = super.get(key)
            this.#propagate(ReactiveMapEvents.delete);
        }
        return results;
    }


    override clear(): void {
        this.#cache = new Map(this);
        super.clear();
        this.#propagate(ReactiveMapEvents.clear);
    }

    subscribe(callback: ReactiveMapCallback<Key, Value>): ReactiveMapSubscription {
        const wrapper = { callback };
        this.#subscriptions.add(wrapper);
        return {
            unsubscribe: () => {
                this.#subscriptions.delete(wrapper);
            }
        }
    }
}
