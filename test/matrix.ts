import test from "ava";
import Matrix from "../src/matrix";

const m1 = Matrix.fromArray([
    [-5, -4],
    [-2, -3],
]);

const m2 = Matrix.fromString("1, -2, 40");

const m3 = Matrix.tag`
    5, -8,  4
    4,  2,  1
    1,  1, -5
`;

const identity2x2 = Matrix.tag`
    1, 0
    0, 1
`;

test("can check matrix equality", async ({ assert }) => {
    assert(m1.equals(m1), "matrix 1 equals itself");
    assert(m2.equals(Matrix.tag`1, -2, 40`), "matrix 2 equals itself");
    assert(
        m3.equals(Matrix.tag`
        5, -8,  4
        4,  2,  1
        1,  1, -5
    `),
        "matrix 3 equals itself"
    );
});

test("can add and subtract scalar value to matricies", async ({ assert }) => {
    assert(
        m1.add(5).equals(Matrix.tag`
        0, 1
        3, 2
    `),
        "matrix 1 plus 5 is properly computed"
    );
    assert(
        m2.sub(2).equals(Matrix.tag`-1, -4, 38`),
        "matrix 2 - 2 is properly computed"
    );
});

test("can multiply matricies", async ({ assert }) => {
    assert(m1.mul(identity2x2).equals(m1), "matrix 1 * the identity is itself");
    assert(
        m2.mul(m3).equals(Matrix.fromString("37, 28, -198")),
        "matrix 2 times matrix 3 is properly computed"
    );
});

test("can detect square matricies", async ({ assert }) => {
    assert(m1.isSquare(), "Matrix 1 is detected as square");
    assert(!m2.isSquare(), "Matrix 2 is detected as non-square");
    assert(m3.isSquare(), "Matrix 3 is detected as square");
});

test("can find minor of matrices", async ({ assert, throws }) => {
    assert(m1.minor(1, 1).equals(Matrix.fromString('-3')));
    assert(m3.minor(1, 2).equals(Matrix.tag`
        4,  1
        1, -5
    `));
    throws(() => m1.minor(0, 0));
})

test("can calculate determinants", async ({ assert }) => {
    assert(m1.det().equals(7), "Matrix 1 computes proper determinant");
    assert(m3.det().equals(-215), "Matrix 3 computes proper determinant");
});

/*
test("can find cofactor matrices", async ({ assert }) => {
    assert(m1.cofactorMatrix().equals(Matrix.tag`
        -3,  2
         4, -5
    `));
})
*/
