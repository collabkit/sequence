module( 'ion.ArrayOperation' );

test( 'newFrom*', function() {
	var doc = new ion.Document( { 'a': [0, 1, 2, 3, 4] } );

	// Test 1
	deepEqual(
		ion.ArrayOperation.newFromInsert( doc, ['a'], 2, 22 ),
		new ion.ArrayOperation( ['a'], [['insert', 2, 22]] ),
		'Insert builds correct components'
	);

	// Test 2
	deepEqual(
		ion.ArrayOperation.newFromDelete( doc, ['a'], 2, 2 ),
		new ion.ArrayOperation( ['a'], [['delete', 2, 2]] ),
		'Delete builds correct components'
	);

	// Test 3
	deepEqual(
		ion.ArrayOperation.newFromReplace( doc, ['a'], 2, 22 ),
		new ion.ArrayOperation( ['a'], [['delete', 2, 2], ['insert', 2, 22]] ),
		'Replace builds correct components'
	);

	// Test 4
	deepEqual(
		ion.ArrayOperation.newFromMove( doc, ['a'], 2, 4 ),
		new ion.ArrayOperation( ['a'], [['delete', 2, 2], ['insert', 3, 2]] ),
		'Move builds correct components'
	);
} );
