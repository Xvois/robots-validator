import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer id={'footer-wrapper'}>
            <Link to={'/privacy-policy'}>Privacy Policy</Link>
            <Link to={'/terms'}>Terms</Link>
        </footer>
    )
}