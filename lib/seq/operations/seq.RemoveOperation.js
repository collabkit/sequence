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
	seq.Operation.call( this, 'remove', index );

	// Properties
	this.items = items;
};

/* Methods */

seq.RemoveOperation.prototype.clone = function() {
	return new seq.RemoveOperation( this.index, this.items.slice( 0 ) );
};

/* Extension */

seq.extendClass( seq.RemoveOperation, seq.Operation );
