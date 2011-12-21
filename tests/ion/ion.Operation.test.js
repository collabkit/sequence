module( 'ion.Operation' );

test( 'constructor', function() {
	// Test 1
	deepEqual(
		new ion.Operation(),
		new ion.Operation( [], [] ),
		'Uses empty path and components arrays by default'
	);

	// Test 2
	deepEqual(
		( new ion.Operation( ['a', 'b', 'c'] ) ).getPath(),
		['a', 'b', 'c'],
		'Sets path'
	);

	// Test 3
	deepEqual(
		( new ion.Operation( null, [1, 2, 3] ) ).getComponents(),
		[1, 2, 3],
		'Sets components'
	);

} );

test( 'clone', function() {
	var original = new ion.Operation(),
		clone = original.clone();

	// Test 1
	notStrictEqual( clone.getPath(), original.getPath(), 'Creates new path array' );

	// Test 2
	notStrictEqual(
		clone.getComponents(), original.getComponents(), 'Creates new components array'
	);
} );

test( 'invert', function() {
	// Test 1
	var op = new ion.Operation( [], [['retain', 1], ['insert', 2], ['delete', 3]] );
	deepEqual(
		op.invert().getComponents(),
		[['retain', 1], ['delete', 2], ['insert', 3]],
		'Invert swaps delete and insert types'
	);
} );
