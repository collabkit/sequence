/**
 * Creates a seq.RemoveOperation object.
 * 
 * @class
 * @constructor
 * @extends {seq.Sequence}
 * @param {Integer} index Index where operation takes place
 * @param {Array} items Items being inserted
 * @property {Array} items Items being removed
 */
seq.RemoveOperation = function( index, items ) {
	// Extension
	seq.Operation.call( this, index );

	// Properties
	this.items = items;
};

/* Methods */

seq.RemoveOperation.prototype.clone = function() {
	return new seq.RemoveOperation( this.index, this.items.slice( 0 ) );
};

seq.RemoveOperation.prototype.getIndex = function() {
	return this.index;
};

seq.RemoveOperation.prototype.getLength = function() {
	return this.items.length;
};

seq.RemoveOperation.prototype.getItems = function() {
	return this.items;
};

seq.RemoveOperation.prototype.adjustIndex = function( distance ) {
	this.index += distance;
};

/* Extension */

seq.extendClass( seq.RemoveOperation, seq.Operation );
