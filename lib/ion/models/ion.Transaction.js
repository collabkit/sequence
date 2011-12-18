/**
 * Creates a ion.Transaction object.
 * 
 * @class
 * @constructor
 * @param {Array} [components] Steps involved in completing the operation
 */
ion.Transaction = function( operations ) {
	// Properties
	this.operations = operations || [];
};

/* Methods */

ion.Transaction.prototype.invert = function() {
	//
};

ion.Transaction.prototype.compose = function( other ) {
	//
};

ion.Transaction.prototype.transform = function( other ) {
	//
};

ion.Transaction.prototype.commit = function( doc, check ) {
	_.invoke( this.operations, 'commit', doc, check );
};
