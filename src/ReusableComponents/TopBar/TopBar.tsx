import "./TopBar.css"
// @ts-ignore
import logo from "../../img/logo.png"
import {Link} from "react-router-dom";

function TopBar() {

    return (
        <div className={"inline-flex p-5 justify-between items-center w-full"}>
            <a className={"inline-flex gap-2 items-center"}>
                <img src={logo} alt={'Validator logo'} className={'h-12'} />
            </a>
            <div className={"inline-flex gap-5"}>
                <Link to={"/"}>Tool</Link>
                <Link to={"/example"}>Example</Link>
            </div>
        </div>
    )
}

export default TopBar;