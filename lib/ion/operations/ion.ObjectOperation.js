/**
 * Creates a ion.ObjectOperation object.
 * 
 * @class
 * @constructor
 * @param {Array} path Path of keys and indexes to data
 * @param {Array} [components] Steps involved in completing the operation
 */
ion.ObjectOperation = function( path, components ) {
	// Extension
	ion.Operation.call( this, path, components );
};

/* Static Methods */

ion.ObjectOperation.newFromInsert = function( doc, path, key, value ) {
	//
};

ion.ObjectOperation.newFromDelete = function( doc, path, key ) {
	//
};

ion.ObjectOperation.newFromReplace = function( doc, path, key, value ) {
	//
};

ion.ObjectOperation.newFromMove = function( doc, path, fromKey, toKey ) {
	//
};

/* Methods */

ion.ObjectOperation.prototype.invert = function() {
	//
};

ion.ObjectOperation.prototype.compose = function( other ) {
	//
};

ion.ObjectOperation.prototype.transform = function( other ) {
	//
};

/* Extension */

ion.extendClass( ion.ObjectOperation, ion.Operation );
