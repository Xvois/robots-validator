import "./TopBar.css"
// @ts-ignore
import logo from "../../img/robots-validator-logo.svg"
import {Link} from "react-router-dom";

function TopBar() {

    return (
        <header className={"inline-flex p-5 justify-between items-center w-full"}>
            <Link to={"/"} className={"inline-flex gap-2 items-center"}>
                <img src={logo} width="256" height="64" className={"h-16"} alt={'Validator logo'}/>
            </Link>
        </header>
    )
}

export default TopBar;