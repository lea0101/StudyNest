import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="A-Page">
            <h1>404 - Page Not Found</h1>
            <p>Oops! The page you are looking for does not exist.</p>
            <Link to="/home">
                <button className="a-button">Go Back Home</button>
            </Link>
        </div>
    )
}

export default NotFoundPage;