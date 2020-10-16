import Fraction from "fraction.js";

export default class Matrix {
    readonly cells: Fraction[];
    readonly width: number;

    static fromArray(entries: number[][]): Matrix {
        const cells = entries.map((r) => r.map((c) => new Fraction(c))).flat();
        return new Matrix(cells, entries[0].length);
    }

    static fromString(string: string): Matrix {
        const rows = string
            .split("\n")
            .filter((l) => !!l)
            .map((line) => line.split(","));
        const cells = rows.flat().map((cell) => new Fraction(cell.trim() || 0));
        return new Matrix(cells, rows[0].length);
    }

    static tag(entries: TemplateStringsArray, ...values: unknown[]): Matrix {
        const string = entries.reduce(
            (acc, str, i) =>
                `${acc}${str}${i < values.length ? values[i] : ""}`,
            ""
        );
        return Matrix.fromString(string);
    }

    toString(): string {
        const rows = [...this.rows()].map((r) => r.map((c) => c.toString()));
        const longestEntry = rows
            .flat()
            .reduce((acc, cur) => Math.max(acc, cur.length), 0);
        return rows
            .map((r) => r.map((c) => c.padStart(longestEntry + 1)).join(", "))
            .join("\n");
    }

    constructor(cells: Fraction[], width: number) {
        this.cells = cells;
        this.width = width;
    }

    clone(): Matrix {
        const clonedCells = this.cells.map((f) => f.clone());
        return new Matrix(clonedCells, this.width);
    }

    getIndex(row: number, column: number): number {
        if (
            this.width < column ||
            this.cells.length / this.width < row ||
            row < 1 ||
            column < 1
        )
            throw new Error("Index out of range");
        return (row - 1) * this.width + (column - 1);
    }

    isSquare(): boolean {
        return this.cells.length === this.width ** 2;
    }

    withoutRow(row: number): Matrix {
        const rowStart = this.getIndex(row, 1);
        const newCells = [
            ...this.cells.slice(0, rowStart),
            ...this.cells.slice(rowStart + this.width),
        ];
        return new Matrix(newCells, this.width);
    }

    withoutCol(col: number): Matrix {
        if (col < 1 || col > this.width) throw new Error("Column out of range");
        const newCells = this.cells
            .map((c) => c.clone())
            // Filter out all entries from the provided column
            .filter((_, i) => 0 !== (i % this.width) - col + 1);
        return new Matrix(newCells, this.width - 1);
    }

    row(i: number): Fraction[] {
        return this.cells
            .slice(this.getIndex(i, 1), 1 + this.getIndex(i, this.width))
            .map((c) => c.clone());
    }

    column(c: number): Fraction[] {
        const col = [];
        for (let r = 1; r <= this.cells.length / this.width; r++) {
            col.push(this.cells[this.getIndex(r, c)].clone());
        }
        return col;
    }

    *rows(): Generator<Fraction[]> {
        for (let i = 0; i < this.cells.length / this.width; i++) {
            yield this.row(i + 1);
        }
    }

    *columns(): Generator<Fraction[]> {
        for (let i = 0; i < this.width; i++) {
            yield this.column(i + 1);
        }
    }

    static equals(m1: Matrix, m2: Matrix): boolean {
        if (m1.width !== m2.width) return false;
        for (let i = 0; i < m1.width; i++) {
            if (!m1.cells[i].equals(m2.cells[i])) return false;
        }
        return true;
    }

    static add(m1: Matrix, m2: number | Fraction | Matrix): Matrix {
        if (typeof m2 === "number") m2 = new Fraction(m2);
        if (m2 instanceof Fraction) {
            return new Matrix(
                m1.cells.map((c) => c.add(m2 as Fraction)),
                m1.width
            );
        }
        if (m1.width !== m2.width || m1.cells.length !== m2.cells.length)
            throw new Error("Matrices must be the same dimentions to be added");
        const newCells = m1.cells.map((c, i) => c.add((m2 as Matrix).cells[i]));
        return new Matrix(newCells, m1.width);
    }

    static sub(m1: Matrix, m2: Matrix | Fraction | number): Matrix {
        if (typeof m2 === "number") m2 = new Fraction(m2);
        if (m2 instanceof Fraction)
            return new Matrix(
                m1.cells.map((c) => c.sub(m2 as Fraction)),
                m1.width
            );
        if (m1.width !== m2.width || m1.cells.length !== m2.cells.length)
            throw new Error(
                "Matrices must be the same dimentions to be subtracted"
            );
        const newCells = m1.cells.map((c, i) => c.sub((m2 as Matrix).cells[i]));
        return new Matrix(newCells, m1.width);
    }

    static mul(m1: Matrix, m2: number | Fraction | Matrix): Matrix {
        if (typeof m2 === "number") m2 = new Fraction(m2);
        if (m2 instanceof Fraction) {
            return new Matrix(
                m1.cells.map((c) => c.mul(m2 as Fraction)),
                m1.width
            );
        } else {
            const newCells: Fraction[] = [];
            for (const row of m1.rows()) {
                for (const col of m2.columns()) {
                    newCells.push(
                        row.reduce(
                            (acc, rowItem, colIndex) =>
                                acc.add(rowItem.mul(col[colIndex])),
                            new Fraction(0)
                        )
                    );
                }
            }
            return new Matrix(newCells, m2.width);
        }
    }

    static det(m: Matrix): Fraction {
        if (!m.isSquare())
            throw new Error(
                "A matrix must be square to compute its determinant"
            );

        if (m.width < 1) return new Fraction(1);
        else if (m.width === 1) return m.cells[0];
        else if (m.width === 2) {
            return m.cells[0].mul(m.cells[3]).sub(m.cells[1].mul(m.cells[2]));
        } else {
            return m
                .row(1)
                .map((cell, i) => {
                    const sign = ((i + 1) % 2) * 2 - 1;
                    const subMatrix = m.withoutRow(1).withoutCol(i + 1);
                    return cell.mul(sign).mul(subMatrix.det());
                })
                .reduce((acc, val) => acc.add(val), new Fraction(0));
        }
    }

    equals(m: Matrix): boolean {
        return Matrix.equals(this, m);
    }
    add(m: number | Fraction | Matrix): Matrix {
        return Matrix.add(this, m);
    }
    sub(m: number | Fraction | Matrix): Matrix {
        return Matrix.sub(this, m);
    }
    mul(m: number | Fraction | Matrix): Matrix {
        return Matrix.mul(this, m);
    }
    det(): Fraction {
        return Matrix.det(this);
    }
}
