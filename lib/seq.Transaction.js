/**
 * Creates a seq.Transaction object.
 * 
 * @class
 * @constructor
 */
seq.Transaction = function( user, operations ) {
	this.user = user;
	this.operations = operations || [];
};

/* Static Methods */

seq.Transaction.transform = function( a, b ) {
	var aP = new seq.Transaction( a.user ),
		bP = new seq.Transaction( b.user ),
		aOps = a.operations,
		bOps = b.operations,
		aOp,
		bOp,
		aOpP,
		bOpP,
		aL,
		aR,
		bL,
		bR;
	for ( var i = 0, length = Math.max( aOps.length, bOps.length ); i < length; i++ ) {
		aOp = aOps[i];
		bOp = bOps[i];
		aOpP = aOp.slice( 0 );
		bOpP = bOp.slice( 0 );
		// Check for identical operations in order from fastest to slowest test (lazy evaluation)
		if (
			// Same type
			aOp[0] === bOp[0] &&
			// Same index
			aOp[1] === bOp[1] &&
			// Same data length
			aOp[2].length === bOp[2].length &&
			// Same data content
			JSON.stringify( aOp[2] ) === JSON.stringify( bOp[2] )
		) {
			// Nothing to do on either side
			continue;
		}
		aOpL = aOp[1];
		aOpR = aOp[1] + aOp[2].length;
		bOpL = bOp[1];
		bOpR = bOp[1] + bOp[2].length;
		switch ( aOp[0] ) {
			case 'insert':
				switch ( bOp[0] ) {
					// insert|insert
					case 'insert':
						if ( aOpL <= bOpL ) {
							// aOp is before or at bOp
							// Adjust bOpP insert point by aOp insert length
							bOpP[1] += aOp[2].length;
						} else {
							// bOp is after aOp
							// Adjust aOpP insert point by bOp insert length
							aOpP[1] += bOp[2].length;
						}
						break;
					// insert|remove
					case 'remove':
						break;
				}
				break;
			case 'remove':
				switch ( bOp[0] ) {
					// remove|insert
					case 'insert':
						break;
					// remove|remove
					case 'remove':
						if ( aOpR <= bOpL ) {
							// aOp is left of bOp
							// Adjust bOpP removal point by aOp insert length
							bOpP[1] -= aOp[2].length;
						} else if ( aOpL >= bOpR ) {
							// aOp is right of bOp
							// Adjust aOpP removal point by bOp insert length
							aOpP[1] -= bOp[2].length;
						} if ( aOpL >= bOpL && aOpR <= bOpR ) {
							// aOp is inside bOp
						} else if ( bOpL >= aOpL && bOpR <= aOpR ) {
							// bOp is inside aOp
						} else if ( aOpL >= bOpL && aOpL <= bOpR ) {
							// aOp is overlapping and to the right of bOp
						} else if ( aOpR >= bOpL && aOpR <= bOpR ) {
							// aOp is overlapping and to the left of bOp
						}
						break;
				}
				break;
		}
		aP.operations.push( bOpP );
		bP.operations.push( aOpP );
	}
	return [aP, bP];
};

seq.Transaction.newFromPush = function( user, sequence, item ) {
	return new seq.Transaction( user, [['insert', sequence.length, [item]]] );
};

seq.Transaction.newFromUnshift = function( user, sequence, item ) {
	return new seq.Transaction( user, [['insert', 0, [item]]] );
};

seq.Transaction.newFromPop = function( user, sequence ) {
	return new seq.Transaction(
		user,
		[['remove', sequence.length - 1, [sequence[sequence.length - 1]]]]
	);
};

seq.Transaction.newFromShift = function( user, sequence ) {
	return new seq.Transaction( user, [['remove', 0, [sequence[0]]]] );
};

seq.Transaction.newFromSplice = function( user, sequence, retain, remove ) {
	var operations = [];
	if ( remove ) {
		operations.push( ['remove', retain, sequence.slice( retain, retain + remove )] );
	}
	if ( arguments.length > 4 ) {
		operations.push( ['insert', retain, Array.prototype.slice.call( arguments, 4 )] );
	}
	return new seq.Transaction( user, operations );
};

seq.Transaction.newFromReverse = function( user, sequence ) {
	var reversed = sequence.slice();
	reversed.reverse();
	return new seq.Transaction( user, [['remove', 0, sequence], ['insert', 0, reversed]] );
};

seq.Transaction.newFromSort = function( user, sequence, callback ) {
	var sorted = sequence.slice();
	sorted.sort( callback );
	return new seq.Transaction( user, [['remove', 0, sequence], ['insert', 0, sorted]] );
};

/* Methods */

seq.Transaction.prototype.getUser = function() {
	return this.user;
};

seq.Transaction.prototype.getOperations = function() {
	return this.operations;
};
