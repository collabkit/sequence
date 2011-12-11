/**
 * Creates a seq.ObservableSequence object.
 * 
 * @class
 * @extends {seq.Observable}
 * @extends {seq.Sequence}
 * @constructor
 */
seq.ObservableSequence = function( items ) {
	// Extension
	seq.Observable.call( this );
	seq.Sequence.call( this, items );
};

/* Methods */

seq.Sequence.prototype.pushItem = function( item ) {
	this.notify( 'beforePush', item );
	this.items.push( item );
	this.notify( 'afterPush', item );
	return this.items.length;
};

seq.Sequence.prototype.popItem = function() {
	this.notify( 'beforePop' );
	var item = this.items.pop();
	this.notify( 'afterPop' );
	return item;
};

seq.Sequence.prototype.unshiftItem = function( item ) {
	this.notify( 'beforeUnshift', item );
	this.items.push( item );
	this.notify( 'afterUnshift', item );
	return this.items.length;
};

seq.Sequence.prototype.shiftItem = function() {
	this.notify( 'beforeShift' );
	var item = this.items.shift();
	this.notify( 'afterShift' );
	return item;
};

seq.Sequence.prototype.spliceItems = function() {
	var args = Array.prototype.slice.call( arguments );
	this.notify.apply( this, ['beforeSplice'].concat( args ) );
	var removed = this.items.splice.apply( this.items, args );
	this.notify.apply( this, ['afterSplice'].concat( args ) );
	return removed;
};

seq.Sequence.prototype.reverseItems = function() {
	this.notify( 'beforeReverse' );
	this.items.reverse();
	this.notify( 'afterReverse' );
	return this.items;
};

seq.Sequence.prototype.sortItems = function( compareFunction ) {
	this.notify( 'beforeSort', compareFunction );
	this.items.sort( compareFunction );
	this.notify( 'afterSort', compareFunction );
	return this.items;
};

/* Extension */

seq.extendClass( seq.ObservableSequence, seq.Observable );
seq.extendClass( seq.ObservableSequence, seq.Sequence );
