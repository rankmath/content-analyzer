/**
 * External dependencies
 */
import { forEach, round } from 'lodash'

/**
 * Analysis result manager.
 */
class ResultManager {
	/**
	 * Class constructor.
	 */
	constructor() {
		this.results = new Map
	}

	/**
	 * Get all results.
	 *
	 * @return {Object} Results.
	 */
	getResults() {
		return Object.fromEntries( this.results )
	}

	/**
	 * Get result for keyword.
	 *
	 * @param {string} keyword Keyword for which you want score.
	 *
	 * @return {AnalysisResult} Analysis results for keyword.
	 */
	getResult( keyword ) {
		return this.results.get( keyword )
	}

	/**
	 * Get the available score.
	 *
	 * @param {string} keyword Keyword for which you want score.
	 *
	 * @return {number} Result score.
	 */
	getScore( keyword ) {
		if ( this.results.has( keyword ) ) {
			return this.results.get( keyword ).score
		}

		return 0
	}

	/**
	 * Add result.
	 *
	 * @param {string}         keyword   Keyword of which results are.
	 * @param {AnalysisResult} results   Analysis results.
	 * @param {boolean}        isPrimary Is primary keyword.
	 */
	update( keyword, results, isPrimary = false ) {
		if ( this.results.has( keyword ) ) {
			const oldResults = this.results.get( keyword )
			results = {
				...oldResults.results,
				...results,
			}
			isPrimary = oldResults.isPrimary
		}

		this.results.set(
			keyword,
			{
				results,
				isPrimary,
				score: this.refreshScore( results ),
			}
		)
	}

	/**
	 * Refresh score after results update.
	 *
	 * @param {AnalysisResult} results Analysis results.
	 *
	 * @return {number} Analysis total score.
	 */
	refreshScore( results ) {
		let score = 0
		let total = 0
		const shortLocale = rankMath.localeFull.split( '_' )[ 0 ]

		forEach( results, ( result ) => {
			score += result.getScore()
			total += result.getMaxScore( shortLocale )
		} )

		return round( ( score / total ) * 100 )
	}

	/**
	 * Delete result for keyword.
	 *
	 * @param {string} keyword Keyword for which you want score.
	 */
	deleteResult( keyword ) {
		this.results.delete( keyword )
	}

	/**
	 * Check if keyword is primary.
	 *
	 * @param {string} keyword Keyword for which you want score.
	 *
	 * @return {boolean} Whether keyword is primary or not.
	 */
	isPrimary( keyword ) {
		if ( this.results.has( keyword ) ) {
			return this.results.get( keyword ).isPrimary
		}

		return false
	}
}

export default ResultManager
