import '../index.css';
import './Home.css';
import React, {useState} from "react";
import {InputForm} from "../ReusableComponents/InputForm/InputForm";
import Results from "../ReusableComponents/Results/Results";
import SiteDescription from "../ReusableComponents/SiteDescription/SiteDescription";

function Home() {

    // Fetched robots file as string.
    const [robots, setRobots] = useState(undefined as unknown as string);

    // Available platforms. **MUST** match with public folders.
    const platforms = ["Magento", "Shopify", "Wordpress"];

    // Example files as strings.
    const [goodExample, setGoodExample] = useState(undefined as unknown as string);
    const [badExample, setBadExample] = useState(undefined as unknown as string);

    return (
        <div className={"flex flex-col flex-grow justify-between"}>
            <div className={"flex flex-col gap-5"}>
                <InputForm {...{platforms, setRobots, setGoodExample, setBadExample}} />
                <Results {...{robots, goodExample, badExample}}/>
            </div>
            <SiteDescription />
        </div>
    )
}

export default Home;