/**
 * Creates a seq.Operation object.
 * 
 * @class
 * @abstract
 * @constructor
 * @param {String} type Symbolic name of operation type
 * @param {Integer} index Index where operation takes place
 */
seq.Operation = function( type, index ) {
	this.type = type;
	this.index = index;
};
