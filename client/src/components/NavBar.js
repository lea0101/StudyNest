import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { auth } from '../config/firebase';

function NavBar() {
    const navigate = useNavigate(); // to navigate after logging out

    const [isOpen, setIsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    }

    // function to handle logout
    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error);
        }
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
                <FaUserCircle onClick={toggleProfileMenu}/>
                {isProfileMenuOpen && (
                    <div className='profile-menu'>
                        <button className="user-settings-button" onClick={handleLogout}>
                            User Settings
                        </button> {/* add user settings */}
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default NavBar;