/**
 * External dependencies
 */
import jQuery from 'jquery'
import { isUndefined } from 'lodash'

/**
 * WordPress dependencies
 */
import { doAction } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import Analysis from '@root/Analysis'
import AnalysisResult from '@root/AnalysisResult'

class KeywordNotUsed extends Analysis {
	/**
	 * Hold checked keywords status
	 *
	 * @type {Object}
	 */
	keywordsChecked = {}

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
			.setEmpty( i18n.__( 'Set a Focus Keyword for this content.', 'rank-math' ) )
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
		const keyword = paper.getLower( 'keyword' ).trim()

		if ( ! isUndefined( this.keywordsChecked[ keyword ] ) ) {
			analysisResult.has = this.keywordsChecked[ keyword ]
			analysisResult.setText( this.translateScore( keyword, this.keywordsChecked[ keyword ], i18n ) )
			doAction( 'rankMath_analysis_keywordUsage_updated', keyword, analysisResult )
			return analysisResult
		}

		this.keywordsChecked[ keyword ] = true
		jQuery.ajax(
			{
				url: rankMath.ajaxurl,
				type: 'GET',
				data: {
					keyword,
					action: 'rank_math_is_keyword_new',
					security: rankMath.security,
					objectID: rankMath.objectID,
					objectType: rankMath.objectType,
				},
			}
		).done( ( data ) => {
			this.keywordsChecked[ keyword ] = data.isNew
			analysisResult.setText( this.translateScore( keyword, data.isNew, i18n ) )
			analysisResult.has = data.isNew
			doAction( 'rankMath_analysis_keywordUsage_updated', keyword, analysisResult )
		} )

		analysisResult.setText( i18n.__( 'We are searching in database.', 'rank-math' ) )

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
		return paper.hasKeyword()
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {string}  keyword      The keyword.
	 * @param {boolean} isNewKeyword Is the selected keyword new or not.
	 * @param {Jed}     i18n         The i18n-object used for parsing translations.
	 *
	 * @return {string} The translated string.
	 */
	translateScore( keyword, isNewKeyword, i18n ) {
		return isNewKeyword ?
			i18n.__( 'You haven\'t used this Focus Keyword before.', 'rank-math' ) :
			i18n.sprintf(
				i18n.__( 'You have %1$s this Focus Keyword.', 'rank-math' ),
				'<a target="_blank" href="' + this.changeKeywordInLink( keyword ) + '">' + i18n.__( 'already used', 'rank-math' ) + '</a>'
			)
	}

	/**
	 * Change keyword in link for post list.
	 *
	 * @param {string} keyword The keyword.
	 *
	 * @return {string} Generated url.
	 */
	changeKeywordInLink( keyword ) {
		return rankMath.assessor.focusKeywordLink
			.replace( '%focus_keyword%', keyword )
			.replace( '%post_type%', rankMath.objectType )
			.replace( '%yaxonomy%', rankMath.objectType )
	}
}

export default KeywordNotUsed
