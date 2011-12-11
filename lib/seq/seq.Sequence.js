/**
 * Creates a seq.Sequence object.
 * 
 * @class
 * @constructor
 */
seq.Sequence = function( items ) {
	this.items = items || [];
};

/* Static Members */

seq.Sequence.InsertOperation = function( index, items ) {
	this.index = index;
	this.items = items;
};
seq.Sequence.DeleteOperation = function( index, items ) {
	this.index = index;
	this.items = items;
};

/* Methods */

seq.Sequence.prototype.getHash = function() {
	return Crypto.SHA1( JSON.stringify( this.items ) );
};

seq.Sequence.prototype.countItems = function() {
	return this.items.length;
};

seq.Sequence.prototype.pushItem = function( item ) {
	return this.items.push( item );
};

seq.Sequence.prototype.popItem = function() {
	return this.items.pop();
};

seq.Sequence.prototype.unshiftItem = function( item ) {
	return this.items.push( item );
};

seq.Sequence.prototype.shiftItem = function() {
	return this.items.shift();
};

seq.Sequence.prototype.spliceItems = function() {
	return this.items.splice.apply( this.items, Array.prototype.slice.call( arguments ) );
};

seq.Sequence.prototype.reverseItems = function() {
	return this.items.reverse();
};

seq.Sequence.prototype.sortItems = function( compareFunction ) {
	return this.items.sort( compareFunction );
};

seq.Sequence.prototype.isOperationValid = function( op ) {
	if ( typeof op.index === 'number' && op.index >= 0 && op.index <= this.items.length ) {
		if ( op instanceof seq.Sequence.InsertOperation ) {
			return true;
		} else if ( op instanceof seq.Sequence.DeleteOperation ) {
			var items = this.items.slice( op.index, op.index + op.items.length );
			return JSON.stringify( items ) === JSON.stringify( op.items );
		}
	}
	return false;
};

seq.Sequence.prototype.applyOperation = function( op ) {
	if ( op instanceof seq.Sequence.InsertOperation ) {
		this.spliceItems.apply( this, [op.index, 0].concat( op.items ) );
	} else if ( op instanceof seq.Sequence.DeleteOperation ) {
		this.spliceItems( op.index, op.items.length );
	} else {
		throw new Error( 'Invalid operation type error. Operation is not supported' );
	}
};

/* Extension */

seq.extendClass( seq.Sequence, seq.Observable );
