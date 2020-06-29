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

class KeywordInTitle extends Analysis {
	/**
	 * Create new analysis result instance.
	 *
	 * @param {Jed}   i18n  The i18n-object used for parsing translations.
	 * @param {Paper} paper The paper to run this assessment on.
	 *
	 * @return {AnalysisResult} New instance.
	 */
	newResult( i18n, paper ) {
		return new AnalysisResult()
			.setMaxScore( this.getScore( paper.getShortLocale() ) )
			.setEmpty( i18n.__( 'Add Focus Keyword to the SEO title.', 'rank-math' ) )
			.setTooltip( i18n.__( 'Make sure the focus keyword appears in the SEO post title too.', 'rank-math' ) )
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
		const analysisResult = this.newResult( i18n, paper )
		const containKeyword = includes( paper.getLower( 'title' ), paper.getLower( 'keyword' ) )

		analysisResult
			.setScore( this.calculateScore( containKeyword, paper ) )
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
		return paper.hasKeyword() && paper.hasTitle()
	}

	/**
	 * Calculates the score based on the url length.
	 *
	 * @param {boolean} hasKeyword Title has number or not.
	 * @param {Paper}   paper      The paper to use for the assessment.
	 *
	 * @return {number} The calculated score.
	 */
	calculateScore( hasKeyword, paper ) {
		return hasKeyword ? this.getScore( paper.getShortLocale() ) : null
	}

	/**
	 * Get analysis max score.
	 *
	 * @param {string} locale The paper locale.
	 *
	 * @return {number} Max score an analysis has
	 */
	getScore( locale ) {
		const score = 'en' === locale ? 36 : 38
		return applyFilters( 'rankMath_analysis_keywordInTitle_score', score )
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
			i18n.__( 'Hurray! You\'re using Focus Keyword in the SEO Title.', 'rank-math' ) :
			i18n.__( 'Focus Keyword does not appear in the SEO title.', 'rank-math' )
	}
}

export default KeywordInTitle
