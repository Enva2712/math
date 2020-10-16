# Math Stuff

This is a monorepo for math related code that I write.

## Matrix math

```ts
import { Matrix } from "enva2712-math";

// Construct matrices from arrays
const myMatrix = Matrix.fromArray([
    [1, 2],
    [3, 4],
]);

// strings
const myOtherMatrix = Matrix.fromString(`4, 3\n2, 1`);

// or tagged templates
const identityMatrix = Matrix.tag`
    1, 0
    0, 1
`;

// add, subtract, and multiply by scalar values
myMatrix.mul(2).add(8).sub(9); // => Matrix { ... }

// or other matricies
myMatrix
    .add(myOtherMatrix)
    .mul(identityMatrix)
    // And check for equality
    .equals(myMatrix); // => false
```
