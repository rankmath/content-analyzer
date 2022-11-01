import stripScript from '../../src/helpers/stripScripts'

const CONTENT = `
<h1>Hello World</h1>

<p>This is a paragraph</p>

<!-- External (One line) JavaScript -->
<script type="application/javascript" src="http://rm.local/wp-includes/js/jquery/jquery.js?ver=3.6.0"></script>

<!-- Inline (One line) JavaScript -->
<script> console.log( 'One line' ); </script>

<!-- Multiline line JavaScript -->
<script type="text/javascript">
	document.body.className = document.body.className.replace('no-js','js');
</script>

<form>
    <input type="text" name="test" value="test" />
    <input type="submit" value="Submit" />
</form>

<!-- Multiline line JavaScript -->
<script>
    (function() {
        var request, b = document.body, c = 'className', cs = 'customize-support', rcs = new RegExp('(^|\\s+)(no-)?'+cs+'(\\s+|$)');
            request = true;
        b[c] = b[c].replace( rcs, ' ' );
        // The customizer requires postMessage and CORS (if the site is cross domain).
        b[c] += ( window.postMessage && request ? ' ' : ' no-' ) + cs;
    }());
</script>

<p>Another content goes here..</p>
`;

const EXPECTED = `
<h1>Hello World</h1>

<p>This is a paragraph</p>

<!-- External (One line) JavaScript -->


<!-- Inline (One line) JavaScript -->


<!-- Multiline line JavaScript -->


<form>
    <input type="text" name="test" value="test" />
    <input type="submit" value="Submit" />
</form>

<!-- Multiline line JavaScript -->


<p>Another content goes here..</p>
`;

test( 'Exclude <script> tags from the content.', () => {
    expect( EXPECTED ).toBe( stripScript( CONTENT ) )    
})
