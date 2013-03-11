/**
 * Document.
 *
 * @class
 *
 * @constructor
 * @param {Object.<string, ion.Stream>} [streams] Initial streams keyed by symbolic name
 */
ion.Document = function ( streams ) {
	// Properties
	this.streams = streams || {};
};

/* Static Methods */

/**
 * Create a document from an object.
 *
 * @static
 * @method
 * @param {Object} obj Plain object
 * @param {Object.<string, Array>} obj.streams Streams keyed by symbolic name
 */
ion.Document.newFromObject = function ( obj ) {
	var key,
		streams = {};

	for ( key in obj.streams ) {
		streams[key] = ion.Stream.newFromObject( obj.streams[key] );
	}

	return new ion.Document( streams );
};

/* Methods */

/**
 * Convert to a plain object.
 *
 * @method
 * @returns {Object} Plain object
 * @returns {Object.<string, Array>} return.streams Streams keyed by symbolic name
 */
ion.Document.prototype.toObject = function () {
	var key,
		streams = {};

	for ( key in this.streams ) {
		streams[key] = this.streams[key].toObject();
	}

	return { streams: streams };
};

/**
 * Add a stream.
 *
 * @method
 * @param {string} streamName Symbolic name of stream
 * @param {ion.Stream} stream Stream
 */
ion.Document.prototype.addStream = function ( streamName, stream ) {
	this.streams[streamName] = stream;
};

/**
 * Remove a stream.
 *
 * @method
 * @param {string} streamName Symbolic name of stream
 */
ion.Document.prototype.removeStream = function ( streamName ) {
	delete this.streams[streamName];
};

/**
 * Get a stream.
 *
 * @method
 * @param {string} streamName Symbolic name of stream
 * @returns {ion.Stream} Stream
 */
ion.Document.prototype.getStream = function ( streamName ) {
	return this.streams[streamName];
};

/**
 * Get names of streams.
 *
 * @method
 * @returns {string[]} Stream names
 */
ion.Document.prototype.getStreamNames = function () {
	return Object.keys( this.streams );
};
