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

ion.ArrayOperation.newFromInsert = function( doc, path, index, item ) {
	return new ion.ArrayOperation( path, [['insert', index, item]] );
};

ion.ArrayOperation.newFromDelete = function( doc, path, index ) {
	return new ion.ArrayOperation( path, [['delete', index, doc.traverse( path )[index]]] );
};

ion.ArrayOperation.newFromReplace = function( doc, path, index, item ) {
	return new ion.ArrayOperation(
		path, [['delete', index, doc.traverse( path )[index]], ['insert', index, item]]
	);
};

ion.ArrayOperation.newFromMove = function( doc, path, index, before ) {
	var item = doc.traverse( path )[index];
	return new ion.ArrayOperation( path, [['delete', index, item], ['insert', before - 1, item]] );
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

ion.ArrayOperation.prototype.commit = function( doc, verify ) {
	var arr = doc.traverse( this.path );
	_.each( this.components, function( component ) {
		var op = ion.objectify( component, 'type', 'index', 'item' );
		if ( op.type === 'insert' ) {
			arr.splice( arr, op.index, 0, op.item );
		} else if ( op.type === 'delete' ) {
			if ( verify && _.isEqual( arr[op.index], op.item ) ) {
				throw new Error( 'Invalid operation error.' );
			}
			arr.splice( args[0], args[1].length );
		}
	} );
};

/* Extension */

_.extendClass( ion.ArrayOperation, ion.Operation );
