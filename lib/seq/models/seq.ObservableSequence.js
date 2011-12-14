/**
 * Creates a seq.ObservableSequence object.
 * 
 * @class
 * @constructor
 * @extends {seq.Observable}
 * @extends {seq.Sequence}
 */
seq.ObservableSequence = function( items ) {
	// Extension
	seq.Observable.call( this );
	seq.Sequence.call( this, items );
};

/* Methods */

/**
 * Inserts an item to the end of the sequence.
 * 
 * @method
 * @param {Mixed} item Item to insert
 * @returns {Integer} Length of sequence after inserting item
 */
seq.ObservableSequence.prototype.pushItem = function( item ) {
	if ( item ) {
		this.items.push( item );
		this.notify( 'insertItems', this.items.length - 1, [item] );
	}
	return this.items.length;
};

/**
 * Inserts an item to the beginning of the sequence.
 * 
 * @method
 * @param {Mixed} item Item to insert
 * @returns {Integer} Length of sequence after inserting item
 */
seq.ObservableSequence.prototype.unshiftItem = function( item ) {
	if ( item ) {
		this.items.unshift( item );
		this.notify( 'insertItems', 0, [item] );
	}
	return this.items.length;
};

/**
 * Removes an item from the end of the sequence.
 * 
 * @method
 * @returns {Mixed} Item that was removed
 */
seq.ObservableSequence.prototype.popItem = function() {
	if ( this.items.length ) {
		var item = this.items.pop();
		this.notify( 'removeItems', this.items.length, [item] );
		return item;
	}
};

/**
 * Removes an item from the beginning of the sequence.
 * 
 * @method
 * @returns {Mixed} Item that was removed
 */
seq.ObservableSequence.prototype.shiftItem = function() {
	if ( this.items.length ) {
		var item = this.items.shift();
		this.notify( 'removeItems', 0, [item] );
		return item;
	}
};

/**
 * Removes and inserts items in the sequence at an index.
 * 
 * @method
 * @param {Integer} start Index to remove and insert at
 * @param {Integer} howMany Number of items to remove
 * @param {Mixed} [...] Items to insert
 * @returns {Mixed[]} Items that were removed
 */
seq.ObservableSequence.prototype.spliceItems = function( start ) {
	var args = Array.prototype.slice.call( arguments ),
		removed = this.items.splice.apply( this.items, args );
	if ( removed.length ) {
		this.notify( 'removeItems', start, removed );
	}
	if ( args.length > 2 ) {
		this.notify( 'insertItems', start, args.slice( 2 ) );
	}
	return removed;
};

/**
 * Reverses the order of items in the sequence.
 * 
 * @method
 * @returns {seq.ObservableSequence} This object 
 */
seq.ObservableSequence.prototype.reverseItems = function() {
	if ( this.items.length ) {
		var unreversed = this.items.slice();
		this.items.reverse();
		this.notify( 'removeItems', 0, unreversed );
		this.notify( 'insertItems', 0, this.items );
	}
	return this;
};

/**
 * Changes the order of items in the sequence using a callback function.
 * 
 * @method
 * @param {Function} compareFunction Function to call when comparing items for order; function is
 * called with two arguments (a and b), each an item to be compared, the function should return -1
 * if a should come before b, 0 if a and b are equal, and 1 if a should come after b
 * @returns {seq.ObservableSequence} This object 
 */
seq.ObservableSequence.prototype.sortItems = function( compareFunction ) {
	if ( this.items.length ) {
		var unsorted = this.items.slice();
		this.items.sort( compareFunction );
		this.notify( 'removeItems', 0, unsorted );
		this.notify( 'insertItems', 0, this.items );
	}
	return this;
};

/**
 * Swaps two items in the sequence.
 * 
 * @method
 * @param {Integer} x Index of first item to swap
 * @param {Integer} y Index of second item to swap
 * @returns {seq.ObservableSequence} This object 
 */
seq.Sequence.prototype.swapItems = function( x, y ) {
	if ( this.items.length > 1 ) {
		this.items[y] = this.items.splice( x, 1, this.items[y] )[0];
		this.notify( 'removeItems', x, [this.items[y]] );
		this.notify( 'insertItems', y, [this.items[y]] );
	}
	return this;
};

/* Extension */

seq.extendClass( seq.ObservableSequence, seq.Observable );
seq.extendClass( seq.ObservableSequence, seq.Sequence );
