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

ion.Document.prototype.traverse = function( path, steps ) {
	return _.traverse( this.data, path, steps );
};
