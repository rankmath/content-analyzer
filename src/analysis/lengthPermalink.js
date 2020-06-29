/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import Analysis from '@root/Analysis'
import AnalysisResult from '@root/AnalysisResult'

class LengthPermalink extends Analysis {
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
			.setEmpty( i18n.__( 'URL unavailable. Add a short URL.', 'rank-math' ) )
			.setTooltip( i18n.__( 'Permalink should be at most 75 characters long.', 'rank-math' ) )
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
		const permalinkLength = paper.getUrl().length

		analysisResult
			.setScore( this.calculateScore( permalinkLength ) )
			.setText(
				i18n.sprintf(
					this.translateScore( analysisResult, i18n ),
					permalinkLength
				)
			)

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
		return paper.hasUrl()
	}

	/**
	 * Calculates the score based on the url length.
	 *
	 * @param {number} permalinkLength Length of Url to run the analysis on.
	 *
	 * @return {number} The calculated score.
	 */
	calculateScore( permalinkLength ) {
		return 75 < permalinkLength ? null : this.getScore()
	}

	/**
	 * Get analysis max score.
	 *
	 * @return {number} Max score an analysis has
	 */
	getScore() {
		return applyFilters( 'rankMath_analysis_permalinkLength_score', 4 )
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
			i18n.__( 'URL is %1$d characters long. Kudos!', 'rank-math' ) :
			i18n.__( 'URL is %1$d characters long. Consider shortening it.', 'rank-math' )
	}
}

export default LengthPermalink
