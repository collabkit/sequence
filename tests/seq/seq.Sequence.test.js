module( 'seq.Sequence' );

test( 'seq.Sequence.isOperationValid', function() {
	var a = 'a',
		b = 'b',
		c = 'c',
		d = 'd',
		sequence = new seq.Sequence( [a, b, c] );

	// Test 1
	ok(
		sequence.isOperationValid( new seq.InsertOperation( 1, [d] ) ),
		'insert operations are valid'
	);

	// Test 2
	ok(
		sequence.isOperationValid( new seq.RemoveOperation( 1, [b] ) ),
		'remove operations are valid'
	);
} );

test( 'seq.Sequence.applyOperation', function() {
	var a = 'a',
		b = 'b',
		c = 'c',
		d = 'd',
		sequence;

	// Test 1
	sequence = new seq.Sequence( [a, b, c] );
	deepEqual(
		sequence.applyOperation( new seq.InsertOperation( 1, [d] ) ).getItems(),
		[a, d, b, c],
		'insert operations can be applied'
	);

	// Test 1
	sequence = new seq.Sequence( [a, b, c] );
	deepEqual(
		sequence.applyOperation( new seq.RemoveOperation( 1, [b] ) ).getItems(),
		[a, c],
		'remove operations can be applied'
	);
} );
