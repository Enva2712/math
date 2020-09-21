import Matrix from './matrix';

export default function findGaussianElimination(matrix: Matrix, skip: number = 0) {
	if(skip >= matrix.dimentions[0]) return matrix;
	const pivot = findPivot(matrix);
	console.log(pivot);
	return matrix;
}

function findPivot(matrix: Matrix): [number, number] | null {
	let m = matrix.toArray()
	let pivot: [number, number] | null = null;
	for(let col = 0; col < matrix.dimentions[1]; col++) {
		for(let row = 0; row < matrix.dimentions[0]; row++) {
			if(!m[row][col].equals(0)) pivot = [row+1, col+1];
		}
	}
	return pivot;
}
