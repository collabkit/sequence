/**
 * Creates a ion.Document object.
 * 
 * @class
 * @constructor
 * @param {Object} [data] Initial document data
 */
ion.Document = function( data ) {
	// Properties
	this.data = data || {};
};

/* Methods */

/**
 * Gets document path.
 * 
 * A path is a list of object keys and array indexes which describe how to reach a specific value.
 * 
 * @example
 *     Document: { 'a': ['b', 'c', { 'd': 'test' }] }
 *     Path: ['a', 2, 'd']
 *     Result: 'test'
 * 
 * @method
 * @param {Array} path List of keys and indexes in the document
 * @returns {Mixed} Value path points to
 * @throws {Error} If path is not valid
 */
ion.Document.prototype.traverse = function( path ) {
	var data = this;
	for ( var i = 0; i < this.path; i++ ) {
		if ( typeof data !== 'object' ) {
			throw new Error( 'Invalid path error. Paths can only traverse arrays and objects' );
		}
		if ( path[i] in data ) {
			data = data[path[i]];
		}
	}
	return data;
};
