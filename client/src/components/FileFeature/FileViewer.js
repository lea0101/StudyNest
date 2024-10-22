import React, { useState, useEffect } from 'react';
import { storage, auth } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, listAll, getDownloadURL, uploadBytesResumable, getStorage } from "firebase/storage";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FileUploader from "./FileUploader";
import NavBar from "../NavBar";
import "./FileCollab.css";
import { pdfjs, Document, Page } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

import type { PDFDocumentProxy } from "pdfjs-dist";



const FileViewer = (props) => {

    const [ numPages, setNumPages ] = useState(null);
    const [ pageNumber, setPageNumber ] = useState(1);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ url, setURL ] = useState(null);
    
    const { state } = useLocation();
    
    function onDocumentLoadSuccess({ numPages }: { numPages: number}): void {
        setNumPages(numPages);
    }
    /*
    useEffect(() => {
        /*
        getDownloadURL(ref(storage, `${props.file}`))
        .then((url) => {
            setURL(url);
            setInterval(() => setIsLoading(false), 500);
        })
        .catch(() => setIsLoading(false));
        return () => {};

        const storage = getStorage();
        const pathReference = ref(storage, `${props.file}`);
        setURL(pathReference);
        setIsLoading(false);
    }, []);
    */
    
    setURL("https://www.irs.gov/pub/irs-pdf/f1040se.pdf");
    if (isLoading) return <p>Loading...</p>;
    else {
        if (!url) {
            return <p>Oops, something went wrong. Try refreshing the page.</p>;
        }
        else {
            return (
                <Document onLoadSuccess={() => onDocumentLoadSuccess} file={url}>
                    <Page pageNumber={pageNumber} />
                </Document>
            );
        }
    }
};


export default FileViewer;
