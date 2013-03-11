/**
 * Stream.
 *
 * @class
 *
 * @constructor
 * @param {Array} [data] Initial data
 */
ion.Stream = function ( data ) {
	// Properties
	this.data = data || [];
};

/* Static Methods */

/**
 * Create a stream from an object.
 *
 * @static
 * @method
 * @param {Object} obj Plain object
 * @param {Array} obj.data Data
 */
ion.Stream.newFromObject = function ( obj ) {
	return new ion.Stream( obj.data.slice( 0 ) );
};

/* Methods */

/**
 * Convert to a plain object.
 *
 * @method
 * @returns {Object} Plain object
 * @returns {Array} return.data Data
 */
ion.Stream.prototype.toObject = function () {
	return { data: this.data.slice( 0 ) };
};
