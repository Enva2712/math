import Matrix from './matrix';

let matrix = Matrix.fromArray([
	[  1,  2,  7,  2],
	[ -1, -1,  2,  7],
	[  2,  2, -3, 11]
])


matrix = matrix.addScaledRowToRow(2,3,2)
matrix = matrix.addScaledRowToRow(1,2)

matrix = matrix.addScaledRowToRow(3,2,-9)
matrix = matrix.addScaledRowToRow(3,1,-7)
matrix = matrix.addScaledRowToRow(2,1,-2)

console.log(matrix.toHistoryString())
