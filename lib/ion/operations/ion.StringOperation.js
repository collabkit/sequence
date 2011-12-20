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
		cmp = [];
	if ( offset ) {
		cmp.push( ['retain', offset] );
	}
	cmp.push( ['insert', chars] );
	if ( offset < str.length ) {
		cmp.push( ['retain', str.length - offset] );
	}
	return new ion.StringOperation( path, cmp );
};

ion.StringOperation.newFromDelete = function( doc, path, offset, length ) {
	var str = doc.traverse( path ),
		cmp = [];
	if ( offset ) {
		cmp.push( ['retain', offset] );
	}
	cmp.push( ['delete', str.substr( offset, length )] );
	if ( offset < str.length - length ) {
		cmp.push( ['retain', str.length - length - offset] );
	}
	return new ion.StringOperation( path, cmp );
};

ion.StringOperation.newFromReplace = function( doc, path, offset, length, chars ) {
	var str = doc.traverse( path ),
		cmp = [];
	if ( offset ) {
		cmp.push( ['retain', offset] );
	}
	cmp.push( ['delete', str.substr( offset, length )] );
	cmp.push( ['insert', chars] );
	if ( offset < str.length - length) {
		cmp.push( ['retain', str.length - length - offset] );
	}
	return new ion.StringOperation( path, cmp );
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
	var str = doc.traverse( this.path ),
		cur = 0;
	_.each( this.components, function( component ) {
		var op = _.objectify( component, 'type', 'value' );
		if ( op.type === 'retain' ) {
			cur += op.value;
		} else if ( op.type === 'insert' ) {
			str = str.substr( 0, cur ) + op.value + str.substr( cur );
		} else if ( op.type === 'delete' ) {
			if ( verify && str.substr( cur, op.value.length ) === op.value ) {
				throw new Error( 'Invalid operation error.' );
			}
			str = str.substr( 0, cur ) + str.substr( cur + op.value.length );
		}
	} );
	// Strings are immutable so we must overwrite the original value
	doc.traverse( doc, this.path, -1 )[_.last( this.path )] = str;
};

/* Extension */

_.extendClass( ion.StringOperation, ion.Operation );
