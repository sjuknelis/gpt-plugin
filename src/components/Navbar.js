import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ routes }) {
    const getRoutePath = route => route.index ? "/" : route.path;

    const { pathname } = useLocation();

    return (
        <div className="row Navbar">
            <div className="col">
                <a className="brand" href="#">GPT-Coworker</a>
            </div>
            {
                routes.map(route => (
                    <div className="col">
                        <Link to={getRoutePath(route)} className={pathname == getRoutePath(route) ? "active" : ""}>{ route.title }</Link>
                    </div>
                ))
            }
        </div>
    );
}