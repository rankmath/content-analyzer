/**
 * External dependencies
 */
import Sentiment from 'sentiment'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import Analysis from '@root/Analysis'
import AnalysisResult from '@root/AnalysisResult'
import sentimentWords from '@config/sentimentWords'

class TitleSentiment extends Analysis {
	/**
	 * Create new analysis result instance.
	 *
	 * @param {Jed}   i18n  The i18n-object used for parsing translations.
	 * @param {Paper} paper The paper to run this assessment on.
	 *
	 * @return {AnalysisResult} New instance.
	 */
	newResult( i18n, paper ) {
		return 'en' !== paper.getShortLocale() ? null : new AnalysisResult()
			.setMaxScore( this.getScore() )
			.setEmpty( i18n.__( 'Titles with positive or negative sentiment work best for higher CTR.', 'rank-math' ) )
			.setTooltip( i18n.__( 'Headlines with a strong emotional sentiment (positive or negative) tend to receive more clicks.', 'rank-math' ) )
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
		const sentiment = new Sentiment
		const sentimentScore = sentiment.analyze( paper.getLower( 'title' ), sentimentWords ).score

		analysisResult
			.setScore( this.calculateScore( sentimentScore ) )
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
		return 'en' === paper.getShortLocale() && paper.hasTitle()
	}

	/**
	 * Calculates the score based on the sentiment score.
	 *
	 * @param {boolean} sentimentScore Sentiment score.
	 *
	 * @return {number} The calculated score.
	 */
	calculateScore( sentimentScore ) {
		return 0 !== sentimentScore ? this.getScore() : null
	}

	/**
	 * Get analysis max score.
	 *
	 * @return {number} Max score an analysis has
	 */
	getScore() {
		return applyFilters( 'rankMath_analysis_titleSentiment_score', 1 )
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
			i18n.__( 'Your title has a positive or a negative sentiment.', 'rank-math' ) :
			i18n.sprintf(
				i18n.__( 'Your title doesn\'t contain a %1$s word.', 'rank-math' ),
				'<a href="https://rankmath.com/kb/score-100-in-tests/#sentiment-in-a-title" target="_blank">positive or a negative sentiment</a>'
			)
	}
}

export default TitleSentiment
