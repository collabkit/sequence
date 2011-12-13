/**
 * Creates a seq.InsertOperation object.
 * 
 * @class
 * @constructor
 * @extends {seq.ItemsOperation}
 * @param {Integer} index Index where operation takes place
 * @param {Array} items Items being inserted
 */
seq.InsertOperation = function( index, items ) {
	// Extension
	seq.ItemsOperation.call( this, index, items );
};

/* Extension */

seq.extendClass( seq.InsertOperation, seq.ItemsOperation );
