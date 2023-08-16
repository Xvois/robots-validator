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
        <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column', flex: '1'}}>
            <div>
                <InputForm {...{platforms, setRobots, setGoodExample, setBadExample}} />
                <Results {...{robots, goodExample, badExample}}/>
            </div>
            <SiteDescription />
        </div>
    )
}

export default Home;