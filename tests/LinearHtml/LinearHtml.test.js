// Example
//html = '<p style="color:red">a<b>b</b>c</p>';
data = [
	{ element: 'paragraph', attr: { 'html/style': 'color:red;' } },
	{ meta: 'comment', content: 'hello there' },
	'a',
	['b', { format: 'textStyle/bold' }],
	'c',
	{ element: '/paragraph' }
];

module( 'LinearHtml' );

test( 'constructor', 1, function ( assert ) {

	var lh = new LinearHtml( data );

	assert.deepEqual( lh.serialize(), data, 'Serialized data is identical to original data' );

} );
