import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

function NavBar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }
    
    return (
        <nav className="navbar">
            <div className="navbar-hamburger" onClick={toggleMenu}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </div>

            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/">StudyNest</Link>
                </div>
            </div>

            <ul className={isOpen ? 'navbar-menu active' : 'navbar-menu'}>
                <li>
                    <Link to="/" onClick={toggleMenu}>Home</Link>
                </li>
            </ul>

            <div className="navbar-profile">
                <FaUserCircle />
            </div>
        </nav>
    )
}

export default NavBar;