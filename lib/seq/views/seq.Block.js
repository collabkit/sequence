/**
 * Creates a seq.Block object.
 * 
 * @class
 * @constructor
 * @param {String} id Block ID
 * @param {String} text Block text
 * @property {String} id Block ID
 * @property {String} text Block text
 * @property {jQuery} $ DOM element
 */
seq.Block = function( id, text ) {
	// Properties
	this.id = id;
	this.text = text;
	this.$ = $( '<div class="seq-block"></div>' );

	// DOM Changes
	this.$
		.attr( 'seq-id', this.id )
		.text( this.text );
};

/* Static Methods */

/**
 * Creates a block from a plain object.
 * 
 * @static
 * @method
 * @param {Object} obj Plain object
 * @param {String} obj.id Block ID
 * @param {String} obj.text Block text
 */
seq.Block.newFromPlainObject = function( obj ) {
	return new seq.Block( obj.id, obj.text );
};

/* Methods */

/**
 * Diables animation.
 * 
 * @method
 */
seq.Block.prototype.disableAnimation= function() {
	this.$.removeClass( 'seq-block-animated' );
};

/**
 * Enables animation.
 * 
 * @method
 */
seq.Block.prototype.enableAnimation= function() {
	this.$.addClass( 'seq-block-animated' );
};

/**
 * Checks if animation is enabled.
 * 
 * @method
 * @returns {Boolean} Animation is enabled
 */
seq.Block.prototype.isAnimationEnabled= function() {
	return this.$.hasClass( 'seq-block-animated' );
};

/**
 * Gets the block ID.
 * 
 * @method
 * @returns {String} Block ID
 */
seq.Block.prototype.getId= function() {
	return this.id;
};

/**
 * Sets the block ID.
 * 
 * @method
 * @param {String} id Block ID
 */
seq.Block.prototype.setId= function( id ) {
	this.id = id;
	this.$.attr( 'seq-id', this.id );
};

/**
 * Gets the block text.
 * 
 * @method
 * @returns {String} Block text
 */
seq.Block.prototype.getText= function() {
	return this.text;
};

/**
 * Sets the block text.
 * 
 * @method
 * @param {String} text Block text
 */
seq.Block.prototype.setText= function( text ) {
	this.text = text;
	this.$.text( this.text );
};
