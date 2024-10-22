import React, { useState, useEffect } from 'react';
import { storage, auth } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, listAll, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FileUploader from "./FileUploader";
import NavBar from "../NavBar";
import "./FileCollab.css";
import { pdfjs, Document, Page } from 'react-pdf';
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
    
    useEffect(() => {
        getDownloadURL(ref(storage, `${props.file}`))
        .then((url) => {
            setURL(url);
            setInterval(() => setIsLoading(false), 500);
        })
        .catch(() => setIsLoading(false));
        return () => {};
    }, []);

    if (isLoading) return <p>Loading...</p>;
    else {
        if (!url) {
            return <p>Oops, something went wrong. Try refreshing the page.</p>;
        }
        else {
            return (
                <Document file={url}>
                    <Page pageNumber={pageNumber} />
                </Document>
            );
        }
    }
};


/*
async function getFileURL(pdfURL)
{
    const arrayBuffer = await fetch(pdfURL);
    const blob = await arrayBuffer.blob();
    const url = await blobToURL(blob);

    function blobToURL(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                const b64data = reader.result;
                resoprlve(b64data);
            };
        });
    };
    return url;
}

function FileViewer({file}) {
    const [ numPages, setNumpages ] = useState(0);
    const [ containerWidth, setContainerWidth ] = useState(0);

    const [ pdfURL, setPDFURL ] = useState();

    useEffect(() => {
        if (file)
        {
            getDownloadURL(ref(storage, file))
            .then( (url) => setPDFURL(getFileURL(url)));
            
        }
        else
        {
            return;
        }
    }, []);

    const maxWidth = 800;
    return (
        <div>
            <Document file="https://www.irs.gov/pub/irs-pdf/f1040se.pdf">
                {Array.from(new Array(numPages), (_el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                    />))}
            </Document>
        </div>
    );
}
*/
export default FileViewer;
