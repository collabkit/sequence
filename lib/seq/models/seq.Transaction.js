/**
 * Creates a seq.Transaction object.
 * 
 * @class
 * @constructor
 * @param {String} user User ID
 * @param {seq.Operation[]} operations Operations in transaction
 * @property {String} user User ID
 * @property {seq.Operation[]} operations Operations in transaction
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
		aOpP = aOp.clone();
		bOpP = bOp.clone();
		// Check for identical operations in order from fastest to slowest test (lazy evaluation)
		if (
			// Same type
			aOp.type === bOp.type &&
			// Same index
			aOp.index === bOp.index &&
			// Same data length
			aOp.items.length === bOp.items.length &&
			// Same data content
			JSON.stringify( aOp.items ) === JSON.stringify( bOp.items )
		) {
			// Nothing to do on either side
			continue;
		}
		aOpL = aOp.index;
		aOpR = aOp.index + aOp.items.length;
		bOpL = bOp.index;
		bOpR = bOp.index + bOp.items.length;
		switch ( aOp.type ) {
			case 'insert':
				switch ( bOp.type ) {
					// insert|insert
					case 'insert':
						if ( aOpL <= bOpL ) {
							// aOp is before or at bOp
							// Adjust bOpP insert point by aOp insert length
							bOpP.index += aOp.items.length;
						} else {
							// bOp is after aOp
							// Adjust aOpP insert point by bOp insert length
							aOpP.index += bOp.items.length;
						}
						break;
					// insert|remove
					case 'remove':
						break;
				}
				break;
			case 'remove':
				switch ( bOp.type ) {
					// remove|insert
					case 'insert':
						break;
					// remove|remove
					case 'remove':
						if ( aOpR <= bOpL ) {
							// aOp is left of bOp
							// Adjust bOpP removal point by aOp insert length
							bOpP.index -= aOp.items.length;
						} else if ( aOpL >= bOpR ) {
							// aOp is right of bOp
							// Adjust aOpP removal point by bOp insert length
							aOpP.index -= bOp.items.length;
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

seq.Transaction.newFromPushItem = function( user, sequence, item ) {
	return new seq.Transaction(
		user,
		[new seq.InsertOperation( sequence.countItems(), [item] )]
	);
};

seq.Transaction.newFromUnshiftItem = function( user, sequence, item ) {
	return new seq.Transaction(
		user,
		[new seq.InsertOperation( 0, [item] )]
	);
};

seq.Transaction.newFromPopItem = function( user, sequence ) {
	return new seq.Transaction(
		user,
		[new seq.RemoveOperation( sequence.countItems() - 1, [sequence.getLastItem()] )]
	);
};

seq.Transaction.newFromShiftItem = function( user, sequence ) {
	return new seq.Transaction(
		user,
		[new seq.RemoveOperation( 0, [sequence.getFirstItem()] )]
	);
};

seq.Transaction.newFromSpliceItems = function( user, sequence, retain, remove ) {
	var operations = [];
	if ( remove ) {
		operations.push(
			new seq.RemoveOperation(
				retain, sequence.sliceItems( retain, retain + remove )
			)
		);
	}
	if ( arguments.length > 4 ) {
		operations.push(
			new seq.InsertOperation( retain, Array.prototype.slice.call( arguments, 4 ) )
		);
	}
	return new seq.Transaction( user, operations );
};

seq.Transaction.newFromReverseItems = function( user, sequence ) {
	var reversed = sequence.sliceItems( 0 );
	reversed.reverse();
	return new seq.Transaction(
		user,
		[
			new seq.RemoveOperation( 0, sequence.getItems() ),
			new seq.InsertOperation( 0, reversed )
		]
	);
};

seq.Transaction.newFromSortItems = function( user, sequence, callback ) {
	var sorted = sequence.sliceItems( 0 );
	sorted.sort( callback );
	return new seq.Transaction(
		user,
		[
			new seq.RemoveOperation( 0, sequence.getItems() ),
			new seq.InsertOperation( 0, sorted )
		]
	);
};

seq.Transaction.newFromSwapItems = function( user, sequence, a, b ) {
	return new seq.Transaction(
		user,
		[
			new seq.RemoveOperation( a, [sequence.getItem( a )] ),
			new seq.InsertOperation( b, [sequence.getItem( a )] )
		]
	);
};

/* Methods */

seq.Transaction.prototype.getUser = function() {
	return this.user;
};

seq.Transaction.prototype.getOperations = function() {
	return this.operations;
};
