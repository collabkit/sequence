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
		overlap;
	if ( b instanceof seq.RemoveOperation ) {
		switch ( comparison ) {
			case '==': // a is equal to b
			case 'ab': // a is left of b
				// Adjust bPrime insert point by a insert length
				return [a.clone(), b.clone().move( -a.getLength() )];
			case 'ba': // a is right of b
				// Adjust aPrime insert point by b insert length
				return [a.clone().move( -b.getLength() ), b.clone()];
			case 'bab': // a is inside b
				return [null, b.clone().splice( a.getStart() - b.getStart(), a.getLength() )];
			case 'aba': // b is inside a
				return [a.clone().splice( b.getStart() - a.getStart(), b.getLength() ), null];
			case 'abab': // a is overlapping the left side of b
				overlap = a.getEnd() - b.getStart();
				return [
					a.clone().trim( -overlap ),
					b.clone().trim( overlap ).move( -a.getLength() + overlap )
				];
			case 'baba': // a is overlapping the right side of b
				overlap = b.getEnd() - a.getStart();
				return [
					a.clone().trim( overlap ).move( -b.getLength() + overlap ),
					b.clone().trim( -overlap )
				];
		}
	} else if ( b instanceof seq.InsertOperation ) {
		// Asymetrical: remove|insert
		// TODO
	}
	return null;
};

/* Extension */

seq.extendClass( seq.RemoveOperation, seq.Operation );
