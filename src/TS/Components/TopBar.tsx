import "../../CSS/TopBar.css"
import GitHubIcon from '@mui/icons-material/GitHub';
function TopBar () {
    return (
        <div id={"top-bar-wrapper"}>
            <div id={'top-bar-main'}>
                <h1>robots.txt testing</h1>
            </div>
            <div className={'top-bar-anchors-wrapper'}>
                <a className={'top-bar-anchor'} href={'https://github.com/Xvois/robots-validator'}><GitHubIcon fontSize={'small'} />Github</a>
            </div>
        </div>
    )
}

export default TopBar;