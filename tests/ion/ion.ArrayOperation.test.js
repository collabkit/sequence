module( 'ion.ArrayOperation' );

test( 'newFrom*', function() {
	var doc = new ion.Document( { 'a': [0, 1, 2, 3, 4] } );

	// Test 1
	deepEqual(
		ion.ArrayOperation.newFromInsert( doc, ['a'], 2, 22 ),
		new ion.ArrayOperation( ['a'], [['retain', 2], ['insert', 22]] ),
		'Insert builds correct components'
	);

	// Test 2
	deepEqual(
		ion.ArrayOperation.newFromDelete( doc, ['a'], 2 ),
		new ion.ArrayOperation( ['a'], [['retain', 2], ['delete', 2]] ),
		'Delete builds correct components'
	);

	// Test 3
	deepEqual(
		ion.ArrayOperation.newFromReplace( doc, ['a'], 2, 22 ),
		new ion.ArrayOperation( ['a'], [['retain', 2], ['delete', 2], ['insert', 22]] ),
		'Replace builds correct components'
	);

	// Test 4
	deepEqual(
		ion.ArrayOperation.newFromMove( doc, ['a'], 2, 4 ),
		new ion.ArrayOperation( ['a'], [['retain', 2], ['delete', 2], ['retain', 2], ['insert', 2]] ),
		'Move builds correct components'
	);
} );

test( 'commit', function() {
	var doc = new ion.Document( { 'a': [0, 1, 2, 3, 4] } );

	// Test 1
	ion.ArrayOperation.newFromInsert( doc, ['a'], 2, 22 ).commit( doc );
	deepEqual(
		doc.traverse( 'a' ),
		[0, 1, 22, 2, 3, 4],
		'Inserts can be committed'
	);

	// Test 2
	ion.ArrayOperation.newFromDelete( doc, ['a'], 2 ).commit( doc );
	deepEqual(
		doc.traverse( 'a' ),
		[0, 1, 2, 3, 4],
		'Deletes can be committed'
	);

	// Test 3
	ion.ArrayOperation.newFromReplace( doc, ['a'], 2, 22 ).commit( doc );
	deepEqual(
		doc.traverse( 'a' ),
		[0, 1, 22, 3, 4],
		'Replaces can be committed'
	);

	// Test 4
	ion.ArrayOperation.newFromMove( doc, ['a'], 2, 4 ).commit( doc );
	deepEqual(
		doc.traverse( 'a' ),
		[0, 1, 3, 4, 22],
		'Moves can be committed'
	);
} );
