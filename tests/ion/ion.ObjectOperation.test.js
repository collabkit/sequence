module( 'ion.ObjectOperation' );

test( 'newFrom*', function() {
	var doc = new ion.Document( { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4 } );

	// Test 1
	deepEqual(
		ion.ObjectOperation.newFromInsert( doc, [], 'f', 5 ),
		new ion.ObjectOperation( [], [['insert', 'f', 5]] ),
		'Insert builds correct components'
	);

	// Test 2
	deepEqual(
		ion.ObjectOperation.newFromDelete( doc, [], 'c' ),
		new ion.ObjectOperation( [], [['delete', 'c', 2]] ),
		'Delete builds correct components'
	);

	// Test 3
	deepEqual(
		ion.ObjectOperation.newFromReplace( doc, [], 'c', 22 ),
		new ion.ObjectOperation( [], [['delete', 'c', 2], ['insert', 'c', 22]] ),
		'Replace builds correct components'
	);

	// Test 4
	deepEqual(
		ion.ObjectOperation.newFromMove( doc, [], 'c', 'f' ),
		new ion.ObjectOperation( [], [['delete', 'c', 2], ['insert', 'f', 2]] ),
		'Move builds correct components'
	);
} );
