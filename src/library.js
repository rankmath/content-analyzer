/**
 * Internal dependencies
 */
import Analysis from '@root/Analysis'
import AnalysisResult from '@root/AnalysisResult'
import Analyzer from '@root/Analyzer'
import Paper from '@root/Paper'
import Researcher from '@root/Researcher'
import ResultManager from '@root/ResultManager'

/**
 * Helpers
 */
import { cleanText, cleanHTML, cleanTagsOnly, sanitizeText } from '@helpers/cleanText'
import wordCount from '@researches/wordCount'
import matchParagraphs from '@helpers/matchParagraphs'
import removeDiacritics from '@helpers/removeDiacritics'

const Helpers = {
	cleanHTML,
	cleanText,
	cleanTagsOnly,
	matchParagraphs,
	removeDiacritics,
	sanitizeText,
	wordCount,
}

window.rankMathAnalyzer = {
	Analysis,
	AnalysisResult,
	Analyzer,
	Helpers,
	Paper,
	Researcher,
	ResultManager,
}
