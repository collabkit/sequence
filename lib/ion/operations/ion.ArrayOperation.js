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
		cmps = [];
	if ( index ) {
		cmps.push( ['retain', index] );
	}
	cmps.push( ['insert', item] );
	if ( cmps.index < arr.length ) {
		cmps.push( ['retain', arr.length - cmps.index] );
	}
	return new ion.ArrayOperation( path, cmps );
};

ion.ArrayOperation.newFromDelete = function( doc, path, index ) {
	var arr = doc.traverse( path ),
		cmps = [];
	if ( index ) {
		cmps.push( ['retain', index] );
	}
	cmps.push( ['delete', arr[index]] );
	if ( cmps.index < arr.length - 1 ) {
		cmps.push( ['retain', arr.length - 1 - cmps.index] );
	}
	return new ion.ArrayOperation( path, cmps );
};

ion.ArrayOperation.newFromReplace = function( doc, path, index, item ) {
	var arr = doc.traverse( path ),
		cmps = [];
	if ( index ) {
		cmps.push( ['retain', index] );
	}
	cmps = cmps.concat( [['delete', arr[index]], ['insert', item]] );
	if ( cmps.index < arr.length ) {
		cmps.push( ['retain', arr.length - cmps.index] );
	}
	return new ion.ArrayOperation( path, cmps );
};

ion.ArrayOperation.newFromMove = function( doc, path, index, before ) {
	var arr = doc.traverse( path ),
		cmps = [];
	if ( index === before ) {
		cmps.push( ['retain', arr.length] );
	} else if ( index < before ) {
		if ( index ) {
			cmps.push( ['retain', index] );
		}
		cmps = cmps.concat( [
			['delete', arr[index]], ['retain', before - index], ['insert', arr[index]]
		] );
		if ( before < arr.length - 1 ) {
			cmps.push( ['retain', arr.length - 1 - before] );
		}
	} else {
		if ( before ) {
			cmps.push( ['retain', before] );
		}
		cmps = cmps.concat( [
			['insert', arr[index]], ['retain', index - before], ['delete', arr[index]]
		] );
		if ( index < arr.length - 1 ) {
			cmps.push( ['retain', arr.length - 1 - index] );
		}
	}
	return new ion.ArrayOperation( path, cmps );
};

/* Methods */

ion.ArrayOperation.prototype.compose = function( other ) {
	//
};

ion.ArrayOperation.prototype.transform = function( other ) {
	//
};

ion.ArrayOperation.prototype.commit = function( doc, check ) {
	var arr = doc.traverse( this.path ),
		cur = 0;
	_.each( this.components, function( cmp ) {
		if ( cmp[0] == 'retain' ) {
			cur += cmp[1];
		} else if ( cmp[0] === 'insert' ) {
			arr.splice( cur, 0, cmp[1] );
		} else if ( cmp[0] === 'delete' ) {
			if ( check && _.isEqual( arr[cur], cmp[1] ) ) {
				throw new Error( 'Invalid operation component error.' );
			}
			arr.splice( cur, 1 );
		}
	} );
};

/* Extension */

_.extendClass( ion.ArrayOperation, ion.Operation );
