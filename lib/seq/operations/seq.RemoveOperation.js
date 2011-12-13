/**
 * Creates a seq.RemoveOperation object.
 * 
 * @class
 * @constructor
 * @extends {seq.ItemsOperation}
 * @param {Integer} index Index where operation takes place
 * @param {Array} items Items being inserted
 */
seq.RemoveOperation = function( index, items ) {
	// Extension
	seq.ItemsOperation.call( this, index, items );
};

/* Extension */

seq.extendClass( seq.RemoveOperation, seq.ItemsOperation );
