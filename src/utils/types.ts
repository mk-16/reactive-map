import { ReactiveMapEvents } from "./enums";

export type ReactiveMapCallback<Key, Value> =
    (event: ReactiveMapEvents, delta: ReactiveMapEventDelta<Key, Value> | Map<Key, Value>) => any;
export type ReactiveMapSubscription = {
    unsubscribe(): void
}
export type ReactiveMapCallbackWrapper<Key, Value> = {
    callback: ReactiveMapCallback<Key, Value>;
}
export type ReactiveMapEventDelta<Key, Value> = {
    key: Key;
    value?: Value;
};