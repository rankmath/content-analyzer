// Replace all content within the TOC block
/**
 * Replaces punctuation characters from the given text string.
 *
 * @param {string} text The text to remove the punctuation characters for.
 *
 * @return {string} The sanitized text.
 */
export default ( text ) => text
	.replace( /<!-- wp:rank-math\/toc-block([\s\S]*?)<!-- \/wp:rank-math\/toc-block -->/g, '' )
