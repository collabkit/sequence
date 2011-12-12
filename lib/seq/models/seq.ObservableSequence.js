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

seq.ObservableSequence.prototype.pushItem = function( item ) {
	if ( item ) {
		this.items.push( item );
		this.notify( 'insertItems', this.items.length - 1, [item] );
	}
	return this.items.length;
};

seq.ObservableSequence.prototype.unshiftItem = function( item ) {
	if ( item ) {
		this.items.unshift( item );
		this.notify( 'insertItems', 0, [item] );
	}
	return this.items.length;
};

seq.ObservableSequence.prototype.popItem = function() {
	if ( this.items.length ) {
		var item = this.items.pop();
		this.notify( 'removeItems', this.items.length, [item] );
		return item;
	}
};

seq.ObservableSequence.prototype.shiftItem = function() {
	if ( this.items.length ) {
		var item = this.items.shift();
		this.notify( 'removeItems', 0, [item] );
		return item;
	}
};

seq.ObservableSequence.prototype.spliceItems = function( index ) {
	var args = Array.prototype.slice.call( arguments ),
		removed = this.items.splice.apply( this.items, args );
	if ( removed.length ) {
		this.notify( 'removeItems', index, removed );
	}
	if ( args.length > 2 ) {
		this.notify( 'insertItems', index, args.slice( 2 ) );
	}
	return removed;
};

seq.ObservableSequence.prototype.reverseItems = function() {
	if ( this.items.length ) {
		var unreversed = this.items.slice();
		this.items.reverse();
		this.notify( 'removeItems', 0, unreversed );
		this.notify( 'insertItems', 0, this.items );
	}
	return this.items;
};

seq.ObservableSequence.prototype.sortItems = function( compareFunction ) {
	if ( this.items.length ) {
		var unsorted = this.items.slice();
		this.items.sort( compareFunction );
		this.notify( 'removeItems', 0, unsorted );
		this.notify( 'insertItems', 0, this.items );
	}
	return this.items;
};

seq.Sequence.prototype.swapItems = function( a, b ) {
	if ( this.items.length > 1 ) {
		this.items[b] = this.items.splice( a, 1, this.items[b] )[0];
		this.notify( 'removeItems', a, [this.items[b]] );
		this.notify( 'insertItems', b, [this.items[b]] );
	}
	return this.items;
};

/* Extension */

seq.extendClass( seq.ObservableSequence, seq.Observable );
seq.extendClass( seq.ObservableSequence, seq.Sequence );
