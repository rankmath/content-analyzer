/**
 * External dependencies
 */
import { has } from 'lodash'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import Analysis from '@root/Analysis'
import AnalysisResult from '@root/AnalysisResult'

class ContentHasAssets extends Analysis {
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
			.setEmpty( i18n.__( 'Add a few images and/or videos to make your content appealing.', 'rank-math' ) )
			.setTooltip( i18n.__( 'Content with images and/or video feels more inviting to users. It also helps supplement your textual content.', 'rank-math' ) )
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

		if ( ! paper.hasText() ) {
			if ( paper.hasThumbnail() ) {
				analysisResult
					.setScore( 1 )
					.setText( this.translateScore( analysisResult, i18n ) )
			}

			return analysisResult
		}

		analysisResult
			.setScore(
				this.calculateScore( paper )
			)
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
		return paper.hasText() || paper.hasThumbnail()
	}

	/**
	 * Calculates the score.
	 *
	 * @param {Paper} paper The paper to run this assessment on.
	 *
	 * @return {number} The calculated score.
	 */
	calculateScore( paper ) {
		let score = 0

		score += this.calculateImagesScore( this.getImages( paper ) )
		score += this.calculateVideosScore( this.getVideos( paper.getText() ) )

		return Math.min( this.getScore(), score )
	}

	/**
	 * Get analysis max score.
	 *
	 * @return {number} Max score an analysis has
	 */
	getScore() {
		return applyFilters( 'rankMath_analysis_contentHasAssets_score', 6 )
	}

	/**
	 * Calculates the images score.
	 *
	 * @param {number} images Total number of images.
	 *
	 * @return {number} The calculated score.
	 */
	calculateImagesScore( images ) {
		const scorehash = {
			0: 0,
			1: 1,
			2: 2,
			3: 4,
		}

		if ( has( scorehash, images ) ) {
			return scorehash[ images ]
		}

		return 6
	}

	/**
	 * Calculates the videos score.
	 *
	 * @param {number} videos Total number of videos.
	 *
	 * @return {number} The calculated score.
	 */
	calculateVideosScore( videos ) {
		const scorehash = {
			0: 0,
			1: 1,
		}

		if ( has( scorehash, videos ) ) {
			return scorehash[ videos ]
		}

		return 2
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
			i18n.__( 'Your content contains images and/or video(s).', 'rank-math' ) :
			i18n.__( 'You are not using rich media like images or videos.', 'rank-math' )
	}

	/**
	 * Get all the images.
	 *
	 * @param {Paper} paper The paper to run this assessment on.
	 *
	 * @return {number} Count of found images.
	 */
	getImages( paper ) {
		const images = [].concat(
			this.match( paper.getText(), '<img(?:[^>]+)?>' ),
			this.match( paper.getText(), '\\[gallery( [^\\]]+?)?\\]' )
		)

		if ( paper.hasThumbnail() ) {
			images.push( paper.getThumbnail() )
		}

		return images.length
	}

	/**
	 * Get all the videos.
	 *
	 * @param {string} text The text to use for the assessment.
	 *
	 * @return {number} Count of found videos.
	 */
	getVideos( text ) {
		const videos = [].concat(
			this.match( text, '<iframe(?:[^>]+)?>' ),
			this.match( text, '\\[video( [^\\]]+?)?\\]' ),
			this.match( text, '<video(?:[^>]+)?>' ),
			this.match( text, /(http:\/\/|https:\/\/|)(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/ )
		)

		return videos.length
	}

	/**
	 * Match the assets.
	 *
	 * @param {string} text        The text to use for the assessment.
	 * @param {string} regexString The regex to test the text against.
	 *
	 * @return {Array} The matched set.
	 */
	match( text, regexString ) {
		const regex = new RegExp( regexString, 'ig' )
		const matches = text.match( regex )

		return null === matches ? [] : matches
	}
}

export default ContentHasAssets
