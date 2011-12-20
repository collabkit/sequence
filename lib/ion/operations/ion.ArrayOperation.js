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
	var arr = doc.traverse( path ),
		cmp = [];
	if ( index ) {
		cmp.push( ['retain', index] );
	}
	cmp.push( ['insert', item] );
	if ( cmp.index < arr.length ) {
		cmp.push( ['retain', arr.length - cmp.index] );
	}
	return new ion.ArrayOperation( path, cmp );
};

ion.ArrayOperation.newFromDelete = function( doc, path, index ) {
	var arr = doc.traverse( path ),
		cmp = [];
	if ( index ) {
		cmp.push( ['retain', index] );
	}
	cmp.push( ['delete', arr[index]] );
	if ( cmp.index < arr.length - 1 ) {
		cmp.push( ['retain', arr.length - 1 - cmp.index] );
	}
	return new ion.ArrayOperation( path, cmp );
};

ion.ArrayOperation.newFromReplace = function( doc, path, index, item ) {
	var arr = doc.traverse( path ),
		cmp = [];
	if ( index ) {
		cmp.push( ['retain', index] );
	}
	cmp = cmp.concat( [['delete', arr[index]], ['insert', item]] );
	if ( cmp.index < arr.length ) {
		cmp.push( ['retain', arr.length - cmp.index] );
	}
	return new ion.ArrayOperation( path, cmp );
};

ion.ArrayOperation.newFromMove = function( doc, path, index, before ) {
	var arr = doc.traverse( path ),
		cmp = [];
	if ( index === before ) {
		cmp.push( ['retain', arr.length] );
	} else if ( index < before ) {
		if ( index ) {
			cmp.push( ['retain', index] );
		}
		cmp = cmp.concat( [
			['delete', arr[index]], ['retain', before - index], ['insert', arr[index]]
		] );
		if ( before < arr.length - 1 ) {
			cmp.push( ['retain', arr.length - 1 - before] );
		}
	} else {
		if ( before ) {
			cmp.push( ['retain', before] );
		}
		cmp = cmp.concat( [
			['insert', arr[index]], ['retain', index - before], ['delete', arr[index]]
		] );
		if ( index < arr.length - 1 ) {
			cmp.push( ['retain', arr.length - 1 - index] );
		}
	}
	return new ion.ArrayOperation( path, cmp );
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
	var arr = doc.traverse( this.path ),
		cur = 0;
	_.each( this.components, function( component ) {
		var op = _.objectify( component, 'type', 'value' );
		if ( op.type == 'retain' ) {
			cur += op.value;
		} else if ( op.type === 'insert' ) {
			arr.splice( cur, 0, op.value );
		} else if ( op.type === 'delete' ) {
			if ( verify && _.isEqual( arr[cur], op.value ) ) {
				throw new Error( 'Invalid operation error.' );
			}
			arr.splice( cur, 1 );
		}
	} );
};

/* Extension */

_.extendClass( ion.ArrayOperation, ion.Operation );
