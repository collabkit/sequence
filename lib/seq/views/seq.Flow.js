/**
 * Creates a seq.Flow object.
 * 
 * @class
 * @constructor
 * @param {jQuery} $container DOM element to render into
 * @param {seq.Sequence} sequence Sequence to render
 * @param {Object} options Rendering options
 * @param {Integer} options.spacing Spacing between blocks (in pixels)
 * @property {jQuery} $ DOM element
 * @property {seq.Sequence} sequence Flow sequence
 * @property {Object} options Rendering options
 * @property {Integer} options.spacing Spacing between blocks (in pixels)
 */
seq.Flow = function( $container, sequence, options ) {
	// Properties
	this.$ = $container;
	this.sequence = sequence || new seq.Sequence();
	this.options = _.defaults( options || {}, seq.Flow.defaultOptions );

	// Events
	this.sequence
		.on( 'insertItems', _.bind( this.onInsertItems, this ) )
		.on( 'removeItems', _.bind( this.onRemoveItems, this ) )
		.on( 'insertItems removeItems', _.debounce( _.bind( this.layout, this ), 10 ) );

	// Initialization
	if ( this.sequence.countItems() ) {
		this.onInsertItems( 0, this.sequence.getItems() );
		this.layout();
	}
	this.enableAnimation();
};

/* Static Members */

/**
 * Default options.
 * 
 * @static
 * @member
 */
seq.Flow.defaultOptions = {
	'spacing': 0
};

/* Methods */

/**
 * Diables animation.
 * 
 * @method
 */
seq.Flow.prototype.disableAnimation = function() {
	this.$.removeClass( 'seq-flow-animated' );
};

/**
 * Enables animation.
 * 
 * @method
 */
seq.Flow.prototype.enableAnimation = function() {
	this.$.addClass( 'seq-flow-animated' );
};

/**
 * Checks if animation is enabled.
 * 
 * @method
 * @returns {Boolean} Animation is enabled
 */
seq.Flow.prototype.isAnimationEnabled = function() {
	return this.$.hasClass( 'seq-flow-animated' );
};

/**
 * Updates DOM after items have been removed.
 * 
 * @method
 * @param {Integer} index Index where insertion began
 * @param {seq.Block[]} items Blocks that were inserted
 */
seq.Flow.prototype.onInsertItems = function( index, items ) {
	var $children = this.$.children(),
		$items = $();
	_.each( items, function( item ) {
		item.disableAnimation();
		$items = $items.add( item.$.clearQueue() );
	} );
	if ( $children.length ) {
		if ( index >= $children.length ) {
			this.$.append( $items );
		} else if ( index ) {
			this.$.children().eq( index ).before( $items );
		} else {
			this.$.prepend( $items );
		}
	} else {
		this.$.append( $items );
	}
};

/**
 * Updates DOM after items have been removed.
 * 
 * @method
 * @param {Integer} index Index where removal began
 * @param {seq.Block[]} items Blocks that were removed
 */
seq.Flow.prototype.onRemoveItems = function( index, items ) {
	_.each( items, function( item ) {
		item.$.removeClass( 'seq-block-visible' ).delay( 300 ).detach();
	} );
};

/**
 * Sets the positions of blocks and begins animation.
 * 
 * @method
 */
seq.Flow.prototype.layout = function() {
	var spacing = this.options.spacing;
	var left = spacing;
	_.each( this.sequence.getItems(), function( item ) {
		item.$.css( { 'left': left, 'top': spacing } );
		_.defer( function() {
			item.enableAnimation();
			item.$.addClass( 'seq-block-visible' );
		} );
		left += item.$.outerWidth() + spacing;
	}, this );
};
