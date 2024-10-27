import React, { useState, useEffect } from 'react';
import { storage, auth } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, listAll, getDownloadURL, uploadBytesResumable, getStorage } from "firebase/storage";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FileUploader from "./FileUploader";
import NavBar from "../Home/NavBar";
import "./FileCollab.css";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Document, Page, pdfjs } from "react-pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";


const FileViewer = (props) => {
    const [ numPages, setNumPages ] = useState(null);
    const [ pageNumber, setPageNumber ] = useState(1);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ url, setURL ] = useState(null);
    const { state } = useLocation();

    useEffect(() => {
        getDownloadURL(ref(storage, props.file))
            .then((url) => {
                setURL(url);
                setInterval(() => setIsLoading(false), 500);
            }).catch(() => setIsLoading(false));
        return () => {};
    }, []);
    if (isLoading) return <p>Loading...</p>;
    else {
        if (!url) {
            return <p>Oops, something went wrong. Try refreshing the page.</p>;
        }
        else {
            return (
            <div className="file-viewer-container">
                <div className="file-viewer">
                    <Viewer fileUrl={url}/>
                </div>
             </div>
            );
        }
    }
};


export default FileViewer;
