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

seq.Operation.transform = function( a, b ) {
	var aPrime = a.clone(),
		bPrime = b.clone(),
		aIndex = a.getIndex(),
		bIndex = b.getIndex(),
		aLength = a.getLength(),
		bLength = b.getLength(),
		aEnd = aIndex + aLength,
		bEnd = bIndex + bLength;
	// Check for identical operations in order from fastest to slowest test (lazy evaluation)
	if (
		// Same type
		a.constructor === b.constructor &&
		// Same index
		aIndex === bIndex &&
		// Same data length
		aLength === bLength &&
		// Same data content
		JSON.stringify( a.getItems() ) === JSON.stringify( b.getItems() )
	) {
		// Nothing to do on either side
		return null;
	}
	if ( a instanceof seq.InsertOperation ) {
		if ( b instanceof seq.InsertOperation ) {
			// Symetrical: insert|insert
			if ( aIndex <= bIndex ) {
				// Adjust bPrime insert point by a insert length (a is before or at b)
				bPrime.adjustIndex( aLength );
			} else {
				// Adjust aPrime insert point by b insert length (b is after a)
				aPrime.adjustIndex( bLength );
			}
		} else if ( b instanceof seq.RemoveOperation ) {
			// Asymetrical: insert|remove
			// TODO
		}
	} else if ( a instanceof seq.RemoveOperation ) {
		if ( b instanceof seq.RemoveOperation ) {
			// Symetrical: remove|remove
			if ( aEnd <= bIndex ) {
				// Adjust bPrime removal point by a insert length (a is left of b)
				bPrime.adjustIndex( -aLength );
			} else if ( aIndex >= bEnd ) {
				// Adjust aPrime removal point by b insert length (a is right of b)
				aPrime.adjustIndex( -bLength );
			} if ( aIndex >= bIndex && aEnd <= bEnd ) {
				// (a is inside b)
				// TODO
			} else if ( bIndex >= aIndex && bEnd <= aEnd ) {
				// (b is inside a)
				// TODO
			} else if ( aIndex >= bIndex && aIndex <= bEnd ) {
				// (a is overlapping and to the right of b)
				// TODO
			} else if ( aEnd >= bIndex && aEnd <= bEnd ) {
				// (a is overlapping and to the left of b)
				// TODO
			}
		} else if ( b instanceof seq.InsertOperation ) {
			// Asymetrical: remove|insert
			// TODO
		}
	}
	return [aPrime, bPrime];
};
