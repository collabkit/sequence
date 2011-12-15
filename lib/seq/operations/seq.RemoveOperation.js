/**
 * Creates a seq.RemoveOperation object.
 * 
 * @class
 * @constructor
 * @extends {seq.Operation}
 * @param {Integer} start Index where operation takes place
 * @param {Array} items Items being inserted
 */
seq.RemoveOperation = function( start, items ) {
	// Extension
	seq.Operation.call( this, start, items );
};

/* Methods */

seq.RemoveOperation.prototype.transform = function( operation ) {
	var a = this,
		b = operation,
		comparison = a.compareRanges( b ),
		overlap,
		center;
	if ( b instanceof seq.RemoveOperation ) {
		// Symetrical: remove|remove
		switch ( comparison ) {
			// a is equal to or left of b
			case '==':
			case 'ab':
				return [
					// Pass a through as a'
					[a.clone()],
					// Move b to the left to compensate for removal of a to get b'
					[b.clone().move( -a.getLength() )]
				];
			// a is right of b
			case 'ba':
				return [
					// Move a to the left to compensate for removal of b to get a'
					[a.clone().move( -b.getLength() )],
					// Pass b through as b'
					[b.clone()]
				];
			// a is inside b
			case 'bab':
				// Remove items a removed from the center of b to get b'
				return [
					// No operation needed
					null,
					// Remove the already removed items in a from the center of b to get b'
					[b.clone().splice( a.getStart() - b.getStart(), a.getLength() )]
				];
			// b is inside a
			case 'aba':
				return [
					// Remove the already removed items in b from the center of a to get a'
					[a.clone().splice( b.getStart() - a.getStart(), b.getLength() )],
					// No operation needed
					null
				];
			// a is overlapping the left side of b
			case 'abab':
				overlap = a.getEnd() - b.getStart();
				return [
					// Remove overlapping items in b from the right of a to get a'
					[a.clone().trim( -overlap )],
					// Remove overlapping items in a from the left of b and move left to get b'
					[b.clone().trim( overlap ).move( -a.getLength() + overlap )]
				];
			// a is overlapping the right side of b
			case 'baba':
				overlap = b.getEnd() - a.getStart();
				return [
					// Remove overlapping items in b from the left of a and move left to get a'
					[a.clone().trim( overlap ).move( -b.getLength() + overlap )],
					// Remove overlapping items in a from the right of b to get b'
					[b.clone().trim( -overlap )]
				];
		}
	} else if ( b instanceof seq.InsertOperation ) {
		// Asymetrical: remove|insert
		switch ( comparison ) {
			// a is equal to or left of b
			case '==':
				return [
					// Pass a through as a'
					[a.clone()],
					// Pass b through as b'
					[b.clone()]
				];
			case 'ab':
				return [
					// Pass a through as a'
					[a.clone()],
					// Move b to the left to compensate for removal of a to get b'
					[b.clone().move( -a.getLength() )]
				];
			// a is right of, inside or overlapping the right side of b
			case 'ba':
			case 'bab':
			case 'baba':
				return [
					// Move a to the right to compensate for insertion of b to get a'
					[a.clone().move( b.getLength() )],
					// Pass b through as b'
					[b.clone()]
				];
			// a is outside or overlapping the left side of b
			case 'aba':
			case 'abab':
				center = b.getStart() - a.getStart();
				return [
					// Split a into two parts with a gap around b to get a'
					a.clone().split( center, b.getLength() ),
					// Move b to the left to compensate for removal of a to get b'
					[b.clone().move( -center )]
				];
		}
	}
	return null;
};

/* Extension */

seq.extendClass( seq.RemoveOperation, seq.Operation );
