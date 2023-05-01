/**
 * Replace all content within the TOC block from the given string.
 *
 * @param {string} text The text to remove the TOC content for.
 *
 * @return {string} The text after TOC content is removed.
 */
export default ( text ) => text
	.replace( /<!-- wp:rank-math\/toc-block([\s\S]*?)<!-- \/wp:rank-math\/toc-block -->/g, '' )
