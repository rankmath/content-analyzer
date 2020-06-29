/* eslint no-unused-vars:0 */
/**
 * Abstract layer for single analysis.
 */
class Analysis {
	/**
	 * Executes the assessment and return its result
	 *
	 * @abstract
	 *
	 * @param {Paper}      paper      The paper to run this assessment on.
	 * @param {Researcher} researcher The researcher used for the assessment.
	 * @param {Jed}        i18n       The i18n-object used for parsing translations.
	 *
	 * @return {AnalysisResult} an AnalysisResult with the score and the formatted text.
	 */
	getResult( paper, researcher, i18n ) {
		throw new Error( 'The method getResult is not implemented' )
	}

	/**
	 * Get analysis max score.
	 *
	 * @return {number} Max score an analysis has
	 */
	getScore() {
		return 0
	}

	/**
	 * Check whether thr assessment is applicable
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @return {boolean} Return wethere this analysis is applicable on paper or not.
	 */
	isApplicable( paper ) {
		return true
	}
}

export default Analysis
