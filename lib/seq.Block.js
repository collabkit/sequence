/**
 * Creates a seq.Block object.
 * 
 * @class
 * @constructor
 */
seq.Block = function( id, text ) {
	this.id = id;
	this.text = text;
	this.$ = $( '<div class="seq-block"></div>' )
		.attr( 'seq-id', this.id )
		.text( this.text );
};

/* Static Methods */

seq.Block.newFromPlainObject = function( obj ) {
	return new seq.Block( obj.id, obj.text );
};

/* Methods */

seq.Block.prototype.disableAnimation = function() {
	this.$.removeClass( 'seq-block-animated' );
};

seq.Block.prototype.enableAnimation = function() {
	this.$.addClass( 'seq-block-animated' );
};

seq.Block.prototype.isAnimationEnabled = function() {
	return this.$.hasClass( 'seq-block-animated' );
};

seq.Block.prototype.getId = function() {
	return this.id;
};

seq.Block.prototype.setId = function( id ) {
	this.id = id;
	this.$.attr( 'seq-id', this.id );
};

seq.Block.prototype.getText = function() {
	return this.text;
};

seq.Block.prototype.setText = function( text ) {
	this.text = text;
	this.$.text( this.text );
};
