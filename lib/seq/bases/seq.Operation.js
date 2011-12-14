/**
 * Creates a seq.Operation object.
 * 
 * @class
 * @abstract
 * @constructor
 * @param {Integer} start Index where operation takes place
 * @param {Array} items Items being changed
 * @property {Integer} start Index where operation takes place
 * @property {Array} items Items being changed
 */
seq.Operation = function( start, items ) {
	this.start = start;
	this.items = items;
};

/* Methods */

seq.Operation.prototype.getStart = function() {
	return this.start;
};

seq.Operation.prototype.getEnd = function() {
	return this.start + this.items.length;
};

seq.Operation.prototype.getLength = function() {
	return this.items.length;
};

seq.Operation.prototype.getItems = function() {
	return this.items;
};

seq.Operation.prototype.compareRanges = function( operation ) {
	var a = this,
		b = operation,
		aLeft = this.start,
		bLeft = b.getStart(),
		aLength = this.items.length,
		bLength = b.getLength(),
		aRight = aLeft + aLength,
		bRight = bLeft + bLength;
	if ( aLeft === bLeft && aLength === bLength ) {
		// a is equal to b
		return '==';
	} else if ( aRight <= bLeft ) {
		// (a is left of b)
		return 'ab';
	} else if ( aLeft >= bRight ) {
		// (a is right of b)
		return 'ba';
	} if ( aLeft >= bLeft && aRight <= bRight ) {
		// (a is inside b)
		return 'bab';
	} else if ( bLeft >= aLeft && bRight <= aRight ) {
		// (b is inside a)
		return 'aba';
	} else if ( aRight >= bLeft && aRight <= bRight ) {
		// (a is overlapping and to the left of b)
		return 'abab';
	} else if ( aLeft >= bLeft && aLeft <= bRight ) {
		// (a is overlapping and to the right of b)
		return 'baba';
	}
};

seq.Operation.prototype.clone = function() {
	return new this.constructor( this.start, this.items.slice( 0 ) );
};

seq.Operation.prototype.move = function( distance ) {
	this.start += distance;
	return this;
};

seq.Operation.prototype.splice = function( start, length ) {
	this.items.splice( start, length );
	return this;
};

seq.Operation.prototype.trim = function( length ) {
	if ( length > 0 ) {
		// Trim left
		this.items = this.items.slice( length );
	} else if ( length < 0 ) {
		// Trim right
		this.items = this.items.slice( 0, this.items.length + length );
	}
	return this;
};
