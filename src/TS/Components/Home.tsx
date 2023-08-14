import '../../CSS/index.css';
import '../../CSS/Home.css';
import React, {useState} from "react";
import {RobotsDisplay} from "./Robots";
import {InputForm} from "./InputForm";

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
            <script async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6120053533447626"
                    crossOrigin="anonymous"></script>
            <InputForm {...{platforms, setRobots, setGoodExample, setBadExample}} />
            <RobotsDisplay {...{robots, goodExample, badExample}}/>
        </>
    )
}

export default Home;