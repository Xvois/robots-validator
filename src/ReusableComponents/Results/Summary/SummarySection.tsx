import {Comment} from "../../../Functions/CommentFuncs";
import ErrorIcon from "@mui/icons-material/Error";
import React, {ReactElement} from "react";
import WarningIcon from "@mui/icons-material/Warning";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {AccordionContent, AccordionItem, AccordionTrigger} from "../../../ShadComponents/ui/accordion";


function SummarySection(props: { robotsArray: string[], comments: Comment[], type: "errors" | "warnings" | "infos" }) {
    const {robotsArray, comments, type} = props;

    let icon: ReactElement | undefined;

    switch (type) {
        case "errors":
            icon = <ErrorIcon sx={{color: 'var(--error)'}} fontSize={'small'}/>;
            break;
        case "warnings":
            icon = <WarningIcon sx={{color: 'var(--warning)'}} fontSize={'small'}/>;
            break;
        case "infos":
            icon = <InfoOutlinedIcon fontSize={'small'}/>;
            break;
    }

    return (
        <AccordionItem value={type}>
            <AccordionTrigger className={"capitalize"}>
                <div className={"inline-flex items-center gap-2"}>
                    {icon}
                    {type}
                </div>
            </AccordionTrigger>
            <AccordionContent>
                {comments.map(comment => {
                    return (
                        <div>
                            {comment.index > -1 &&
                                <a href={`#${comment.index}`}>Line {comment.index + 1}: </a>
                            }
                            {comment.messageElement}
                        </div>
                    )
                })}
            </AccordionContent>
        </AccordionItem>
    )
}

export default SummarySection;