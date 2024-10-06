import React from 'react'
import { Link } from 'react-router-dom';

function Room( {name} ) {
    return (
        <div className="Room">
            <Link to={`/rooms/${name}`}>
                <h3>Room: {name}</h3>
            </Link>
        </div>
    );
}

export default Room;