import { test } from "tap";
import Matrix from "../matrix";

const m1 = Matrix.tag`
    -5, -4
    -2, -3
`;

const m2 = Matrix.tag`
    5, -8,  4
    4,  2,  1
    1,  1, -5
`;

const m3 = Matrix.tag`
    1, -2,  40
`;

test("Detects square matricies", async ({ assert, assertNot }) => {
    assert(m1.isSquare(), "Matrix 1 is detected as square");
    assert(m2.isSquare(), "Matrix 2 is detected as square");
    assertNot(m3.isSquare(), "Matrix 3 is detected as non-square");
});

test("Properly calculates determinants", async ({ assert }) => {
    assert(m1.det().equals(7), "Matrix 1 computes proper determinant");
    assert(m2.det().equals(-50)), "Matrix 2 computes proper determinant";
});
