import "./TopBar.css"
// @ts-ignore
import logo from "../../img/logo.png"

function TopBar() {

    const path = window.location.pathname;

    return (
        <div className={"inline-flex p-5 justify-between items-center w-full"}>
            <a className={"inline-flex gap-2 items-center"}>
                <img src={logo} alt={'Validator logo'} className={'h-12'} />
            </a>
            <div className={"inline-flex gap-5"}>
                <a className={path === '/' ? "underline" : ""} href={"/"}>Tool</a>
                <a className={path.includes('/example') ? "underline" : ""} href={"/example"}>Example</a>
            </div>
        </div>
    )
}

export default TopBar;