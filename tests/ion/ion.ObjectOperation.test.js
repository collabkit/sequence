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
		ion.ObjectOperation.newFromReplace( doc, [], 'd', 33 ),
		new ion.ObjectOperation( [], [['delete', 'd', 3], ['insert', 'd', 33]] ),
		'Replace builds correct components'
	);

	// Test 4
	deepEqual(
		ion.ObjectOperation.newFromMove( doc, [], 'e', 'g' ),
		new ion.ObjectOperation( [], [['delete', 'e', 4], ['insert', 'g', 4]] ),
		'Move builds correct components'
	);
} );

test( 'commit', function() {
	var doc = new ion.Document( { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4 } );

	// Test 1
	ion.ObjectOperation.newFromInsert( doc, [], 'f', 5 ).commit( doc );
	deepEqual(
		doc.traverse(),
		{ 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5 },
		'Inserts can be committed'
	);

	// Test 2
	ion.ObjectOperation.newFromDelete( doc, [], 'c' ).commit( doc );
	deepEqual(
		doc.traverse(),
		{ 'a': 0, 'b': 1, 'd': 3, 'e': 4, 'f': 5 },
		'Deletes can be committed'
	);

	// Test 3
	ion.ObjectOperation.newFromReplace( doc, [], 'd', 33 ).commit( doc );
	deepEqual(
		doc.traverse(),
		{ 'a': 0, 'b': 1, 'e': 4, 'f': 5, 'd': 33 },
		'Moves can be committed'
	);

	// Test 4
	ion.ObjectOperation.newFromMove( doc, [], 'e', 'g' ).commit( doc );
	deepEqual(
		doc.traverse(),
		{ 'a': 0, 'b': 1, 'f': 5, 'd': 33, 'g': 4 },
		'Replaces can be committed'
	);
} );
