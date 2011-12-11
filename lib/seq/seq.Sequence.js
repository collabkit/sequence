/**
 * Creates a seq.Sequence object.
 * 
 * @class
 * @constructor
 */
seq.Sequence = function( items ) {
	this.items = items || [];
};

/* Methods */

seq.Sequence.prototype.getHash = function() {
	return Crypto.SHA1( JSON.stringify( this.items ) );
};
