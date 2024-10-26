import React, { useState, useEffect } from 'react';
import { storage, auth } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, listAll, getDownloadURL, uploadBytesResumable, getStorage } from "firebase/storage";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FileUploader from "./FileUploader";
import NavBar from "../Home/NavBar";
import "./FileCollab.css";
import { pdfjs, Document, Page } from 'react-pdf';
import type { PDFDocumentProxy } from "pdfjs-dist";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const FileViewer = (props) => {

    const [ numPages, setNumPages ] = useState(null);
    const [ pageNumber, setPageNumber ] = useState(1);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ url, setURL ] = useState(null);
    
    const { state } = useLocation();
    
    function onDocumentLoadSuccess({ numPages }: { numPages: number}): void {
        setNumPages(numPages);
    }
    
    useEffect(() => {
        const storageRef = ref(storage, props.file);
        getDownloadURL(storageRef).then((url) => {
            console.log(url);
            setURL(url);
        });
    }, []);
        if (!url) {
            return <p>Oops, something went wrong. Try refreshing the page.</p>;
        }
        else {
            return (
                <Document onLoadSuccess={() => onDocumentLoadSuccess} file={url}>
                </Document>
            );
        }
};


export default FileViewer;
