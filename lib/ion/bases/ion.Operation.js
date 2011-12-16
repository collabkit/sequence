/**
 * Creates a ion.Operation object.
 * 
 * @class
 * @constructor
 * @param {Array} path Path of keys and indexes to data
 * @param {Array} [components] Steps involved in completing the operation
 */
ion.Operation = function( path, components ) {
	// Properties
	this.path = path;
	this.components = components || [];
};

/* Methods */

/**
 * Gets document path.
 * 
 * @method
 * @returns {Array} Document path of operation
 */
ion.Operation.prototype.getPath = function() {
	return this.path;
};

/**
 * Gets operation components.
 * 
 * @method
 * @returns {Array} Components of operation
 */
ion.Operation.prototype.getComponents = function() {
	return this.components;
};

/**
 * Gets a copy of this operation.
 * 
 * @method
 * @param {Function} [callback] Function to pass to a mapping algorithm which operates on components
 * @returns {ion.Operation} Copy of this operation
 */
ion.Operation.prototype.clone = function( callback ) {
	if ( typeof callback === 'function' ) {
		return this.constructor( this.path.slice( 0 ), _.map( this.components, callback ) );
	}
	return this.constructor( this.path.slice( 0 ), this.components.slice( 0 ) );
};