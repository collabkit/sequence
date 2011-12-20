module( 'ion.StringOperation' );

test( 'newFrom*', function() {
	var doc = new ion.Document( { 'a': '01234' } );

	// Test 1
	deepEqual(
		ion.StringOperation.newFromInsert( doc, ['a'], 2, '234' ),
		new ion.StringOperation( ['a'], [['retain', 2], ['insert', '234'], ['retain', 3]] ),
		'Insert builds correct components'
	);

	// Test 2
	deepEqual(
		ion.StringOperation.newFromDelete( doc, ['a'], 2, 3 ),
		new ion.StringOperation( ['a'], [['retain', 2], ['delete', '234']] ),
		'Delete builds correct components'
	);

	// Test 3
	deepEqual(
		ion.StringOperation.newFromReplace( doc, ['a'], 2, 3, '432' ),
		new ion.StringOperation( ['a'], [['retain', 2], ['delete', '234'], ['insert', '432']] ),
		'Replace builds correct components'
	);
} );

test( 'commit', function() {
	var doc = new ion.Document( { 'a': '01234' } );

	// Test 1
	ion.StringOperation.newFromInsert( doc, ['a'], 2, '234' ).commit( doc );
	deepEqual( doc.traverse( 'a' ), '01234234', 'Inserts can be committed' );

	// Test 2
	ion.StringOperation.newFromDelete( doc, ['a'], 2, 3 ).commit( doc );
	deepEqual( doc.traverse( 'a' ), '01234', 'Deletes can be committed' );

	// Test 3
	ion.StringOperation.newFromReplace( doc, ['a'], 2, 3, '432' ).commit( doc );
	deepEqual( doc.traverse( 'a' ), '01432', 'Replaces can be committed' );
} );
