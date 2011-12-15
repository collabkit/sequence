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

seq.Transaction.prototype.transform = function( operation ) {
	var a = this,
		b = operation,
		aPrime = new seq.Transaction( this.user ),
		bPrime = new seq.Transaction( b.getUser() ),
		aOps = this.operations,
		bOps = b.getOperations();
	for ( var i = 0, length = Math.max( aOps.length, bOps.length ); i < length; i++ ) {
		if ( aOps[i] === undefined ) {
			// Nothing to transform against
			return [null, bOps[i].clone()];
		} else if ( bOps[i] === undefined ) {
			// Nothing to transform against
			return [aOps[i].clone(), null];
		}
		// Check for identical operations from fastest to slowest tests (lazy evaluation)
		else if (
			// Same types (least expensive tests)
			aOps[i].constructor !== bOps[i].constructor ||
			// Same start
			aOps[i].getStart() !== bOps[i].getStart() ||
			// Same length
			aOps[i].getLength() !== bOps[i].getLength() ||
			// Same data (most expensive test)
			JSON.stringify( aOps[i] ) !== JSON.stringify( bOps[i] )
		) {
			var primes = aOps[i].transform( bOps[i] );
			if ( primes ) {
				// Add operations of b' to transaction a
				aPrime.appendOperations( primes[1] );
				// Add operations of a' to transaction b
				bPrime.appendOperations( primes[0] );
			}
		}
	}
	return [aPrime, bPrime];
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

seq.Transaction.prototype.appendOperations = function( operations ) {
	return this.operations.splice.apply( this.operations, [0, 0].concat( operations ) );
};
