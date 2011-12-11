/**
 * Creates a seq.Flow object.
 * 
 * @class
 * @constructor
 */
seq.Flow = function( $container, sequence, options ) {
	// Properties
	this.$ = $container;
	this.sequence = sequence || new seq.Sequence();
	this.options = _.defaults( options || {}, seq.Flow.defaultOptions );
	this.autoLayout = true;

	// Events
	this.sequence.on( 'insertItems', _.bind( this.onInsertItems, this ) );
	this.sequence.on( 'removeItems', _.bind( this.onRemoveItems, this ) );

	var _this = this,
		throttledLayout = _.throttle( function() {
			_this.layout();
		}, 10 );
	this.sequence.on( 'insertItems', throttledLayout );
	this.sequence.on( 'removeItems', throttledLayout );

	// Initialization
	if ( this.sequence.countItems() ) {
		this.onInsertItems( 0, this.sequence.getItems() );
		this.layout();
	}
	this.enableAnimation();
};

/* Static Members */

seq.Flow.defaultOptions = {
	'spacing': 0
};

/* Methods */

seq.Flow.prototype.disableLayout = function() {
	this.autoLayout = true;
};

seq.Flow.prototype.enableLayout = function() {
	this.autoLayout = false;
};

seq.Flow.prototype.isLayoutEnabled = function() {
	return this.autoLayout;
};

seq.Flow.prototype.disableAnimation = function() {
	this.$.removeClass( 'seq-flow-animated' );
};

seq.Flow.prototype.enableAnimation = function() {
	this.$.addClass( 'seq-flow-animated' );
};

seq.Flow.prototype.isAnimationEnabled = function() {
	return this.$.hasClass( 'seq-flow-animated' );
};

seq.Flow.prototype.onInsertItems = function( index, items ) {
	var $children = this.$.children(),
		$items = $();
	_.each( items, function( item ) {
		item.disableAnimation();
		$items = $items.add( item.$ );
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

seq.Flow.prototype.onRemoveItems = function( index, items ) {
	_.invoke( _.pluck( items, '$' ), 'detach' );
};

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
