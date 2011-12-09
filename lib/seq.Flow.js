/**
 * Creates a seq.Flow object.
 * 
 * @class
 * @constructor
 */
seq.Flow = function( $container, blocks, spacing ) {
	// Properties
	this.$ = $container;
	this.blocks = [];
	this.spacing = spacing || 0;
	this.autoLayout = true;

	// Initialization
	if ( blocks.length ) {
		_.each( blocks, _.bind( this.push, this ) );
		this.layout();
	}
	this.enableAnimation();
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

seq.Flow.prototype.push = function( block ) {
	// Auto-convert
	if ( $.isPlainObject( block ) ) {
		block = seq.Block.newFromPlainObject( block );
	}
	// Add
	this.blocks.push( block );
	block.disableAnimation();
	this.$.append( block.$ );
	// Reflow
	if ( this.autoLayout ) {
		_.defer( _.bind( this.layout, this ) );
	}
	return this.blocks.length;
};

seq.Flow.prototype.unshift = function( block ) {
	// Auto-convert
	if ( $.isPlainObject( block ) ) {
		block = seq.Block.newFromPlainObject( block );
	}
	// Add
	this.blocks.unshift( block );
	block.disableAnimation();
	this.$.prepend( block.$ );
	// Reflow
	if ( this.autoLayout ) {
		_.defer( _.bind( this.layout, this ) );
	}
	return this.blocks.length;
};

seq.Flow.prototype.pop = function() {
	// Remove
	var popped = this.blocks.pop();
	this.$.children().last().detach();
	// Reflow
	if ( this.autoLayout ) {
		_.defer( _.bind( this.layout, this ) );
	}
	return popped;
};

seq.Flow.prototype.shift = function() {
	// Remove
	var shifted = this.blocks.shift();
	this.$.children().first().detach();
	// Reflow
	if ( this.autoLayout ) {
		_.defer( _.bind( this.layout, this ) );
	}
	return shifted;
};

seq.Flow.prototype.splice = function( index, remove ) {
	var args = Array.prototype.splice.call( arguments, 0 ),
		insert = args.slice( 2 );
	if ( insert.length ) {
		// Auto-convert
		var $insert = $();
		insert = _.map( insert, function( block ) {
			if ( $.isPlainObject( block ) ) {
				block = seq.Block.newFromPlainObject( block );
			}
			block.disableAnimation();
			$insert = $insert.add( block.$ );
			return block;
		} );
		// Insert
		if ( index ) {
			this.$.children().eq( index ).before( $insert );
		} else {
			this.$.prepend( $insert );
		}
	}
	// Remove/insert
	var removed = this.blocks.splice.apply( this.blocks, [index, remove].concat( insert ) );
	_.each( removed, function( block ) {
		block.$.detach();
	} );
	// Reflow
	if ( this.autoLayout ) {
		_.defer( _.bind( this.layout, this ) );
	}
	return removed;
};

seq.Flow.prototype.reverse = function() {
	// Reverse
	this.blocks.reverse();
	// Synchronize
	this.disableAnimation();
	this.$.append.apply( this.$, _.pluck( this.blocks, '$' ) );
	this.enableAnimation();
	// Reflow
	if ( this.autoLayout ) {
		_.defer( _.bind( this.layout, this ) );
	}
};

seq.Flow.prototype.sort = function( callback ) {
	// Reverse
	this.blocks.sort( callback );
	// Synchronize
	this.disableAnimation();
	this.$.append.apply( this.$, _.pluck( this.blocks, '$' ) );
	this.enableAnimation();
	// Reflow
	if ( this.autoLayout ) {
		_.defer( _.bind( this.layout, this ) );
	}
};

seq.Flow.prototype.layout = function() {
	var left = this.spacing;
	_.each( this.blocks, function( block ) {
		block.$.css( { 'left': left, 'top': this.spacing } );
		_.defer( function() {
			block.enableAnimation();
			block.$.addClass( 'seq-block-visible' );
		} );
		left += block.$.outerWidth() + this.spacing;
	}, this );
};
