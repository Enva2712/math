import Matrix from '../matrix';
import { test } from 'tap';

test('Matrix can be constructed from array', async () => {
	Matrix.fromArray([
		[1, 2],
		[2, 1],
	])
})

test('Matrix rows can be scaled', async ({ ok }) => {
	let m = Matrix.fromArray([[1, .5]])
	m = m.scaleRow(1, 2)
	const c1 = m.valueAt([1,1])
	const c2 = m.valueAt([1,2])
	ok(c1 && c1.equals(2))
	ok(c2 && c2.equals(1))
})
