import '../../CSS/index.css';
import '../../CSS/Home.css';
import React, {useState} from "react";
import {RobotsDisplay} from "./Robots";
import {InputForm} from "./InputForm";




function Home() {

    const [robots, setRobots] = useState(undefined as unknown as string);

    const example =
`
User-Agent: *

# Allow robots to be able to crawl the OG Image API route and all the subpaths
Allow: /api/og/*
Allow: /api/dynamic-og*

Disallow:
Disallow: /api/
Disallow: /oauth
Disallow: /confirm
Disallow: /notifications
Disallow: /old-browser.html
Disallow: /docs/concepts/payments-and-billing/usage-based-pro-plan
Disallow: /docs/concepts/projects/sensitive-environment-variables
Allow: main.js
Allow: index.css
Allow: app.js




Sitemap: https://vercel.com/sitemap.xml`

    return (
        <>
            <h1>Robots.txt validator</h1>
            <InputForm setRobots={setRobots} />
            <RobotsDisplay robots={robots ? robots : example} />
        </>
    )
}

export default Home;