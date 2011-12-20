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
	var str = doc.traverse( path ),
		cmps = [];
	if ( offset ) {
		cmps.push( ['retain', offset] );
	}
	cmps.push( ['insert', chars] );
	if ( offset < str.length ) {
		cmps.push( ['retain', str.length - offset] );
	}
	return new ion.StringOperation( path, cmps );
};

ion.StringOperation.newFromDelete = function( doc, path, offset, length ) {
	var str = doc.traverse( path ),
		cmps = [];
	if ( offset ) {
		cmps.push( ['retain', offset] );
	}
	cmps.push( ['delete', str.substr( offset, length )] );
	if ( offset < str.length - length ) {
		cmps.push( ['retain', str.length - length - offset] );
	}
	return new ion.StringOperation( path, cmps );
};

ion.StringOperation.newFromReplace = function( doc, path, offset, length, chars ) {
	var str = doc.traverse( path ),
		cmps = [];
	if ( offset ) {
		cmps.push( ['retain', offset] );
	}
	cmps.push( ['delete', str.substr( offset, length )] );
	cmps.push( ['insert', chars] );
	if ( offset < str.length - length) {
		cmps.push( ['retain', str.length - length - offset] );
	}
	return new ion.StringOperation( path, cmps );
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

ion.StringOperation.prototype.commit = function( doc, check ) {
	var str = doc.traverse( this.path ),
		cur = 0;
	_.each( this.components, function( cmp ) {
		if ( cmp[0] === 'retain' ) {
			cur += cmp[1];
		} else if ( cmp[0] === 'insert' ) {
			str = str.substr( 0, cur ) + cmp[1] + str.substr( cur );
		} else if ( cmp[0] === 'delete' ) {
			if ( check && str.substr( cur, cmp[1].length ) === cmp[1] ) {
				throw new Error( 'Invalid operation component error.' );
			}
			str = str.substr( 0, cur ) + str.substr( cur + cmp[1].length );
		}
	} );
	// Strings are immutable so we must overwrite the original value
	doc.traverse( doc, this.path, -1 )[_.last( this.path )] = str;
};

/* Extension */

_.extendClass( ion.StringOperation, ion.Operation );
