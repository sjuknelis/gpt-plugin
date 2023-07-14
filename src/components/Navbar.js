import './Navbar.css';

export default function Navbar({ routes, activeRoute, setActiveRoute }) {
    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <div className="row Navbar">
            <div className="col">
                <a className="brand" href="#">GPT-Coworker</a>
            </div>
            {
                Object.keys(routes).map(route => (
                    <div className="col">
                        <a className={route == activeRoute ? "active" : ""} onClick={() => setActiveRoute(route)} href="#">{ capitalize(route) }</a>
                    </div>
                ))
            }
        </div>
    );
}