/**
 * Creates a ion.ObjectOperation object.
 * 
 * @class
 * @constructor
 * @param {Array} path Path of keys and indexes to data
 * @param {Array} [components] Steps involved in completing the operation
 */
ion.StringOperation = function( path, components ) {
	// Extension
	ion.Operation.call( this, path, components );
};

/* Static Methods */

ion.StringOperation.newFromInsert = function( doc, path, offset, characters ) {
	var data = doc.traverse( path ),
		components = [];
	if ( offset ) {
		components.push( ['retain', offset] );
	}
	components.push( ['insert', characters] );
	if ( offset < data.length - 1 ) {
		components.push( ['retain', data.length - 1 - offset] );
	}
	return op;
};

ion.StringOperation.newFromDelete = function( doc, path, offset, length ) {
	var data = doc.traverse( path ),
		components = [];
	if ( offset ) {
		components.push( ['retain', offset] );
	}
	components.push( ['delete', doc.traverse( path ).substr( offset, length )] );
	if ( offset - length < data.length - 1 ) {
		components.push( ['retain', data.length - 1 - offset - length] );
	}
	return new ion.StringOperation( path, components );
};

/* Methods */

ion.StringOperation.prototype.invert = function() {
	//
};

ion.StringOperation.prototype.compose = function( other ) {
	//
};

ion.StringOperation.prototype.transform = function( other ) {
	//
};

/* Extension */

ion.extendClass( ion.StringOperation, ion.Operation );
