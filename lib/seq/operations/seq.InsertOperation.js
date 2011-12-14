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
		comparison = a.compareRanges( b );
	if ( b instanceof seq.InsertOperation ) {
		// Symetrical: insert|insert
		switch ( comparison ) {
			case '==': // a is equal to b
			case 'ab': // a is left of b
				// Adjust bPrime insert point by a insert length
				return [a.clone(), b.clone().move( a.getLength() )];
			case 'ba': // a is right of b
				// Adjust aPrime insert point by b insert length
				return [a.clone().move( b.getLength() ), b.clone()];
		}
	} else if ( b instanceof seq.RemoveOperation ) {
		// Asymetrical: insert|remove
		// TODO
	}
	return null;
};

/* Extension */

seq.extendClass( seq.InsertOperation, seq.Operation );
