/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import links from '@config/links'
import Analysis from '@root/Analysis'
import AnalysisResult from '@root/AnalysisResult'

class ContentHasTOC extends Analysis {
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
			.setEmpty( i18n.__( 'Use Table of Content to break-down your text.', 'rank-math' ) )
			.setTooltip( i18n.__( 'Table of Contents help break down content into smaller, digestible chunks. It makes reading easier which in turn results in better rankings.', 'rank-math' ) )
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
		const hasTOCPlugin = rankMath.assessor.hasTOCPlugin

		analysisResult
			.setScore( this.calculateScore( hasTOCPlugin ) )
			.setText( this.translateScore( analysisResult, i18n ) )

		return analysisResult
	}

	/**
	 * Checks whether paper meet analysis requirements.
	 *
	 * @return {boolean} True when requirements meet.
	 */
	isApplicable() {
		return rankMath.assessor.hasTOCPlugin
	}

	/**
	 * Calculates the score based on the url length.
	 *
	 * @param {boolean} hasTOCPlugin Title has number or not.
	 *
	 * @return {number} The calculated score.
	 */
	calculateScore( hasTOCPlugin ) {
		return hasTOCPlugin ? this.getScore() : null
	}

	/**
	 * Get analysis max score.
	 *
	 * @return {number} Max score an analysis has
	 */
	getScore() {
		return applyFilters( 'rankMath_analysis_contentHasTOC_score', 2 )
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
			i18n.sprintf(
				i18n.__( 'You seem to be using a %1$s to break-down your text.', 'rank-math' ),
				'<a href="' + links.tocKbLink + '" target="_blank">Table of Contents plugin</a>'
			) :
			i18n.sprintf(
				i18n.__( 'You don\'t seem to be using a %1$s.', 'rank-math' ),
				'<a href="' + links.tocKbLink + '" target="_blank">Table of Contents plugin</a>'
			)
	}
}

export default ContentHasTOC
