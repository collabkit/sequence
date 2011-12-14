/**
 * Creates a seq.Sequence object.
 * 
 * @class
 * @constructor
 * @param {Array} items Items in sequence
 * @property {Array} items Items in sequence
 */
seq.Sequence = function( items ) {
	this.items = items || [];
};

/* Methods */

/**
 * Gets a SHA1 hash of the data in the sequence.
 * 
 * @method
 * @returns {String} SHA1 hash
 */
seq.Sequence.prototype.getHash = function() {
	return Crypto.SHA1( JSON.stringify( this.items ) );
};

/**
 * Gets items in the sequence.
 * 
 * This method returns a slice of all items, as to avoid changes to the order of returned array
 * affecting the sequence.
 * 
 * @method
 * @returns {Array} Items in sequence
 */
seq.Sequence.prototype.getItems = function() {
	return this.items.slice( 0 );
};

/**
 * Gets items in the sequence within a range.
 * 
 * @method
 * @param {Integer} [from=0] Index of first item in range, if not provided range will begin at 0
 * @param {Integer} [to] Index after last item in range, if not provided all items will be included
 * @returns {Array} Items in range
 */
seq.Sequence.prototype.sliceItems = function( from, to ) {
	return this.items.slice( from || 0, to );
};

/**
 * Gets an item in the sequence at an index.
 * 
 * @method
 * @returns {Mixed} First item
 */
seq.Sequence.prototype.getItem = function( index ) {
	return this.items[index];
};

/**
 * Gets the first item in the sequence.
 * 
 * @method
 * @returns {Mixed} First item
 */
seq.Sequence.prototype.getFirstItem = function() {
	return this.items[0];
};

/**
 * Gets the last item in the sequence.
 * 
 * @method
 * @returns {Mixed} Last item
 */
seq.Sequence.prototype.getLastItem = function() {
	return this.items[this.items.length - 1];
};

/**
 * Gets the number of items in the sequence.
 * 
 * @method
 * @returns {Integer} Number of items
 */
seq.Sequence.prototype.countItems = function() {
	return this.items.length;
};

/**
 * Inserts an item to the end of the sequence.
 * 
 * @method
 * @param {Mixed} item Item to insert
 * @returns {Integer} Length of sequence after inserting item
 */
seq.Sequence.prototype.pushItem = function( item ) {
	return this.items.push( item );
};

/**
 * Inserts an item to the beginning of the sequence.
 * 
 * @method
 * @param {Mixed} item Item to insert
 * @returns {Integer} Length of sequence after inserting item
 */
seq.Sequence.prototype.unshiftItem = function( item ) {
	return this.items.unshift( item );
};

/**
 * Removes an item from the end of the sequence.
 * 
 * @method
 * @returns {Mixed} Item that was removed
 */
seq.Sequence.prototype.popItem = function() {
	return this.items.pop();
};

/**
 * Removes an item from the beginning of the sequence.
 * 
 * @method
 * @returns {Mixed} Item that was removed
 */
seq.Sequence.prototype.shiftItem = function() {
	return this.items.shift();
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
seq.Sequence.prototype.spliceItems = function() {
	return this.items.splice.apply( this.items, Array.prototype.slice.call( arguments ) );
};

/**
 * Reverses the order of items in the sequence.
 * 
 * @method
 * @returns {seq.ObservableSequence} This object 
 */
seq.Sequence.prototype.reverseItems = function() {
	return this.items.reverse();
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
seq.Sequence.prototype.sortItems = function( compareFunction ) {
	return this.items.sort( compareFunction );
};

/**
 * Swaps two items in the sequence.
 * 
 * @method
 * @param {Integer} x Index of first item to swap
 * @param {Integer} y Index of second item to swap
 * @returns {seq.ObservableSequence} This object 
 */
seq.Sequence.prototype.swapItems = function( a, b ) {
	this.items[b] = this.items.splice( a, 1, this.items[b] )[0];
	return this.items;
};

/**
 * Checks if an operation is valid.
 * 
 * This method ensures that insert and remove operations are within range. Remove operations are
 * also inspected to insure the data they would remove is identical to the data in the sequence.
 * 
 * @method
 * @param {seq.Operation} op Operation to validate
 * @returns {Boolean} Operation is valid
 */
seq.Sequence.prototype.isOperationValid = function( op ) {
	var start = op.getStart(),
		items = op.getItems(),
		end = start + items.length;
	if ( typeof start === 'number' && start >= 0 && start <= this.items.length ) {
		if ( op instanceof seq.InsertOperation ) {
			return true;
		} else if ( op instanceof seq.RemoveOperation ) {
			return JSON.stringify( this.items.slice( start, end ) ) === JSON.stringify( items );
		}
	}
	return false;
};

/**
 * Applies an operation to the sequence.
 * 
 * This method only supports {seq.InsertOperation} and {seq.RemoveOperation} operations.
 * 
 * @method
 * @param {seq.Operation} op Operation to apply
 * @returns {seq.ObservableSequence} This object
 * @throws {Error} If operation type is not supported
 */
seq.Sequence.prototype.applyOperation = function( op ) {
	if ( op instanceof seq.InsertOperation ) {
		this.spliceItems.apply( this, [op.getStart(), 0].concat( op.getItems() ) );
	} else if ( op instanceof seq.RemoveOperation ) {
		this.spliceItems( op.getStart(), op.getLength() );
	} else {
		throw new Error( 'Invalid operation type error. Operation is not supported' );
	}
	return this;
};
