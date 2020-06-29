/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import Analysis from '@root/Analysis'
import AnalysisResult from '@root/AnalysisResult'

class LinksHasInternal extends Analysis {
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
			.setEmpty( i18n.__( 'Add internal links in your content.', 'rank-math' ) )
			.setTooltip( i18n.__( 'Internal links decrease your bounce rate and improve SEO.', 'rank-math' ) )
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
		/* eslint @wordpress/no-unused-vars-before-return: 0*/
		const analysisResult = this.newResult( i18n )
		const linkStatistics = researcher.getResearch( 'getLinkStats' )
		const statistics = linkStatistics( paper.getText() )

		if ( 0 === statistics.total ) {
			return analysisResult
		}

		analysisResult
			.setScore( this.calculateScore( 0 < statistics.internalTotal ) )
			.setText(
				i18n.sprintf(
					this.translateScore( analysisResult, i18n ),
					statistics.internalTotal
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
		return paper.hasText()
	}

	/**
	 * Calculates the score based on the url length.
	 *
	 * @param {boolean} hasInternal Title has number or not.
	 *
	 * @return {number} The calculated score.
	 */
	calculateScore( hasInternal ) {
		return hasInternal ? this.getScore() : null
	}

	/**
	 * Get analysis max score.
	 *
	 * @return {number} Max score an analysis has
	 */
	getScore() {
		return applyFilters( 'rankMath_analysis_linksHasInternal_score', 5 )
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
			i18n.__( 'You are linking to other resources on your website which is great.', 'rank-math' ) :
			i18n.__( 'We couldn\'t find any internal links in your content.', 'rank-math' )
	}
}

export default LinksHasInternal
