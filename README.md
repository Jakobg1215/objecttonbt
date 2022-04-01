# objecttonbt

Covert an object to a the Named Binary Tag file format.

This is a way to store data in a compressed way instead of useing json.

This implements what is said [here](https://wiki.vg/NBT)!

# Usage

First you must import the function to your code.

For Javascript

```js
import { objectToNbt } from 'objecttonbt';
```

To convert an object just run the function with an object as an input.

```js
const test = {};
objectToNbt(test);
```

It will always return a Buffer instance.

```js
const test = {};
objectToNbt(test); // Should return Buffer <10, 0, 0, 0>

const test2 = {
    value: 10;
};
objectToNbt(test2); // Should return Buffer <10, 0, 0, 3, 5, 0, 118, 97, 108, 117, 101, 10, 0, 0, 0, 0>
```

## Types

You can specify what type tag the value is going to be.

You can do this by making it a string an puting a specific character at the end.

### Byte

```js
const byte = {
    b: '10b';
}
objectToNbt(byte);
```

### Short

```js
const short = {
    s: '20s';
}
objectToNbt(short);
```

### Int

```js
const int = {
    i: 30; // Do not put an i at the end just a number value
}
objectToNbt(int);
```

### Long

```js
const long1 = {
    l: '40l';
}
objectToNbt(long1);
const long2 = {
    l: 40n; // You can use BigInts for longs
}
objectToNbt(long2);
```

### Float

```js
const float1 = {
    f: '50.1f';
}
objectToNbt(float1);
const float2 = {
    f: 60.2; // Number values that are floats will be converted to floats
}
objectToNbt(float2);
```

### Double

```js
const double = {
    d: '70.3d',
};
objectToNbt(double);
```

#### Arrays

If there are diffent types in an array it will cause an error.

Always make sure ever element in an array is the same type.

### Byte Array

```js
const byteArray = {
    ba: new Int8Array([35, -43, 76]),
};
objectToNbt(byteArray);
```

### Int Array

```js
const intArray = {
    ia: new Int32Array([-3214, 543, 7654]),
};
objectToNbt(intArray);
```

### Long Array

```js
const longArray = {
    la: new BigInt64Array([423n, -54645120n, 53453130n]),
};
objectToNbt(longArray);
```

## Other

The data can only be long as the [max buffer length](https://nodejs.org/dist/latest-v17.x/docs/api/buffer.html#bufferconstantsmax_length).

Functions, Symbols, null, and undefined will default to an empty nameless int.
