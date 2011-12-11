module( 'seq.Transaction' );

test( 'seq.Transaction.transform', function() {
	var a = 'a',
		b = 'b',
		c = 'c',
		d = 'd',
		e = 'e',
		sequence = [a, b, c];

	// Test 1
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromPush( 0, sequence, d ),
			seq.Transaction.newFromPush( 0, sequence, e )
		),
		[
			new seq.Transaction( 0, [['insert', 4, [e]]] ),
			new seq.Transaction( 0, [['insert', 3, [d]]] )
		],
		'transform - push|push'
	);

	// Test 1
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromPush( 0, sequence, d ),
			seq.Transaction.newFromPush( 0, sequence, d )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - push|push - identical'
	);

	// Test 1
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromUnshift( 0, sequence, d ),
			seq.Transaction.newFromUnshift( 0, sequence, e )
		),
		[
			new seq.Transaction( 0, [['insert', 1, [e]]] ),
			new seq.Transaction( 0, [['insert', 0, [d]]] )
		],
		'transform - unshift|unshift'
	);

	// Test 1
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromUnshift( 0, sequence, d ),
			seq.Transaction.newFromUnshift( 0, sequence, d )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - unshift|unshift - identical'
	);

	// Test 2
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromPush( 0, sequence, d ),
			seq.Transaction.newFromUnshift( 0, sequence, a )
		),
		[
			new seq.Transaction( 0, [['insert', 0, [a]]] ),
			new seq.Transaction( 0, [['insert', 4, [d]]] )
		],
		'transform - push|unshift'
	);

	// Test 3
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromUnshift( 0, sequence, a ),
			seq.Transaction.newFromPush( 0, sequence, d )
		),
		[
			new seq.Transaction( 0, [['insert', 4, [d]]] ),
			new seq.Transaction( 0, [['insert', 0, [a]]] )
		],
		'transform - unshift|push'
	);

	// Test 4
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromPop( 0, sequence ),
			seq.Transaction.newFromPop( 0, sequence )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - pop|pop - identical'
	);

	// Test 5
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromShift( 0, sequence ),
			seq.Transaction.newFromShift( 0, sequence )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - shift|shift - identical'
	);

	// Test 6
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromShift( 0, sequence ),
			seq.Transaction.newFromPop( 0, sequence )
		),
		[
			new seq.Transaction( 0, [['remove', 1, [c]]] ),
			new seq.Transaction( 0, [['remove', 0, [a]]] )
		],
		'transform - shift|pop'
	);

	// Test 7
	deepEqual(
		seq.Transaction.transform(
			seq.Transaction.newFromPop( 0, sequence ),
			seq.Transaction.newFromShift( 0, sequence )
		),
		[
			new seq.Transaction( 0, [['remove', 0, [a]]] ),
			new seq.Transaction( 0, [['remove', 1, [c]]] )
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
		sequence = [b, c, d];

	// Test 1
	deepEqual(
		seq.Transaction.newFromPush( 0, sequence, e ).getOperations(),
		[['insert', 3, [e]]],
		'newFromPush'
	);

	// Test 2
	deepEqual(
		seq.Transaction.newFromUnshift( 0, sequence, a ).getOperations(),
		[['insert', 0, [a]]],
		'newFromUnshift'
	);

	// Test 3
	deepEqual(
		seq.Transaction.newFromPop( 0, sequence ).getOperations(),
		[['remove', 2, [d]]],
		'newFromPop'
	);

	// Test 4
	deepEqual(
		seq.Transaction.newFromShift( 0, sequence ).getOperations(),
		[['remove', 0, [b]]],
		'newFromShift'
	);

	// Test 5
	deepEqual(
		seq.Transaction.newFromSplice( 0, sequence, 1, 1, e ).getOperations(),
		[['remove', 1, [c]], ['insert', 1, [e]]],
		'newFromSplice - remove c and insert e'
	);

	// Test 6
	deepEqual(
		seq.Transaction.newFromSplice( 0, sequence, 1, 0, e ).getOperations(),
		[['insert', 1, [e]]],
		'newFromSplice - insert e'
	);

	// Test 6
	deepEqual(
		seq.Transaction.newFromSplice( 0, sequence, 1, 0, e, a ).getOperations(),
		[['insert', 1, [e, a]]],
		'newFromSplice - insert e and a'
	);

	// Test 7
	deepEqual(
		seq.Transaction.newFromSplice( 0, sequence, 1, 1 ).getOperations(),
		[['remove', 1, [c]]],
		'newFromSplice - remove c'
	);

	// Test 7
	deepEqual(
		seq.Transaction.newFromSplice( 0, sequence, 1, 2 ).getOperations(),
		[['remove', 1, [c, d]]],
		'newFromSplice - remove c and d'
	);

	// Test 6
	deepEqual(
		seq.Transaction.newFromReverse( 0, sequence ).getOperations(),
		[['remove', 0, [b, c, d]], ['insert', 0, [d, c, b]]],
		'newFromReverse'
	);

	// Test 7
	deepEqual(
		seq.Transaction.newFromSort( 0, sequence, function( a, b ) {
			// Reverse sorting order
			return a < b ? 1 : ( b < a ? -1 : 0 );
		} ).getOperations(),
		[['remove', 0, [b, c, d]], ['insert', 0, [d, c, b]]],
		'newFromSort'
	);
} );
