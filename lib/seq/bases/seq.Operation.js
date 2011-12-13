/**
 * Creates a seq.Operation object.
 * 
 * @class
 * @abstract
 * @constructor
 * @param {Integer} index Index where operation takes place
 */
seq.Operation = function( index ) {
	this.index = index;
};

/* Static Methods */

seq.Operation.transform = function( a, b ) {
	// Check for identical operations in order from fastest to slowest test (lazy evaluation)
	if (
		// Same types (least expensive tests)
		a.constructor !== b.constructor ||
		// Same index (rules most operations out)
		a.getIndex() !== b.getIndex() ||
		// Same data (most expensive test)
		JSON.stringify( a ) !== JSON.stringify( b )
	) {
		var aLeft = a.getIndex(),
			bLeft = b.getIndex(),
			aLength = a.getLength(),
			bLength = b.getLength(),
			aRight = aLeft + aLength,
			bRight = bLeft + bLength;
		if ( a instanceof seq.InsertOperation ) {
			if ( b instanceof seq.InsertOperation ) {
				// Symetrical: insert|insert
				if ( aLeft <= bLeft ) {
					// Adjust bPrime insert point by a insert length (a is before or at b)
					return [a.clone(), b.clone().move( aLength )];
				} else {
					// Adjust aPrime insert point by b insert length (b is after a)
					return [a.clone().move( bLength ), b.clone()];
				}
			} else if ( b instanceof seq.RemoveOperation ) {
				// Asymetrical: insert|remove
				// TODO
			}
		} else if ( a instanceof seq.RemoveOperation ) {
			if ( b instanceof seq.RemoveOperation ) {
				// Symetrical: remove|remove
				if ( aRight <= bLeft ) {
					// Adjust bPrime removal point by a insert length (a is left of b)
					return [a.clone(), b.clone().move( -aLength )];
				} else if ( aLeft >= bRight ) {
					// Adjust aPrime removal point by b insert length (a is right of b)
					return [a.clone().move( -bLength ), b.clone()];
				} if ( aLeft >= bLeft && aRight <= bRight ) {
					// (a is inside b)
					// TODO
				} else if ( bLeft >= aLeft && bRight <= aRight ) {
					// (b is inside a)
					// TODO
				} else if ( aLeft >= bLeft && aLeft <= bRight ) {
					// (a is overlapping and to the right of b)
					// TODO
				} else if ( aRight >= bLeft && aRight <= bRight ) {
					// (a is overlapping and to the left of b)
					// TODO
				}
			} else if ( b instanceof seq.InsertOperation ) {
				// Asymetrical: remove|insert
				// TODO
			}
		}
	}
	return null;
};

/* Methods */

seq.Operation.prototype.getIndex = function() {
	return this.index;
};

seq.Operation.prototype.getLength = function() {
	return 0;
};

