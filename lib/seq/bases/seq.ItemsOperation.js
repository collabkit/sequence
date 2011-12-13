/**
 * Creates a seq.ItemsOperation object.
 * 
 * @class
 * @constructor
 * @extends {seq.Operation}
 * @param {Integer} index Index where operation takes place
 * @param {Array} items Items being inserted
 * @property {Array} items Items being changed
 */
seq.ItemsOperation = function( index, items ) {
	// Extension
	seq.Operation.call( this, index );

	// Properties
	this.items = items;
};

/* Methods */

seq.ItemsOperation.prototype.getLength = function() {
	return this.items.length;
};

seq.ItemsOperation.prototype.getItems = function() {
	return this.items;
};

seq.ItemsOperation.prototype.clone = function() {
	return new this.constructor( this.index, this.items.slice( 0 ) );
};

seq.ItemsOperation.prototype.move = function( distance ) {
	this.index += distance;
	return this;
};

seq.ItemsOperation.prototype.trim = function( length ) {
	if ( length > 0 ) {
		// Trim left
		this.items = this.items.slice( length );
	} else if ( length < 0 ) {
		// Trim right
		this.items = this.items.slice( 0, this.items.length + length );
	}
	return this;
};

/* Extension */

seq.extendClass( seq.ItemsOperation, seq.Operation );
