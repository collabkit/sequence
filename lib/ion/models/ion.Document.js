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
	this.version = null;
};

/* Methods */

/**
 * Gets a portion of the document's data from a path.
 * 
 * @method
 * @param {Array} [path] List of keys and indexes 
 * @param {Integer} [steps] Limit of max steps if positive, reduction of max steps if negative
 * @returns {Mixed} Portion of the document accessible through the path
 */
ion.Document.prototype.traverse = function( path, steps ) {
	return _.traverse( this.data, path, steps );
};

/**
 * Gets unique version ID based on the document's data.
 * 
 * Getting the version automatically caches the value. To regenerate a version ID after making a
 * change to the document's data, you must call {ion.Document.prototype.touch}.
 * 
 * @method
 * @returns {String} SHA1 hash of document data
 */
ion.Document.prototype.getVersion = function() {
	if ( this.version === null ) {
		this.version = Crypto.SHA1( JSON.stringify( this.data ) );
	}
	return this.version;
};

/**
 * Invalidates any cached information based on the document's data.
 * 
 * Touching a document does not by itself change the version ID.
 * 
 * @method
 */
ion.Document.prototype.touch = function() {
	this.version = null;
};
