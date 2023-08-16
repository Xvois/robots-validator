import React from "react";
import {Comment} from "../../../Functions/CommentFuncs";
import SummarySection from "./SummarySection";
import {Accordion} from "../../../ShadComponents/ui/accordion";


export function Summary(props: {
    robotsArray: string[],
    infos: Comment[],
    warnings: Comment[],
    errors: Comment[]
}) {
    const {robotsArray, infos, warnings, errors} = props;
    return (
        <Accordion type="single" collapsible className="w-full">
            {errors.length > 0 &&
                <SummarySection comments={errors} type={"errors"} robotsArray={robotsArray}/>
            }
            {warnings.length > 0 &&
                <SummarySection robotsArray={robotsArray} comments={warnings} type={"warnings"}/>
            }
            {infos.length > 0 &&
                <SummarySection robotsArray={robotsArray} comments={infos} type={"infos"}/>
            }
        </Accordion>
    )
}