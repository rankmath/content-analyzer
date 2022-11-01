import stripStyle from '../../src/helpers/stripStyles'

const CONTENT = `
<h1>Hello World</h1>

<p>This is a paragraph</p>

<!-- One line CSS -->
<style> body { color: red; } p { color: blue; } </style>

<!-- Multiline line CSS -->
<style>
    body {
        color: red;
    }
    p {
        color: blue;
    }
</style>

<style>/* code for hiding things if needed */ .test_tag { display: none; } .test_tag2 { display: none; }</style>

<style>
    .body {
        color: red;
    }
</style>

<style>
    body {
        color: red;
    }
</style>

<form>
    <input type="text" name="test" value="test" />
    <input type="submit" value="Submit" />
</form>

<p>Another content goes here..</p>
`;

const EXPECTED = `
<h1>Hello World</h1>

<p>This is a paragraph</p>

<!-- One line CSS -->


<!-- Multiline line CSS -->








<form>
    <input type="text" name="test" value="test" />
    <input type="submit" value="Submit" />
</form>

<p>Another content goes here..</p>
`;

test( 'Exclude <style> tags from the content.', () => {
    expect( EXPECTED ).toBe( stripStyle( CONTENT ) )    
})
