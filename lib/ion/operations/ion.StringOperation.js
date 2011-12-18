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

ion.StringOperation.newFromInsert = function( doc, path, offset, chars ) {
	return new ion.StringOperation( path, [['insert', offset, chars]] );
};

ion.StringOperation.newFromDelete = function( doc, path, offset, length ) {
	return new ion.StringOperation(
		path, [['delete', offset, doc.traverse( path ).substr( offset, length )]]
	);
};

ion.StringOperation.newFromReplace = function( doc, path, offset, length, chars ) {
	return new ion.StringOperation(
		path, [
			['delete', offset, doc.traverse( path ).substr( offset, length )],
			['insert', offset, chars]
		]
	);
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

ion.StringOperation.prototype.commit = function( doc, verify ) {
	var str = doc.traverse( this.path );
	_.each( this.components, function( component ) {
		var op = ion.objectify( component, 'type', 'offset', 'chars' );
		if ( op.type === 'insert' ) {
			str = str.substr( 0, op.offset ) + op.chars + str.substr( op.offset );
		} else if ( op.type === 'delete' ) {
			if ( verify && str.substr( op.offset, op.chars.length ) === op.chars ) {
				throw new Error( 'Invalid operation error.' );
			}
			str = str.substr( 0, op.offset ) + str.substr( op.offset + op.chars.length );
		}
	} );
	// Strings are immutable so we must overwrite the original value
	doc.traverse( doc, this.path, -1 )[_.last( this.path )] = str;
};

/* Extension */

_.extendClass( ion.StringOperation, ion.Operation );
