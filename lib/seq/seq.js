var seq = {};

seq.classInstances = [];

seq.extendClass = function( dst, src ) {
	var index = seq.classInstances.indexOf( src );
	_.defaults(
		dst.prototype,
		_.functions(
			index !== -1 ?
				seq.classInstances[index] :
				( seq.classInstances[seq.classInstances.length] = new src() )
		)
	);
};
