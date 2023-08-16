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
            icon = <ErrorIcon sx={{color: 'var(--error-colour)'}} fontSize={'small'}/>;
            break;
        case "warnings":
            icon = <WarningIcon sx={{color: 'var(--warning-colour)'}} fontSize={'small'}/>;
            break;
        case "infos":
            icon = <InfoOutlinedIcon sx={{color: 'var(--primary-colour)'}} fontSize={'small'}/>;
            break;
    }

    return (
        <AccordionItem value="item-1">
            <AccordionTrigger>{type}</AccordionTrigger>
            <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
        </AccordionItem>
    )
}

export default SummarySection;