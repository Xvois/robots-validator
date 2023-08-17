import React from "react";
import {Comment} from "../../../Functions/CommentFuncs";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import FormattedLine from "./FormattedLine";

export default function Readout(props: {
    robotsArray: string[],
    allComments: Comment[],
    infos: Comment[],
    warnings: Comment[],
    errors: Comment[]
}) {
    const {robotsArray, allComments, infos, warnings, errors} = props;


    return (
        <div className={'flex flex-row wrap justify-center items-start border-4 border-slate-50 rounded'}>
            <div className={"flex-grow w-64"}>
                <div className={"flex items-center gap-4 pl-1 bg-slate-50"}>
                    <div className={"inline-flex items-center gap-2"}>
                        <ErrorIcon sx={{color: 'var(--error)'}} fontSize={'small'}/>
                        <code style={{margin: '5px 0'}}>
                            <strong>{errors.length}</strong> error{errors.length !== 1 && 's'}
                        </code>
                    </div>
                    <div className={"inline-flex items-center gap-2"}>
                        <WarningIcon sx={{color: 'var(--warning)'}} fontSize={'small'}/>
                        <code style={{margin: '5px 0'}}>
                            <strong>{warnings.length}</strong> warning{warnings.length !== 1 && 's'}
                        </code>
                    </div>
                </div>
                <div>
                    <ol className={"overflow-scroll h-96 m-0 flex-row text-sm [&>*:nth-child(even)]:bg-slate-50"}>
                        {robotsArray.map((line, index) => {
                            return <FormattedLine key={`Line: ${index}`} allComments={allComments} line={line} lineIndex={index}/>
                        })
                        }
                    </ol>
                </div>
            </div>
        </div>
    )
}
