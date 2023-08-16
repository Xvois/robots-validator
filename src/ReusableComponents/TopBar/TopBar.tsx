import "./TopBar.css"
import {GitHub} from "@mui/icons-material";

function TopBar() {

    const path = window.location.pathname;

    return (
        <div className={"inline-flex p-5 justify-between w-full"}>
            <a className={"inline-flex gap-2 items-center"}>
                <GitHub fontSize={'small'} />
                robots.txt Validator and Testing Tool
            </a>
            <div className={"inline-flex gap-5"}>
                <a className={path === '/' ? "underline" : ""} href={"/"}>Tool</a>
                <a className={path.includes('/about') ? "underline" : ""} href={"/about"}>About</a>
            </div>
        </div>
    )
}

export default TopBar;