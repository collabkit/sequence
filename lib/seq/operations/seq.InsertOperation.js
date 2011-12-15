/**
 * Creates a seq.InsertOperation object.
 * 
 * @class
 * @constructor
 * @extends {seq.Operation}
 * @param {Integer} start Index where operation takes place
 * @param {Array} items Items being inserted
 */
seq.InsertOperation = function( start, items ) {
	// Extension
	seq.Operation.call( this, start, items );
};

/* Methods */

seq.InsertOperation.prototype.transform = function( operation ) {
	var a = this,
		b = operation,
		comparison = a.compareRanges( b ),
		center;
	if ( b instanceof seq.InsertOperation ) {
		// Symetrical: insert|insert
		switch ( comparison ) {
			// a is equal to or left of b
			case '==':
			case 'ab':
				return [
					// Pass a through as a'
					[a.clone()], 
					// Move b to the right to compensate for insertion of a to get b'
					[b.clone().move( a.getLength() )]
				];
			// a is right of b
			case 'ba':
				return [
					// Move a to the right to compensate for insertion of b to get a'
					[a.clone().move( b.getLength() )],
					// Pass b through as b'
					[b.clone()]
				];
		}
	} else if ( b instanceof seq.RemoveOperation ) {
		// Asymetrical: insert|remove
		switch ( comparison ) {
			// a is equal to, left of, outside or overlapping the left side of b
			case '==':
			case 'ab':
			case 'aba':
			case 'abab':
				return [
					// Pass a through as a'
					[a.clone()],
					// Move b to the right to compensate for insertion of a to get b'
					[b.clone().move( a.getLength() )]
				];
			// a is right of b
			case 'ba':
				return [
					// Move a to the left to compensate for removal of b to get a'
					[a.clone().move( -b.getLength() )],
					// Pass b through as b'
					[b.clone()]
				];
			// a is inside or overlapping the right side of b
			case 'bab':
			case 'baba':
				center = a.getStart() - b.getStart();
				return [
					// Move a to the left to compensate for removal of b to get a'
					[a.clone().move( -center )],
					// Split b into two parts with a gap around a to get b'
					b.clone().split( center, a.getLength() )
				];
		}
	}
	return null;
};

/* Extension */

seq.extendClass( seq.InsertOperation, seq.Operation );
