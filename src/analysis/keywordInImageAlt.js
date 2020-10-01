/**
 * External dependencies
 */
import { includes, uniq } from 'lodash'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import Analysis from '@root/Analysis'
import AnalysisResult from '@root/AnalysisResult'

class KeywordInImageAlt extends Analysis {
	/**
	 * Create new analysis result instance.
	 *
	 * @param {Jed} i18n The i18n-object used for parsing translations.
	 *
	 * @return {AnalysisResult} New instance.
	 */
	newResult( i18n ) {
		return new AnalysisResult()
			.setMaxScore( this.getScore() )
			.setEmpty( i18n.__( 'Add an image with your Focus Keyword as alt text.', 'rank-math' ) )
			.setTooltip( i18n.__( 'It is recommended to add the focus keyword in the alt attribute of one or more images.', 'rank-math' ) )
	}

	/**
	 * Executes the assessment and return its result
	 *
	 * @param {Paper}      paper      The paper to run this assessment on.
	 * @param {Researcher} researcher The researcher used for the assessment.
	 * @param {Jed}        i18n       The i18n-object used for parsing translations.
	 *
	 * @return {AnalysisResult} an AnalysisResult with the score and the formatted text.
	 */
	getResult( paper, researcher, i18n ) {
		const analysisResult = this.newResult( i18n )
		const thumbnailAlt = paper.getLower( 'thumbnailAlt' )
		let keyword = paper.getLower( 'keyword' )

		if ( keyword === thumbnailAlt ) {
			analysisResult
				.setScore( this.calculateScore( true ) )
				.setText( this.translateScore( analysisResult, i18n ) )

			return analysisResult
		}

		// Remove duplicate words from keyword.
		keyword = uniq( keyword.split( ' ' ) ).join( ' ' )
		const keywordPattern = keyword.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ).replace( / /g, '.*' )

		let regex = new RegExp( '<img[^>]*alt=[\'"][^\'"]*' + keywordPattern + '[^\'"]*[\'"]', 'gi' )
		if ( null !== paper.getTextLower().match( regex ) || includes( paper.getLower( 'thumbnailAlt' ), keyword ) ) {
			analysisResult
				.setScore( this.calculateScore( true ) )
				.setText( this.translateScore( analysisResult, i18n ) )

			return analysisResult
		}

		regex = new RegExp( '\\[gallery( [^\\]]+?)?\\]', 'ig' )
		const hasGallery = null !== paper.getTextLower().match( regex )

		if ( hasGallery ) {
			analysisResult
				.setScore( this.calculateScore( true ) )
				.setText( i18n.__( 'We detected a gallery in your content & assuming that you added Focus Keyword in alt in at least one of the gallery images.', 'rank-math' ) )
		}

		return analysisResult
	}

	/**
	 * Checks whether paper meet analysis requirements.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @return {boolean} True when requirements meet.
	 */
	isApplicable( paper ) {
		return paper.hasKeyword() && ( paper.hasText() || paper.hasThumbnailAltText() )
	}

	/**
	 * Calculates the score based on the url length.
	 *
	 * @param {boolean} hasKeyword Title has number or not.
	 *
	 * @return {number} The calculated score.
	 */
	calculateScore( hasKeyword ) {
		return hasKeyword ? this.getScore() : null
	}

	/**
	 * Get analysis max score.
	 *
	 * @return {number} Max score an analysis has
	 */
	getScore() {
		return applyFilters( 'rankMath_analysis_keywordInImageAlt_score', 2 )
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {AnalysisResult} analysisResult AnalysisResult with the score and the formatted text.
	 * @param {Jed}            i18n           The i18n-object used for parsing translations.
	 *
	 * @return {string} The translated string.
	 */
	translateScore( analysisResult, i18n ) {
		return analysisResult.hasScore() ?
			i18n.__( 'Focus Keyword found in image alt attribute(s).', 'rank-math' ) :
			i18n.__( 'Focus Keyword not found in image alt attribute(s).', 'rank-math' )
	}
}

export default KeywordInImageAlt
