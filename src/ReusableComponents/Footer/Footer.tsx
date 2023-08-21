import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <div id={'footer-wrapper'}>
            <Link to={'/privacy-policy'}>Privacy Policy</Link>
            <Link to={'/terms'}>Terms</Link>
        </div>
    )
}