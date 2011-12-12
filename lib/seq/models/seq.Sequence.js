/**
 * Creates a seq.Sequence object.
 * 
 * @class
 * @constructor
 * @param {Array} items Items in sequence
 * @property {Array} items Items in sequence
 */
seq.Sequence = function( items ) {
	this.items = items || [];
};

/* Methods */

seq.Sequence.prototype.getHash = function() {
	return Crypto.SHA1( JSON.stringify( this.items ) );
};

seq.Sequence.prototype.getItems = function() {
	return this.items;
};

seq.Sequence.prototype.sliceItems = function( from, to ) {
	return this.items.slice( from, to );
};

seq.Sequence.prototype.getItem = function( index ) {
	return this.items[index];
};

seq.Sequence.prototype.getFirstItem = function() {
	return this.items[0];
};

seq.Sequence.prototype.getLastItem = function() {
	return this.items[this.items.length - 1];
};

seq.Sequence.prototype.countItems = function() {
	return this.items.length;
};

seq.Sequence.prototype.pushItem = function( item ) {
	return this.items.push( item );
};

seq.Sequence.prototype.unshiftItem = function( item ) {
	return this.items.unshift( item );
};

seq.Sequence.prototype.popItem = function() {
	return this.items.pop();
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

seq.Sequence.prototype.swapItems = function( a, b ) {
	this.items[b] = this.items.splice( a, 1, this.items[b] )[0];
	return this.items;
};

seq.Sequence.prototype.isOperationValid = function( op ) {
	if ( typeof op.index === 'number' && op.index >= 0 && op.index <= this.items.length ) {
		if ( op instanceof seq.InsertOperation ) {
			return true;
		} else if ( op instanceof seq.RemoveOperation ) {
			var items = this.items.slice( op.index, op.index + op.items.length );
			return JSON.stringify( items ) === JSON.stringify( op.items );
		}
	}
	return false;
};

seq.Sequence.prototype.applyOperation = function( op ) {
	if ( op instanceof seq.InsertOperation ) {
		this.spliceItems.apply( this, [op.index, 0].concat( op.items ) );
	} else if ( op instanceof seq.RemoveOperation ) {
		this.spliceItems( op.index, op.items.length );
	} else {
		throw new Error( 'Invalid operation type error. Operation is not supported' );
	}
	return this;
};
