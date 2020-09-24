import Fraction from 'fraction.js';

export type Row = Fraction[];
export type Dimentions = [number, number];
export type Cell = [number, number];
export type HistoryItem = {
	memo: string,
	matrixData: Row[],
}

export default class Matrix {
	readonly history: HistoryItem[]
	readonly dimentions: Dimentions

	static fromArray(numbers: number[][]): Matrix {
		const height = numbers.length
		const width = numbers[0].length
		if(!!numbers.find(row => row.length !== width)) throw new Error('Matrix rows have different lengths')

		return new Matrix([{
			memo: 'Initialization',
			matrixData: numbers.map(row => row
				.map(n => new Fraction(n))
			)
		}], [height, width])
	}

	constructor(history: HistoryItem[], dimentions: Dimentions) {
		this.history = history
		this.dimentions = dimentions
	}

	toString() {
		return historyItemToString(this.history[0])
	}

	toArray(): number[][] {
		return this.history[0].matrixData.slice()
			.map(row =>
				row.map(f => f.valueOf())
			)
	}

	definedAt([row, col]: Cell): boolean {
		const [height, width] = this.dimentions
		return (
			1 <= row && row <= height &&
			1 <= col && col <= width
		)
	}

	valueAt(cell: Cell): Fraction | undefined {
		if(!this.definedAt(cell)) return undefined
		const [row, col] = cell
		return this.history[0].matrixData[row-1][col-1]
	}

	toHistoryString(showMemo: boolean = true) {
		return this.history
			.reverse()
			.map(i => historyItemToString(i, showMemo))
			.join('\n\n')
	}

	scaleRow(row: number, weight: number) {
		if(1 > row || row > this.dimentions[0]) throw new Error(`Row ${row} is outside of the matrix`);

		const newMatrixData = this.history[0].matrixData.slice()
		newMatrixData[row-1] = newMatrixData[row-1].map(entry => new Fraction(weight).mul(entry))
		const newHistoryItem: HistoryItem = {
			memo: `Row ${row} scaled by ${weight}`,
			matrixData: newMatrixData
		}
		return new Matrix([newHistoryItem, ...this.history], this.dimentions);
	}

	swapRows(r1: number, r2: number) {
		if(1 > r1 || r1 > this.dimentions[0]) throw new Error(`Row ${r1} is outside of the matrix`);
		if(1 > r2 || r2 > this.dimentions[0]) throw new Error(`Row ${r2} is outside of the matrix`);

		const newMatrixData: Row[] = this.history[0].matrixData.slice()
		const [r1Data, r2Data] = [newMatrixData[r1-1], newMatrixData[r2-1]]
		newMatrixData[r1-1] = r2Data;
		newMatrixData[r2-1] = r1Data;
		const newHistoryItem: HistoryItem = {
			memo: `Rows ${r1} and ${r2} swaped`,
			matrixData: newMatrixData
		}
		return new Matrix([newHistoryItem, ...this.history], this.dimentions);
	}

	addRows(r1: number, r2: number, scale: number = 1) {
		if(1 > r1 || r1 > this.dimentions[0]) throw new Error(`Row ${r1} is outside of the matrix`);
		if(1 > r2 || r2 > this.dimentions[0]) throw new Error(`Row ${r2} is outside of the matrix`);

		const newMatrixData: Row[] = this.history[0].matrixData.slice()
		newMatrixData[r2-1] = newMatrixData[r2-1]
			.map((v, i) => newMatrixData[r1-1][i].mul(scale).add(v))
		const memo = (scale !== 1)
			? `${scale} times row ${r1} added to row ${r2}`
			: `Row ${r1} added to row ${r1}`
		const newHistoryItem: HistoryItem = {
			memo,
			matrixData: newMatrixData
		}
		return new Matrix([newHistoryItem, ...this.history], this.dimentions);
	}

	//TODO
	isInRowEchelon(): boolean {
		return false
	}

	//TODO
	applyGaussianElimination(): Matrix {
		return toRowEchelon(this)
	}
}

const findMax = (a: number, item: number) => a < item ? item : a

function historyItemToString({ matrixData, memo }: HistoryItem, showMemo: boolean = false): string {
	let str = showMemo ? memo + '\n' : ''
	let width = 1 + matrixData
		.map(row => row
			.map(i => i.toFraction().length)
			.reduce(findMax)
		)
		.reduce(findMax)
	str += matrixData
		.map(row => `|${row.map(n => n.toFraction().padStart(width)).join('')} |`)
		.join('\n')
	return str
}

const findPivot = (m: Matrix, skip: number): Cell | undefined => {
	const [height, width] = m.dimentions
	for(let col = 1; col < width; col++) {
		for(let row = skip + 1; row < height; row++) {
			const c: Cell = [row, col]
			if(m.valueAt(c)) return c
		}
	}
	return undefined
}

//TODO
function toRowEchelon(m: Matrix, skip: number = 0): Matrix {
	if(m.isInRowEchelon()) return m
	let pivot = findPivot(m, skip)
	console.log(pivot)
	return m
}

//TODO
/*
function reduceRowEchelon(m: Matrix, skip: number = 0): Matrix {
	return m
}
*/
