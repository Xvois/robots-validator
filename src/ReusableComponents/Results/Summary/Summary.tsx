import React from "react";
import {Comment} from "../../../Functions/CommentFuncs";
import SummarySection from "./SummarySection";
import {Accordion} from "../../../ShadComponents/ui/accordion";


export default function Summary(props: {
    infos: Comment[],
    warnings: Comment[],
    errors: Comment[]
}) {
    const {infos, warnings, errors} = props;
    return (
        <Accordion type="single" collapsible className="w-full my-5 hmin-[171px]">
            {errors.length > 0 &&
                <SummarySection comments={errors} type={"errors"}/>
            }
            {warnings.length > 0 &&
                <SummarySection comments={warnings} type={"warnings"}/>
            }
            {infos.length > 0 &&
                <SummarySection comments={infos} type={"infos"}/>
            }
        </Accordion>
    )
}