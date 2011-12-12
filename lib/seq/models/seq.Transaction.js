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
		bOps = b.operations;
	for ( var i = 0, length = Math.max( aOps.length, bOps.length ); i < length; i++ ) {
		var primes = seq.Operation.transform( aOps[i], bOps[i] );
		if ( primes !== null ) {
			// Add operation b prime to transaction a
			aP.operations.push( primes[1] );
			// Add operation a prime to transaction b
			bP.operations.push( primes[0] );
		}
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
