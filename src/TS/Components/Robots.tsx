import React, {useEffect, useState} from "react";
import {Tooltip} from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import {Comment, extractTypeAndMessage, getMissingLineComments, getRegexMatchComments} from "../Functions/CommentFuncs";

export function RobotsDisplay(props: {
    robots: string
    goodExample: string,
    badExample: string
}) {
    const {robots, goodExample, badExample} = props;
    /**
     * Split up the lines in to an array.
     * This makes line by line comparisons easy.
     * We also remove carriage returns that some
     * interpreters may add.
     * **/
    const goodExampleArray: string[] = (goodExample?.split('\n') || []).map(line => line.replace(/\r/g, ''));
    const badExampleArray: string[] = (badExample?.split('\n') || []).map(line => line.replace(/\r/g, ''));
    const robotsArray: string[] = (robots?.split('\n') || []).map(line => line.replace(/\r/g, ''));
    const [allComments, setAllComments] = useState(undefined as unknown as Comment[]);
    const errors = allComments?.filter(c => c.type === "ERROR");
    const warnings = allComments?.filter(c => c.type === "WARNING");
    /**
     * We don't want to rerender until all comments
     * are submitted, so we fill partial comments first.
     */
    let partialComments: Comment[] = [];
    const [isReady, setIsReady] = useState(false);


    /**
     * This will run as soon as the robots.txt and both example files
     * are ready to be used.
     *
     * It iterates through each line of the robots file and searches for
     * matching lines in either example file. Upon a match it pushes a
     * comment to the partial comments array.
     *
     * Upon EOF it runs getMissingLineComments and getRegexMatchComments and concatenates
     * it with the other comments created. It then passes this information to the
     * state managed allComments.
     */
    useEffect(() => {
        if (!!robots && !!goodExample && !!badExample) {

            robotsArray.forEach((line, lineIndex) => {
                if (line !== '') {
                    /**
                     * Check the input array for direct matches.
                     */
                    [goodExampleArray, badExampleArray].forEach(array => {
                        //                                    We use direct comparison here.
                        //                                    Lines must be **identical**.
                        const index = array.findIndex(l => l === line);
                        // If there is a direct match.
                        if (index !== -1) {
                            const rawComment = array[index - 1];

                            const {type, message} = extractTypeAndMessage(rawComment);

                            const comment: Comment = {
                                // @ts-ignore
                                type: type,
                                message: message,
                                index: lineIndex
                            };

                            partialComments.push(comment);
                        }
                    });
                }
                // If we are at the end of the file then search for what we missed.
                if (lineIndex === robotsArray?.length - 1) {
                    const missingLineComments = getMissingLineComments(robotsArray, goodExampleArray);
                    partialComments = partialComments.concat(missingLineComments);

                    const regexComments = getRegexMatchComments(robotsArray, badExampleArray);
                    partialComments = partialComments.concat(regexComments);

                    // Comments can now be state controlled.
                    setAllComments(partialComments);
                }
            });

            setIsReady(true);

        }
    }, [robots, goodExample, badExample]);


    /**
     * Will return the line as a li object
     * with appropriate annotations and styling.
     *
     * @param line
     * @param lineIndex
     */
    const getFormattedLine = (line: string, lineIndex: number) => {

        const comment: Comment | undefined = allComments.find(c => c.index === lineIndex);

        return (
            <li key={lineIndex}
                className={comment ? 'robots-line-wrapper ' + comment.type.toLowerCase() : 'robots-line-wrapper'}>
                {comment !== undefined ?
                    <Tooltip disableFocusListener title={comment.message} arrow placement={"right"}>
                        <code>
                            {line}
                        </code>
                    </Tooltip>
                    :
                    <code>{line}</code>
                }
            </li>

        )
    }

    return (
        isReady ?
            <div className={'robots-wrapper'}>
                <ol className={'robots-list'}>
                    {robotsArray.map((line, index) => {
                        return getFormattedLine(line, index);
                    })
                    }
                </ol>
                <RobotsSummary robotsArray={robotsArray} warnings={warnings} errors={errors}/>
            </div>
            :
            <></>
    )
}

const RobotsSummary = (props: { robotsArray: string[], warnings: Comment[], errors: Comment[] }) => {
    const {robotsArray, warnings, errors} = props;
    return (
        <div className={'robots-summary'}>
            <div>
                <p><ErrorIcon fontSize={'small'}/>{errors.length} error{errors.length !== 1 && 's'}</p>
                <ul>
                    {errors.map(comment => {
                        return (
                            <li>
                                <p>
                                    ERROR: {robotsArray[comment.index]}
                                </p>
                                <p>
                                    {comment.message}
                                </p>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div>
                <p><WarningIcon fontSize={'small'}/>{warnings.length} warning{warnings.length !== 1 && 's'}</p>
                <ul>
                    {warnings.map(comment => {
                        return (
                            <li>
                                <p>
                                    WARNING: {robotsArray[comment.index]}
                                </p>
                                <p>
                                    {comment.message}
                                </p>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}