import {ReactElement} from "react";

/**
 * A comment is an object that can reference line
 * in the text file to note something.
 * In the case where it is noting something that
 * does not exist an index of -1 is used.
 */
export interface Comment {
    type: "NECESSARY" | "INFO" | "WARNING" | "ERROR" | string,
    messageElement: ReactElement,
    index: number
}

/**
 * Extracts the type and message
 * of a comment from a string.
 * @param string
 * @return {string, string}
 */
export function extractTypeAndMessage(string: string): { type: string, message: string } {
    const typeRegex = /# ([A-Z ]+) \|/;
    const messageRegex = /\| (.+)/;

    const typeMatch = string.match(typeRegex);
    const messageMatch = string.match(messageRegex);

    const type = typeMatch ? typeMatch[1] : "";
    const message = messageMatch ? messageMatch[1] : "";

    return {type, message};
}


/**
 * Returns an array of warning comments for any lines marked **NECESSARY** in a good practice file
 * but not found in the provided file.
 *
 * The function compares the `inputArray` with the comments and conditions in the `matchArray`.
 * If a line is marked as **NECESSARY** in the `matchArray` but not found in the `inputArray`,
 * a warning comment will be generated and added to the result array.
 *
 * @param {string[]} inputArray - The array to be tested for missing lines.
 * @param {string[]} matchArray - The array containing comments and conditions marked as **NECESSARY**.
 * @returns {Comment[]} An array of Comment objects, each representing a warning comment.
 *
 * @example
 * const inputArray = [
 *   'Line 1',
 *   'Line 3',
 *   'Line 4',
 * ];
 * const matchArray = [
 *   '# NECESSARY | This line is required',
 *   'Line 1',
 *   '# NECESSARY | This line is required',
 *   'Line 2',
 * ];
 *
 * const warnings = getMissingLineComments(inputArray, matchArray);
 * console.log(warnings);
 * // Output:
 * // [
 * //   { type: 'WARNING', messageElement: <p><strong>Missing line:</strong> <code>Line 2</code> <br/> This line is required</p>, index: -1 }
 * // ]
 */
export const getMissingLineComments = (inputArray: string[], matchArray: string[]): Comment[] => {
    const warnings: Comment[] = [];
    // Flag to check if we are currently in a block of necessary
    // conditions.
    let necessaryBlock = false;
    let blockCommentIndex = undefined as unknown as number;

    for (let i = 0; i < matchArray.length; i++) {
        const matchLine = matchArray[i].trim();
        if (necessaryBlock) {
            if (matchLine.startsWith('#')) {
                necessaryBlock = false;
            } else {
                if (!inputArray.some(providedLine => providedLine === matchLine)) {
                    const {message} = extractTypeAndMessage(matchArray[blockCommentIndex]);
                    warnings.push({
                        type: "WARNING",
                        messageElement: <p>`<code>{matchLine}</code>` not found. {message}</p>,
                        index: -1
                    })
                }
            }
        }

        if (matchLine.startsWith('# NECESSARY')) {
            necessaryBlock = true;
            blockCommentIndex = i;
        }
    }

    return warnings;
}

/**
 * Extracts comments from an associated regex match in an input array.
 *
 * The regex statements can be anywhere in the match array
 * as long as they are wrapped in backticks and have a comment above them.
 *
 * @param {string[]} inputArray - The array to be tested for regex matches.
 * @param {string[]} matchArray - The array containing regex statements to test against the input array.
 * @returns {Comment[]} An array of Comment objects, each representing a match with its associated comment.
**/
export const getRegexMatchComments = (inputArray: string[], matchArray: string[]): Comment[] => {

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
                const messageElement = <p>{message}</p>
                const comment: Comment = {
                    type,
                    messageElement,
                    index: lineIndex
                };
                comments.push(comment)
            }
        })
    })
    return comments;
}