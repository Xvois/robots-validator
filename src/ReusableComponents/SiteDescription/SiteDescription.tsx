import "./SiteDescription.css"

function SiteDescription() {
    return (
        <div id={'bottom-bar-wrapper'}>
            <h2>What is a robots.txt file?</h2>
            <p>The robots.txt file is a simple text file used to tell Search Engines about the folders and files on
                the domain that may be crawled (looked at) by the search engine’s crawler, as well as those that
                cannot/should not be seen.
                It is also good practice to include a link/reference to an XML sitemap in the robots.txt file.</p>
        </div>
    )
}

export default SiteDescription;