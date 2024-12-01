# Reactive Map

## Description
Javascript Map Extension.

Implementing Observer Design pattern through SOLID
principles, providing reactivity for: 
* set.
* clear.
* delete. 

Notifying the events and deltas, upon invoking those methods.

# Disclaimer
This is not part of rxjs library, and it is not compatible with rxjs Observable (at this moment).

For efficiency and speed, I've decided not to enforce immutability, that is upon <strong>YOU</strong>, the consumer to never manipulate the delta, and only do reads from it.

## install
`npm i reactive-map`

## Use
```
import {ReactiveMap} from "reactive-map"

function callback(event, delta){
    console.log(event,delta);
    //Do code...
}

const reactiveMap = new ReactiveMap();
const subscription = reactiveMap.subscribe();

reactiveMap.set("hello", "world");
//Output: set , {key: "hello", value: "world"}

reactiveMap.set("goodbye", "developer");
//Output: set , {key: "goodbye", value: "developer"}
console.log(reactiveMap.size); //Ouput 2

reactiveMap.delete("hello");
//Output: delete , {key: "goodbye", value: "developer"}
console.log(reactiveMap.size) //Ouput 1

reactiveMap.clear()
//Output: clear , Map(1) { "hello" => "world" }
console.log(reactiveMap.size) //Ouput 0

//free memory, stop event propagation
subscription.unsubscribe();

```

### Note:
in future version, I might add WeakRef to allow the gardbadge collection to free memory that wasn't unsubscribe, and remove it from event propagation, this is yet to be decided.
