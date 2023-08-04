import '../../CSS/index.css';
import '../../CSS/Home.css';
import React, {useState} from "react";
import {RobotsDisplay} from "./Robots";
import {InputForm} from "./InputForm";
import userAgents from "../../user-agents.json";
function Home() {

    // Fetched robots file as string.
    const [robots, setRobots] = useState(undefined as unknown as string);

    // Available platforms. **MUST** match with public folders.
    const platforms = ["Magento", "Shopify", "Wordpress"];

    // Example files as strings.
    const [goodExample, setGoodExample] = useState(undefined as unknown as string);
    const [badExample, setBadExample] = useState(undefined as unknown as string);

    return (
        <>
            <div id={'header-wrapper'}>
                <h1>Robots.txt validator</h1>
                <p>Check a public site's robots.txt file against preconfigured best practices.</p>
            </div>
            <InputForm {...{userAgents, platforms, setRobots, setGoodExample, setBadExample}} />
            <RobotsDisplay {...{robots, goodExample, badExample}}/>
        </>
    )
}

export default Home;