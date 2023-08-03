import React, {ReactElement, useEffect, useState} from "react";
import "../../CSS/RobotsSummary.css"
import "../../CSS/RobotsDisplay.css"
import {Tooltip} from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from "@mui/icons-material/Warning"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {Comment, extractTypeAndMessage, getMissingLineComments, getRegexMatchComments} from "../Functions/CommentFuncs";

export function RobotsDisplay(props: {
    robots: string
    goodExample: string,
    badExample: string,
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
                            let rawComment = null;

                            for (let i = index - 1; i >= 0; i--) {
                                const potentialComment = array[i];
                                if (potentialComment.trim().startsWith('#')) {
                                    rawComment = potentialComment;
                                    break;
                                }
                            }

                            if (rawComment) {
                                const {type, message} = extractTypeAndMessage(rawComment);

                                const messageElement = <p>{message}</p>

                                const comment: Comment = {
                                    // @ts-ignore
                                    type: type,
                                    messageElement: messageElement,
                                    index: lineIndex
                                };

                                partialComments.push(comment);
                            }

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

        let icon: ReactElement | undefined;

        if (comment) {
            switch (comment.type) {
                case "ERROR":
                    const errorSx = {color: 'var(--error-colour)', fontSize: '1em', marginLeft: '5px'};
                    icon = <ErrorIcon sx={errorSx}/>
                    break;
                case "WARNING":
                    const warningSx = {color: 'var(--warning-colour)', fontSize: '1em', marginLeft: '5px'};
                    icon = <WarningIcon sx={warningSx}/>
                    break;
                case "INFO":
                    const infoSx = {color: 'var(--primary-colour)', fontSize: '1em', marginLeft: '5px'};
                    icon = <InfoOutlinedIcon sx={infoSx}/>
                    break;
            }
        }

        return (
            <li key={lineIndex} id={`${lineIndex}`}
                className={`robots-line-wrapper`}>
                {comment !== undefined ?
                    <>
                        <code>
                            {line}
                        </code>
                        {icon &&
                            <Tooltip disableFocusListener title={comment.messageElement} arrow placement={"right"}>
                                {icon}
                            </Tooltip>
                        }
                    </>

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
                <RobotsSummary robotsArray={robotsArray} warnings={warnings}
                               errors={errors}/>
            </div>
            :
            <></>
    )
}

const RobotsSummary = (props: {
    robotsArray: string[],
    warnings: Comment[],
    errors: Comment[]
}) => {
    const {robotsArray, warnings, errors} = props;
    const [expanded, setExpanded] = useState(false);
    return (
        <div className={'robots-summary' + (expanded ? ' summary-expanded' : '')}>
            <div className={'collapsed-summary'}>
                <ErrorIcon sx={{color: 'var(--error-colour)'}} fontSize={'small'}/>
                <p>
                    {errors.length} error{errors.length !== 1 && 's'}
                </p>
                <WarningIcon sx={{color: 'var(--warning-colour)'}} fontSize={'small'}/>
                <p>
                    {warnings.length} warning{warnings.length !== 1 && 's'}
                </p>
                <button className={'inline-button'}
                        onClick={() => setExpanded(state => !state)}>{expanded ? 'Show less' : 'Show more'}</button>
            </div>
            {errors.length > 0 &&
                <>
                    <div className={'collapsed-summary'}>
                        <ErrorIcon sx={{color: 'var(--error-colour)'}} fontSize={'small'}/>
                        <h3>Errors</h3>
                    </div>
                    <ul>
                        {errors.sort((a, b) => a.index - b.index).map(comment => {
                            return (
                                <li className={'summary-li-instance'}>
                                    <code style={{fontWeight: 'bold'}}>
                                        {robotsArray[comment.index]}
                                    </code>
                                    {comment.messageElement}
                                    {comment.index > -1 &&
                                        <a style={{color: 'var(--primary-colour)'}} href={`#${comment.index}`}>
                                            Line {comment.index + 1}
                                        </a>
                                    }
                                </li>
                            )
                        })}
                    </ul>
                </>
            }
            {warnings.length > 0 &&
                <>
                    <div className={'collapsed-summary'}>
                        <WarningIcon sx={{color: 'var(--warning-colour)'}} fontSize={'small'}/>
                        <h3>Warnings</h3>
                    </div>
                    <ul>
                        {warnings.sort((a, b) => a.index - b.index).map(comment => {
                            return (
                                <li className={'summary-li-instance'}>
                                    {comment.index > -1 &&
                                        <code style={{fontWeight: 'bold'}}>
                                            {robotsArray[comment.index]}
                                        </code>
                                    }
                                    {comment.messageElement}
                                    {comment.index > -1 &&
                                        <a style={{color: 'var(--primary-colour)'}} href={`#${comment.index}`}>
                                            Line {comment.index + 1}
                                        </a>
                                    }
                                </li>
                            )
                        })}
                    </ul>
                </>
            }
        </div>
    )
}