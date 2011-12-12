/**
 * Creates a seq.InsertOperation object.
 * 
 * @class
 * @constructor
 * @extends {seq.Sequence}
 * @param {Integer} index Index where operation takes place
 * @param {Array} items Items being inserted
 * @property {Array} items Items being inserted
 */
seq.InsertOperation = function( index, items ) {
	// Extension
	seq.Operation.call( this, index );

	// Properties
	this.items = items;
};

/* Methods */

seq.InsertOperation.prototype.clone = function() {
	return new seq.InsertOperation( this.index, this.items.slice( 0 ) );
};

/* Extension */

seq.extendClass( seq.InsertOperation, seq.Operation );
