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
	return new ion.ObjectOperation( path, [['insert', key, value]] );
};

ion.ObjectOperation.newFromDelete = function( doc, path, key ) {
	var value = doc.traverse( path )[key];
	return new ion.ObjectOperation( path, [['delete', key, value]] );
};

ion.ObjectOperation.newFromReplace = function( doc, path, key, value ) {
	return new ion.ObjectOperation(
		path, [['delete', key, doc.traverse( path )[key]], ['insert', key, value]]
	);
};

ion.ObjectOperation.newFromMove = function( doc, path, oldKey, newKey ) {
	var value = doc.traverse( path )[oldKey];
	return new ion.ObjectOperation( path, [['delete', oldKey, value], ['insert', newKey, value]] );
};

/* Methods */

ion.ObjectOperation.prototype.compose = function( other ) {
	//
};

ion.ObjectOperation.prototype.transform = function( other ) {
	//
};

ion.ObjectOperation.prototype.commit = function( doc, check ) {
	var obj = doc.traverse( this.path );
	_.each( this.components, function( cmp ) {
		if ( cmp[0] === 'insert' ) {
			obj[cmp[1]] = cmp[2];
		} else if ( cmp[0] === 'delete' ) {
			if ( check && _.isEqual( obj[cmp[1]], cmp[2] ) ) {
				throw new Error( 'Invalid operation component error.' );
			}
			delete obj[cmp[1]];
		}
	} );
};

/* Extension */

_.extendClass( ion.ObjectOperation, ion.Operation );
