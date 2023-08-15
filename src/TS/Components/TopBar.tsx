import "../../CSS/TopBar.css"

function TopBar() {
    return (
        <div id={"top-bar-wrapper"}>
            <div id={"top-bar-main"}>
                <h1>robots.txt Validator and Testing Tool</h1>
            </div>
            <div id={"top-bar-anchors-wrapper"}>
                <a href={"/"} className={"top-bar-anchor"}>Home</a>
            </div>
        </div>
    )
}

export default TopBar;