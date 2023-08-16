import {Comment} from "../../../Functions/CommentFuncs";
import {ReactElement} from "react";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {Tooltip} from "@mui/material";

function FormattedLine(props: {
    allComments: Comment[],
    line: string,
    lineIndex: number
}) {

    const {allComments, line, lineIndex} = props;

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
            className={'flex items-center'}>
            <code className={"w-3 mr-3"}>{lineIndex}</code>
            {comment !== undefined ?
                <>
                    <code>
                        {line}
                    </code>
                    {icon &&
                        <Tooltip title={comment.messageElement} arrow placement={"right"}>
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

export default FormattedLine;