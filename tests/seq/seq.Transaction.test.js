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

	/*
	 * Test 1
	 * 
	 * abcde
	 *   a: ins( 5, f ): abcde[f]
	 *     b': ins( 6, g ): abcdef[g]
	 *   b: ins( 5, g ): abcde[g]
	 *     a': ins( 5, f ): abcde[f]g
	*/
	deepEqual(
		seq.Transaction.newFromPushItem( 0, sequence, f ).transform(
			seq.Transaction.newFromPushItem( 0, sequence, g )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 6, [g] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 5, [f] )] )
		],
		'transform - push|push - different items'
	);

	/*
	 * Test 2
	 * 
	 * abcde
	 *   a: ins( 0, f ): [f]abcde
	 *     b': ins( 1, g ): f[g]abcde
	 *   b: ins( 0, g ): [g]abcde
	 *     a': ins( 0, f ): [f]gabcde
	*/
	deepEqual(
		seq.Transaction.newFromUnshiftItem( 0, sequence, f ).transform(
			seq.Transaction.newFromUnshiftItem( 0, sequence, g )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 1, [g] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 0, [f] )] )
		],
		'transform - unshift|unshift - different items'
	);

	/*
	 * Test 3
	 * 
	 * abcde
	 *   a: ins( 5, f ): abcde[f]
	 *     b': -
	 *   b: ins( 5, f ): abcde[f]
	 *     a': -
	*/
	deepEqual(
		seq.Transaction.newFromPushItem( 0, sequence, f ).transform(
			seq.Transaction.newFromPushItem( 0, sequence, f )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - push|push - identical items'
	);

	/*
	 * Test 4
	 * 
	 * abcde
	 *   a: ins( 0, f ): [f]abcde
	 *     b': -
	 *   b: ins( 0, f ): [f]abcde
	 *     a': -
	*/
	deepEqual(
		seq.Transaction.newFromUnshiftItem( 0, sequence, f ).transform(
			seq.Transaction.newFromUnshiftItem( 0, sequence, f )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - unshift|unshift - identical items'
	);

	/*
	 * Test 5
	 * 
	 * abcde
	 *   a: rem( 4, e ): abcd|
	 *     b': -
	 *   b: rem( 4, e ): abcd|
	 *     a': -
	*/
	deepEqual(
		seq.Transaction.newFromPopItem( 0, sequence ).transform(
			seq.Transaction.newFromPopItem( 0, sequence )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - pop|pop - identical items'
	);

	/*
	 * Test 6
	 * 
	 * abcde
	 *   a: rem( 0, a ): |bcde
	 *     b': -
	 *   b: rem( 0, a ): |bcde
	 *     a': -
	*/
	deepEqual(
		seq.Transaction.newFromShiftItem( 0, sequence ).transform(
			seq.Transaction.newFromShiftItem( 0, sequence )
		),
		[
			new seq.Transaction( 0 ),
			new seq.Transaction( 0 )
		],
		'transform - shift|shift - identical items'
	);

	/*
	 * Test 7
	 * 
	 * abcde
	 *   a: ins( 5, f ): abcde[f]
	 *     b': ins( 0, g ): [g]abcdef
	 *   b: ins( 0, g ): [g]abcde
	 *     a': ins( 6, f ): gabcde[f]
	*/
	deepEqual(
		seq.Transaction.newFromPushItem( 0, sequence, f ).transform(
			seq.Transaction.newFromUnshiftItem( 0, sequence, g )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 0, [g] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 6, [f] )] )
		],
		'transform - push|unshift'
	);

	/*
	 * Test 8
	 * 
	 * abcde
	 *   a: ins( 0, g ): [g]abcde
	 *     b': ins( 6, f ): gabcde[f]
	 *   b: ins( 5, f ): abcde[f]
	 *     a': ins( 0, g ): [g]abcdef
	*/
	deepEqual(
		seq.Transaction.newFromUnshiftItem( 0, sequence, g ).transform(
			seq.Transaction.newFromPushItem( 0, sequence, f )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 6, [f] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 0, [g] )] )
		],
		'transform - unshift|push'
	);

	/*
	 * Test 9
	 * 
	 * abcde
	 *   a: rem( 0, a ): |bcde
	 *     b': rem( 3, e ): bcd|
	 *   b: rem( 4, e ): abcd|
	 *     a': rem( 0, a ): |bcd
	*/
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

	/*
	 * Test 10
	 * 
	 * abcde
	 *   a: rem( 4, e ): abcd|
	 *     b': rem( 0, a ): |bcd
	 *   b: rem( 0, a ): |bcde
	 *     a': rem( 3, e ): bcd|
	*/
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

	/*
	 * Test 11
	 * 
	 * abcde
	 *   a: ins( 5, f ): abcde[f]
	 *     b': rem( 0, a ): |bcdef
	 *   b: rem( 0, a ): |bcde
	 *     a': ins( 4, f ): bcde[f]
	*/
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

	/*
	 * Test 12
	 * 
	 * abcde
	 *   a: rem( 0, a ): |bcde
	 *     b': ( 4, f ): bcde[f]
	 *   b: ( 5, f ): abcde[f]
	 *     a': rem( 0, a ): |bcdef
	*/
	deepEqual(
		seq.Transaction.newFromShiftItem( 0, sequence, a ).transform(
			seq.Transaction.newFromPushItem( 0, sequence, f )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 4, [f] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a] )] )
		],
		'transform - shift|pop'
	);

	/*
	 * Test 13
	 * 
	 * abcde
	 *   a: ins( 1, f ): a[f]bcde
	 *     b': ins( 4, g ): afbc[g]de
	 *   b: ins( 3, g ): abc[g]de
	 *     a': ins( 1, f ): a[f]bcde
	*/
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 1, 0, f ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 3, 0, g )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 4, [g] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 1, [f] )] )
		],
		'transform - splice(insert)|splice(insert) - a left of b'
	);

	/*
	 * Test 14
	 * 
	 * abcde
	 *   a: rem( 0, a ): |bcde
	 *     b': rem( 1, c ): b|de
	 *   b: rem( 2, c ): ab|de
	 *     a': rem( 0, a ): |bde
	*/
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 0, 1 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 2, 1 )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 1, [c] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a] )] )
		],
		'transform - splice(remove)|splice(remove) - a left of b'
	);

	/*
	 * Test 15
	 * 
	 * abcde
	 *   a: rem( 0, abc ): |de
	 *     b': -
	 *   b: rem( 1, b ): a|cde
	 *     a': rem( 0, ac ): |de
	*/
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 0, 3 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 1, 1 )
		),
		[
			new seq.Transaction( 0, [null] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a, c] )] )
		],
		'transform - splice(remove)|splice(remove) - b inside a'
	);

	/*
	 * Test 16
	 * 
	 * abcde
	 *   a: rem( 1, b ): a|cde
	 *     b': rem( 0, ac ): |de
	 *   b: rem( 0, abc ): |de
	 *     a': -
	*/
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 1, 1 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 0, 3 )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a, c] )] ),
			new seq.Transaction( 0, [null] )
		],
		'transform - splice(remove)|splice(remove) - a inside b'
	);

	/*
	 * Test 17
	 * 
	 * abcde
	 *   a: rem( 2, cde ): ab|
	 *     b': rem( 0, ab ): |
	 *   b: rem( 0, abc ): |de
	 *     a': rem( 0, de ): |
	*/
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 2, 3 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 0, 3 )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a, b] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [d, e] )] )
		],
		'transform - splice(remove)|splice(remove) - a overlapping right of b'
	);

	/*
	 * Test 18
	 * 
	 * abcde
	 *   a: ( 0, abc ): |de
	 *     b': ( 0, de ): |
	 *   b: ( 2, cde ): ab|
	 *     a': ( 0, ab ): |
	*/
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 0, 3 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 2, 3 )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [d, e] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 0, [a, b] )] )
		],
		'transform - splice(remove)|splice(remove) - a overlapping left of b'
	);

	/*
	 * Test 19
	 * 
	 * abcde
	 *   a: rem( 2, c ): ab|de
	 *     b': ins( 2, f ): ab[f]de
	 *   b: ins( 2, f ): abc[f]de
	 *     a': rem( 2, c ): ab|fde
	*/
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 2, 1 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 2, 0, f )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 2, [f] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 2, [c] )] )
		],
		'transform - splice(remove)|splice(insert) - same index'
	);

	/*
	 * Test 20
	 * 
	 * abcde
	 *   a: ins( 2, f ): ab[f]cde
	 *     b': rem( 3, c ): abf|de
	 *   b: rem( 2, c ): ab|de
	 *     a': ins( 2, f ): ab[f]de
	*/
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

	/*
	 * Test 21
	 * 
	 * abcde
	 *   a: rem( 0, abc ): |de
	 *     b': ins( 0, f ): [f]de
	 *   b: ins( 1, f ): a[f]bcde
	 *     a': rem( 0, a ), rem( 1, bc ): |f|de
	 */
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 0, 3 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 1, 0, f )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 0, [f] )] ),
			new seq.Transaction( 0, [
				new seq.RemoveOperation( 0, [a] ),
				new seq.RemoveOperation( 1, [b, c] )
			] )
		],
		'transform - splice(remove)|splice(insert) - b inside a'
	);

	/*
	 * Test 22
	 * 
	 * abcde
	 *   a: ins( 1, f ): a[f]bcde
	 *     b': rem( 0, a ), rem( 1, bc ): |f|de
	 *   b: rem( 0, abc ): |de
	 *     a': ins( 0, f ): [f]de
	 */
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 1, 0, f ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 0, 3 )
		),
		[
			new seq.Transaction( 0, [
				new seq.RemoveOperation( 0, [a] ),
				new seq.RemoveOperation( 1, [b, c] )
			] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 0, [f] )] )
		],
		'transform - splice(insert)|splice(remove) - a inside b'
	);

	/*
	 * Test 23
	 * 
	 * abcde
	 *   a: rem( 0, a ): |bcde
	 *     b': ins( 0, fg ): [fg]bcde
	 *   b: ins( 0, fg ): [fg]abcde
	 *     a': rem( 2, a ): fg|bcde
	 */
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 0, 1 ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 0, 0, f, g )
		),
		[
			new seq.Transaction( 0, [new seq.InsertOperation( 0, [f, g] )] ),
			new seq.Transaction( 0, [new seq.RemoveOperation( 2, [a] )] )
		],
		'transform - splice(remove)|splice(insert) - a inside b'
	);

	/*
	 * Test 24
	 * 
	 * abcde
	 *   a: ins( 0, fg ): [fg]abcde
	 *     b': rem( 2, a ): fg|bcde
	 *   b: rem( 0, a ): |bcde
	 *     a': ins( 0, fg ): [fg]bcde
	 */
	deepEqual(
		seq.Transaction.newFromSpliceItems( 0, sequence, 0, 0, f, g ).transform(
			seq.Transaction.newFromSpliceItems( 0, sequence, 0, 1 )
		),
		[
			new seq.Transaction( 0, [new seq.RemoveOperation( 2, [a] )] ),
			new seq.Transaction( 0, [new seq.InsertOperation( 0, [f, g] )] )
		],
		'transform - splice(insert)|splice(remove) - b inside a'
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
