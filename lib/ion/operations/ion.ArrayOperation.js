/**
 * Creates a ion.ArrayOperation object.
 * 
 * @class
 * @constructor
 * @param {Array} path Path of keys and indexes to data
 * @param {Array} [components] Steps involved in completing the operation
 */
ion.ArrayOperation = function( path, components ) {
	// Extension
	ion.Operation.call( this, path, components );
};

/* Static Methods */

ion.ArrayOperation.newFromInsert = function( doc, path, index, value ) {
	//
};

ion.ArrayOperation.newFromDelete = function( doc, path, index ) {
	//
};

ion.ArrayOperation.newFromReplace = function( doc, path, index, value ) {
	//
};

ion.ArrayOperation.newFromMove = function( doc, path, fromIndex, toIndex ) {
	//
};

/* Methods */

ion.ArrayOperation.prototype.invert = function() {
	//
};

ion.ArrayOperation.prototype.compose = function( other ) {
	//
};

ion.ArrayOperation.prototype.transform = function( other ) {
	//
};

/* Extension */

ion.extendClass( ion.ArrayOperation, ion.Operation );
