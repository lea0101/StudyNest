import React from "react";
import { Link } from "react-router-dom";

function NotAuthorizedPage() {
    return (
        <div className="A-Page">
            <h1>Access Denied</h1>
            <p>Oops! It looks like you do not have access to this room.</p>
            <Link to="/home">
                <button className="a-button">Go Back Home</button>
            </Link>
        </div>
    )
}

export default NotAuthorizedPage;
