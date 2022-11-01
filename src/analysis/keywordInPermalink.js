/**
 * External dependencies
 */
import { includes } from 'lodash'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import Analysis from '@root/Analysis'
import AnalysisResult from '@root/AnalysisResult'

class KeywordInPermalink extends Analysis {
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
			.setEmpty( i18n.__( 'Use Focus Keyword in the URL.', 'rank-math' ) )
			.setTooltip( i18n.__( 'Include the focus keyword in the slug (permalink) of this post.', 'rank-math' ) )
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
		const permalink = paper.getUrl().replace( /[-_]/ig, '-' )
		const hasKeyword = includes( permalink, paper.getKeywordPermalink( researcher ) ) ||
			includes( permalink, paper.getPermalinkWithStopwords( researcher ) )

		analysisResult
			.setScore( this.calculateScore( hasKeyword ) )
			.setText( this.translateScore( analysisResult, i18n ) )

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
		return paper.hasKeyword() && paper.hasPermalink()
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
		return applyFilters( 'rankMath_analysis_keywordInPermalink_score', 5 )
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
			i18n.__( 'Focus Keyword used in the URL.', 'rank-math' ) :
			i18n.__( 'Focus Keyword not found in the URL.', 'rank-math' )
	}
}

export default KeywordInPermalink
