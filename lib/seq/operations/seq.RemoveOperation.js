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
					null,
					[b.clone().splice( a.getStart() - b.getStart(), a.getLength() )]
				];
			// b is inside a
			case 'aba':
				return [
					[a.clone().splice( b.getStart() - a.getStart(), b.getLength() )],
					null
				];
			// a is overlapping the left side of b
			case 'abab':
				overlap = a.getEnd() - b.getStart();
				return [
					[a.clone().trim( -overlap )],
					[b.clone().trim( overlap ).move( -a.getLength() + overlap )]
				];
			// a is overlapping the right side of b
			case 'baba':
				overlap = b.getEnd() - a.getStart();
				return [
					[a.clone().trim( overlap ).move( -b.getLength() + overlap )],
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
			// a is right of or inside of b
			case 'ba':
			case 'bab':
				return [
					// Move a to the right to compensate for insertion of b to get a'
					[a.clone().move( b.getLength() )],
					// Pass b through as b'
					[b.clone()]
				];
			// b is inside a
			case 'aba':
				center = b.getStart() - a.getStart();
				return [
					a.clone().split( center, b.getLength() ),
					[b.clone().move( -center )]
				];
			// a is overlapping the left side of b
			case 'abab':
				return [];
			// a is overlapping the right side of b
			case 'baba':
				return [];
		}
	}
	return null;
};

/* Extension */

seq.extendClass( seq.RemoveOperation, seq.Operation );
