import React, {useEffect, useState} from "react";
import {
    Comment,
    extractTypeAndMessage,
    getMissingLineComments,
    getRegexMatchComments
} from "../../Functions/CommentFuncs";


const Readout = React.lazy(() => import('./Readout/Readout')); // Adjust the path accordingly
const Summary = React.lazy(() => import('./Summary/Summary')); // Adjust the path accordingly

function Results(props: {
    robots: string
    goodExample: string,
    badExample: string,
}) {

    const {robots, goodExample, badExample} = props;
    const goodExampleArray: string[] = (goodExample?.split('\n') || []).map(line => line.replace(/\r/g, ''));
    const badExampleArray: string[] = (badExample?.split('\n') || []).map(line => line.replace(/\r/g, ''));
    const robotsArray: string[] = (robots?.split('\n') || []).map(line => line.replace(/\r/g, ''));
    /**
     * We don't want to rerender until all comments
     * are submitted, so we fill partial comments first.
     */
    let partialComments: Comment[] = [];
    const [allComments, setAllComments] = useState(undefined as unknown as Comment[]);
    /**
     * All comments derivatives.
     */
    const errors = allComments?.filter(c => c.type === "ERROR");
    const warnings = allComments?.filter(c => c.type === "WARNING");
    const infos = allComments?.filter(c => c.type === "INFO");

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
        } else {
            setAllComments(undefined as unknown as Comment[]);
        }
    }, [robots, goodExample, badExample]);

    return (
        <div className={"flex flex-col"}>
            {allComments ?
                <>
                    <Readout {...{robotsArray, allComments, infos, warnings, errors}} />
                    <Summary {...{infos, warnings, errors}} />
                </>
                :
                window.location.search ?
                    <div className={"animate-pulse"}>
                        <div className={"flex-grow h-[445px] bg-slate-100 border-2 rounded border-slate-50"}/>
                        <div className={"my-5"}>
                            <div className={"flex-grow h-[171px] bg-slate-100"}/>
                        </div>
                    </div>
                    :
                    <div className={"h-[546px]"}>
                    </div>
            }
        </div>
    )
}

export default Results;