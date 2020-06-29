/**
 * External dependencies
 */
import { forEach, inRange } from 'lodash'

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

class LengthContent extends Analysis {
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
			.setEmpty(
				this.getFilteredText( 'emptyContent', i18n )
			)
			.setTooltip( this.getFilteredText( 'tooltipText', i18n ) )
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
		const getWordCount = researcher.getResearch( 'wordCount' )
		const wordCount = getWordCount( paper.getTextLower() )
		if ( false === wordCount || 0 === wordCount ) {
			return analysisResult
		}

		analysisResult
			.setScore( this.calculateScore( wordCount ) )
			.setText(
				i18n.sprintf(
					this.translateScore( analysisResult, i18n ),
					wordCount
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
	 * Calculates the score based on the word count.
	 *
	 * @param {number} wordCount Word count.
	 *
	 * @return {number} The calculated score.
	 */
	calculateScore( wordCount ) {
		const boundaries = this.getBoundaries()
		let current = 100000
		let located = false

		forEach( boundaries, ( boundary ) => {
			if ( inRange( wordCount, boundary.boundary, current ) ) {
				located = boundary
			}

			current = boundary.boundary + 1
		} )

		return false !== located ? located.score : 0
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
			this.getFilteredText( 'hasScore', i18n ) :
			this.getFilteredText( 'failed', i18n )
	}

	/**
	 * Get analysis max score.
	 *
	 * @return {number} Max score an analysis has
	 */
	getScore() {
		return this.getBoundaries().recommended.score
	}

	getBoundaries() {
		return applyFilters(
			'rankMath_analysis_contentLength_boundaries',
			{
				recommended: {
					boundary: 2500,
					score: 8,
				},
				belowRecommended: {
					boundary: 2000,
					score: 5,
				},
				medium: {
					boundary: 1500,
					score: 4,
				},
				belowMedium: {
					boundary: 1000,
					score: 3,
				},
				low: {
					boundary: 600,
					score: 2,
				},
			}
		)
	}

	getFilteredText( what, i18n ) {
		const texts = applyFilters( 'rankMath_analysis_contentLength', {
			hasScore: i18n.__( 'Content is %1$d words long. Good job!', 'rank-math' ),
			failed: i18n.__( 'Content is %1$d words long. Consider using at least 600 words.', 'rank-math' ),
			emptyContent: i18n.sprintf(
				i18n.__( 'Content should be %1$s long.', 'rank-math' ),
				'<a href="' + links.contentLength + '" target="_blank">600-2500 words</a>'
			),
			tooltipText: i18n.__( 'Minimum recommended content length should be 600 words.', 'rank-math' ),
		} )

		return texts[ what ]
	}
}

export default LengthContent
