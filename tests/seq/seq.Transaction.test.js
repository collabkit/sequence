module( 'seq.Transaction' );

test( 'seq.Transaction.transform', function() {
	var a = 'a',
		b = 'b',
		c = 'c',
		d = 'd',
		e = 'e',
		sequence = new seq.Sequence( [a, b, c] );

	// Test 1
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromPushItem( 0, sequence, d ),
			seq.Transaction.newFromPushItem( 0, sequence, e )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 4, [e] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 3, [d] )] )
		],
		'transform - push|push'
	);

	// Test 2
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromPushItem( 0, sequence, d ),
			seq.Transaction.newFromPushItem( 0, sequence, d )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - push|push - identical'
	);

	// Test 3
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromUnshiftItem( 0, sequence, d ),
			seq.Transaction.newFromUnshiftItem( 0, sequence, e )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 1, [e] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 0, [d] )] )
		],
		'transform - unshift|unshift'
	);

	// Test 4
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromUnshiftItem( 0, sequence, d ),
			seq.Transaction.newFromUnshiftItem( 0, sequence, d )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - unshift|unshift - identical'
	);

	// Test 5
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromPushItem( 0, sequence, d ),
			seq.Transaction.newFromUnshiftItem( 0, sequence, a )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 0, [a] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 4, [d] )] )
		],
		'transform - push|unshift'
	);

	// Test 6
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromUnshiftItem( 0, sequence, a ),
			seq.Transaction.newFromPushItem( 0, sequence, d )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 4, [d] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 0, [a] )] )
		],
		'transform - unshift|push'
	);

	// Test 7
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromPopItem( 0, sequence ),
			seq.Transaction.newFromPopItem( 0, sequence )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - pop|pop - identical'
	);

	// Test 8
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromShiftItem( 0, sequence ),
			seq.Transaction.newFromShiftItem( 0, sequence )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - shift|shift - identical'
	);

	// Test 9
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromShiftItem( 0, sequence ),
			seq.Transaction.newFromPopItem( 0, sequence )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 1, [c] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a] )] )
		],
		'transform - shift|pop'
	);

	// Test 10
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromPopItem( 0, sequence ),
			seq.Transaction.newFromShiftItem( 0, sequence )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 1, [c] )] )
		],
		'transform - pop|shift'
	);
} );

test( 'seq.Transaction.newFrom*', function() {
	var a = 'a',
		b = 'b',
		c = 'c',
		d = 'd',
		e = 'e',
		sequence = new seq.Sequence( [b, c, d] );

	// Test 1
	deepEqual(
		seq.Transaction.newFromPushItem( 0, sequence, e ).getOperations(),
		[new seq.InsertOperation( 3, [e] )],
		'newFromPushItem'
	);

	// Test 2
	deepEqual(
		seq.Transaction.newFromUnshiftItem( 0, sequence, a ).getOperations(),
		[new seq.InsertOperation( 0, [a] )],
		'newFromUnshiftItem'
	);

	// Test 3
	deepEqual(
		seq.Transaction.newFromPopItem( 0, sequence ).getOperations(),
		[new seq.RemoveOperation( 2, [d] )],
		'newFromPopItem'
	);

	// Test 4
	deepEqual(
		seq.Transaction.newFromShiftItem( 0, sequence ).getOperations(),
		[new seq.RemoveOperation( 0, [b] )],
		'newFromShiftItem'
	);

	// Test 5
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 1, 1, e ).getOperations(),
		[new seq.RemoveOperation( 1, [c] ), new seq.InsertOperation( 1, [e] )],
		'newFromSpliceItems - remove c and insert e'
	);

	// Test 6
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 1, 0, e ).getOperations(),
		[new seq.InsertOperation( 1, [e] )],
		'newFromSpliceItems - insert e'
	);

	// Test 7
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 1, 0, e, a ).getOperations(),
		[new seq.InsertOperation( 1, [e, a] )],
		'newFromSpliceItems - insert e and a'
	);

	// Test 8
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 1, 1 ).getOperations(),
		[new seq.RemoveOperation( 1, [c] )],
		'newFromSpliceItems - remove c'
	);

	// Test 9
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 1, 2 ).getOperations(),
		[new seq.RemoveOperation( 1, [c, d] )],
		'newFromSpliceItems - remove c and d'
	);

	// Test 10
	deepEqual(
		seq.Transaction.newFromReverseItems( 0, sequence ).getOperations(),
		[
			new seq.RemoveOperation( 0, [b, c, d] ),
			new seq.InsertOperation( 0, [d, c, b] )
		],
		'newFromReverseItems'
	);

	// Test 11
	deepEqual(
		seq.Transaction.newFromSortItems( 0, sequence, function( a, b ) {
			// Reverse sorting order
			return a < b ? 1 : ( b < a ? -1 : 0 );
		} ).getOperations(),
		[
			new seq.RemoveOperation( 0, [b, c, d] ),
			new seq.InsertOperation( 0, [d, c, b] )
		],
		'newFromSortItems'
	);

	// Test 12
	deepEqual(
		seq.Transaction.newFromSwapItems( 0, sequence, 1, 2 ).getOperations(),
		[new seq.RemoveOperation( 1, [c] ), new seq.InsertOperation( 2, [c] )],
		'newFromSwapItems'
	);
} );
