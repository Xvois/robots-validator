import React from "react";
import {Comment} from "../../../Functions/CommentFuncs";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import FormattedLine from "./FormattedLine";

export function Readout(props: {
    robotsArray: string[],
    allComments: Comment[],
    infos: Comment[],
    warnings: Comment[],
    errors: Comment[]
}) {
    const {robotsArray, allComments, infos, warnings, errors} = props;


    return (
        <div className={'flex flex-row wrap gap-4 p-4 justify-center items-start'}>
            <div className={"flex-grow w-64"}>
                <div className={"flex items-center py-2 px-4 gap-4"}>
                    <div className={"inline-flex items-center gap-2"}>
                        <ErrorIcon sx={{color: 'var(--error-colour)'}} fontSize={'small'}/>
                        <code style={{margin: '5px 0'}}>
                            <strong>{errors.length}</strong> error{errors.length !== 1 && 's'}
                        </code>
                    </div>
                    <div className={"inline-flex items-center gap-2"}>
                        <WarningIcon sx={{color: 'var(--warning-colour)'}} fontSize={'small'}/>
                        <code style={{margin: '5px 0'}}>
                            <strong>{warnings.length}</strong> warning{warnings.length !== 1 && 's'}
                        </code>
                    </div>
                </div>
                <div>
                    <ol className={"overflow-scroll h-96 p-4 m-0 flex-row text-sm [&>*:nth-child(even)]:bg-gray-100"}>
                        {robotsArray.map((line, index) => {
                            if (line) {
                                return <FormattedLine allComments={allComments} line={line} lineIndex={index}/>
                            }
                        })
                        }
                    </ol>
                </div>
            </div>
        </div>
    )
}
