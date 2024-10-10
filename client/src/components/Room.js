import React, { useState } from "react"
import { useNavigate, Link } from 'react-router-dom';

function Room( { name, code, onDelete } ) {
    const navigate = useNavigate(); // for programmatic navigation

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // store if delete button should show up

    // handle if room button is clicked (to enter room)
    const handleClick = () => {
        navigate(`/rooms/${name}`, { state: { roomCode: code }}); // passing room code via state
    };

    // handle deleting a room
    const handleDeleteClick = () => {
        setShowDeleteConfirm(true); // toggle confirmation dialog
    }

    const handleConfirmDelete = () => {
        onDelete(name); // call the delete function passed
        setShowDeleteConfirm(false); // hide confirmation after deleting
    };

    return (
        <div className="Room-container">
            <button 
            className="room-button"
            onClick={handleClick}
            >
                Room: {name}
            </button>
            
            <button className="three-dots-button" onClick={handleDeleteClick}>
                &#8230; {/* html for three dots */}
            </button>

            {showDeleteConfirm && (
                <div className="delete-confirmation">
                    <p>Are you sure you want to delete this room?</p>
                    <button className="confirm-delete-button" onClick={handleConfirmDelete}>
                        Delete Room
                    </button>
                    <button className="cancel-delete-button" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                    </button>
                </div>
            )}

        </div>
    );
}

export default Room;