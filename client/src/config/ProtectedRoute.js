import React, { useState, useEffect }from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import {doc, getDoc} from "firebase/firestore";

function ProtectedRoute({ children, roomCode=null }) {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <p>Loading...</p>;
    }

    // if no user is logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" />
    }

    // if user is authenticated, render protected component
    return children;
}

export default ProtectedRoute;