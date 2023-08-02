/**
 * A comment is an object that can reference line
 * in the text file to note something.
 * In the case where it is noting something that
 * does not exist an index of -1 is used.
 */
export interface Comment {
    type: "NECESSARY" | "INFO" | "WARNING" | "ERROR" | string,
    message: string,
    index: number
}

/**
 * Extracts the type and message
 * of a comment from a string.
 * @param string
 * @return {string, string}
 */
export function extractTypeAndMessage(string: string) : {type: string, message: string} {
    const typeRegex = /# ([A-Z ]+) \|/;
    const messageRegex = /\| (.+)/;

    const typeMatch = string.match(typeRegex);
    const messageMatch = string.match(messageRegex);

    const type = typeMatch ? typeMatch[1] : "";
    const message = messageMatch ? messageMatch[1] : "";

    return {type, message};
}


/**
 * Returns an array of comments
 * of a warning type for any lines marked
 * *NECESSARY* in a good practice file
 * but not found in the provided file.
 * @param inputArray The array that will be tested.
 * @param matchArray The array containing **NECESSARY** comments & conditions to test.
 * @returns Comment[]
 */
export const getMissingLineComments = (inputArray: string[], matchArray: string[]) : Comment[] => {
    const warnings: Comment[] = [];
    matchArray.forEach((goodLine, index) => {
        // We assume we are looking at a comment of a line.
        // If we are not then these just resolve to empty strings
        // and the line is missed.
        const {type, message} = extractTypeAndMessage(goodLine);
        if (type === "NECESSARY") {
            if (!inputArray.some(providedLine => providedLine === matchArray[index + 1])) {
                warnings.push({
                    type: "WARNING",
                    message: `${matchArray[index + 1]} is missing. ${message}`,
                    index: -1
                })
            }
        }
    })
    return warnings;
}
/**
 * Returns an array of comments
 * from an associated regex match.
 *
 * The regex statements can be anywhere in the match array
 * as long as they are wrapped in backticks and
 * have a comment above them.
 * @param inputArray The array that will be tested.
 * @param matchArray The array containing regex statements to test.
 * @returns Comment[]
 */
export const getRegexMatchComments = (inputArray: string[], matchArray: string[]) : Comment[] => {

    const comments: Comment[] = [];

    const backtickRegex = /`([^`]+)`/;

    const regexStatements: string[] = [];
    const regexRawComments: string[] = [];

    for (let i = 1; i < matchArray.length; i++) {
        const line = matchArray[i];
        if (line.startsWith('`')) {
            const match = line.match(backtickRegex);
            if (match) {
                regexStatements.push(match[1]);
                const rawComment = matchArray[i - 1];
                regexRawComments.push(rawComment);
            }
        }
    }

    inputArray.forEach((line, lineIndex) => {
        regexStatements.forEach((regexStatement, regexIndex) => {
            const match = line.match(regexStatement);
            if (match) {
                const {type, message} = extractTypeAndMessage(regexRawComments[regexIndex]);
                const comment: Comment = {
                    type,
                    message,
                    index: lineIndex
                };
                comments.push(comment)
            }
        })
    })
    return comments;
}