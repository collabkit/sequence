module( 'seq.Transaction' );

test( 'seq.Transaction.transform', function() {
	var a = 'a',
		b = 'b',
		c = 'c',
		d = 'd',
		e = 'e',
		f = 'f',
		g = 'g',
		sequence = new seq.Sequence( [a, b, c, d, e] );

	// Test 1
	deepEqual(
		seq.Transaction.newFromPushItem( 0, sequence, f ).transform(
			seq.Transaction.newFromPushItem( 0, sequence, g )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 6, [g] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 5, [f] )] )
		],
		'transform - push|push'
	);

	// Test 2
	deepEqual(
		seq.Transaction.newFromPushItem( 0, sequence, f ).transform(
			seq.Transaction.newFromPushItem( 0, sequence, f )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - push|push - identical'
	);

	// Test 3
	deepEqual(
		seq.Transaction.newFromUnshiftItem( 0, sequence, f ).transform(
			seq.Transaction.newFromUnshiftItem( 0, sequence, g )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 1, [g] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 0, [f] )] )
		],
		'transform - unshift|unshift'
	);

	// Test 4
	deepEqual(
		seq.Transaction.newFromUnshiftItem( 0, sequence, f ).transform(
			seq.Transaction.newFromUnshiftItem( 0, sequence, f )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - unshift|unshift - identical'
	);

	// Test 5
	deepEqual(
		seq.Transaction.newFromPushItem( 0, sequence, f ).transform(
			seq.Transaction.newFromUnshiftItem( 0, sequence, a )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 0, [a] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 6, [f] )] )
		],
		'transform - push|unshift'
	);

	// Test 6
	deepEqual(
		seq.Transaction.newFromUnshiftItem( 0, sequence, a ).transform(
			seq.Transaction.newFromPushItem( 0, sequence, f )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 6, [f] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 0, [a] )] )
		],
		'transform - unshift|push'
	);

	// Test 7
	deepEqual(
		seq.Transaction.newFromPopItem( 0, sequence ).transform(
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
		seq.Transaction.newFromShiftItem( 0, sequence ).transform(
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
		seq.Transaction.newFromShiftItem( 0, sequence ).transform(
			seq.Transaction.newFromPopItem( 0, sequence )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 3, [e] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a] )] )
		],
		'transform - shift|pop'
	);

	// Test 10
	deepEqual(
		seq.Transaction.newFromPopItem( 0, sequence ).transform(
			seq.Transaction.newFromShiftItem( 0, sequence )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 3, [e] )] )
		],
		'transform - pop|shift'
	);

	// Test 11
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 1, 0, f ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 3, 0, g )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 4, [g] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 1, [f] )] )
		],
		'transform - splice(insert)|splice(insert)'
	);

	// Test 12
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 0, 1 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 2, 1 )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 1, [c] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a] )] )
		],
		'transform - splice(remove)|splice(remove)'
	);

	// Test 13
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 0, 3 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 1, 1 )
		),
		[
			new seq.Transaction( 0, [null] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a, c] )] )
		],
		'transform - splice(remove)|splice(remove) - inside'
	);

	// Test 14
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 1, 1 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 0, 3 )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a, c] )] ),
			new seq.Transaction( 0, [null] )
		],
		'transform - splice(remove)|splice(remove) - outisde'
	);

	// Test 16
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 2, 3 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 0, 3 )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a, b] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [d, e] )] )
		],
		'transform - splice(remove)|splice(remove) - overlapping left'
	);

	// Test 17
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 0, 3 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 2, 3 )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [d, e] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a, b] )] )
		],
		'transform - splice(remove)|splice(remove) - overlapping right'
	);

	// Test 18
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 2, 1 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 2, 0, f )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 2, [f] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 3, [c] )] )
		],
		'transform - splice(remove)|splice(insert) - same index'
	);

	// Test 19
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 2, 0, f ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 2, 1 )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 3, [c] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 2, [f] )] )
		],
		'transform - splice(insert)|splice(remove) - same index'
	);

	// Test 20
	deepEqual(
		seq.Transaction.newFromPushItem( 0, sequence, f ).transform(
			seq.Transaction.newFromShiftItem( 0, sequence, a )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 4, [f] )] )
		],
		'transform - push|shift'
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
