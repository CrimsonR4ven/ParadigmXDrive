import { useEffect, useState } from 'react';
import {Link, useSearch} from "wouter";
import folderen from './assets/icons8-folder-512.png'
import folderenen from './assets/icons8-folder-64.png'
import dokumenten from './assets/icons9-document-512.png'
import './App.css';

function FilePreview({ image, name, onDivClick, type }) {
    return (<><div style={{
        position: "fixed",
        top: "0vh",
        left: 0,
        width: "100vw",
        height: "4vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    }} >
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "4vh",
            backgroundColor: "rgb(30,30,30)",
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            zIndex: 1000,
            borderRadius: "0px 0px 20px 20px",
            paddingLeft: 15,
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
        }}>
             <img src={dokumenten} alt="folder" style={{ height: "80%", float: "left", marginRight: "10px" }} /><p style={{ color: "white" }}>{name}</p>
        </div>
    </div>
        <div
            onClick={onDivClick}
            style={{
                position: "fixed",
                top: "4vh",
                left: 0,
                width: "100vw",
                height: "96vh",
                backgroundColor: "rgba(0,0,0,0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            {type == "Image" && (<img className="previewImage" src={image} alt="file" style={{ height: "85%" }} />)}
        </div>

        {type == "Unknown" && (<div
            style={{
                position: "fixed",
                top: "45vh",
                left: "43.5vw",
                width: "13vw",
                height: "10vh",
                padding: "2vh 2vw",
                backgroundColor: "rgb(30,30,30)",
                zIndex: 1001,
                borderRadius: "16px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
                flexDirection: "column",
                textAlign: "center",
            }}
        >
                <p style={{ color: "white", fontSize: "18px", marginBottom: "1vh" }}>
                    File type not supported in preview
                </p>
            <p style={{ color: "lightgray", fontSize: "14px", marginBottom: "1vh" }}>
                    Download to check contents
                </p>
                <button
                    style={{
                        backgroundColor: "#3a82f7",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "14px",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        alert("Download clicked!");
                    }}
                >
                    Download
                </button>
        </div>)}

        {type == "Image" && (<div
            style={{
                position: "fixed",
                top: "95vh",
                left: "45vw",
                width: "10vw",
                height: "4vh",
                backgroundColor: "rgb(30,30,30)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1001,
                borderRadius: "20px",
            }}
        >
        </div>)}</>)
}

function DriveFolderView() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentFilePreview, setCurrentFilePreview] = useState(null);
    const [currentFileName, setCurrentFileName] = useState("");
    const [currentFileType, setCurrentFileType] = useState("");

    const searchString = useSearch();
    const folderPath = searchString.split('&')[0].split('=')[1];
    const actualFolder = folderPath ? decodeURIComponent(folderPath) : "\\Cool Art";
    const [folders, setFolders] = useState();

    const handleOpen = (file) => {
        switch (file.split('.')[1])
        {
            case "jpg":
            case "jepg":
            case "png":
            case "webp":
            case "gif":
                setCurrentFileType("Image");
                break;
            default:
                setCurrentFileType("Unknown");
                break;
        }
        fetch("/File/GetImageFile?path=" + actualFolder + file)
            .then(res => res.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                setCurrentFilePreview(url);
            });
        setCurrentFileName(file.replace("\\", ""));
        setIsOpen(true);
    };

    const handleClose = () => {
        setCurrentFilePreview(null);
        setCurrentFileName("");
        setCurrentFileType("");
        setIsOpen(false);
    };

    useEffect(() => {
        async function populateWeatherData(folder) {
            console.log("Location:", location, "actualFolder:", actualFolder);
            const response = await fetch('/File/GetFolderData?folder=' + folder);
            if (response.ok) {
                const data = await response.json();
                setFolders(data);
            }
        }
        populateWeatherData(actualFolder);
    }, [location, actualFolder]);

    if (!folders) {
        return <p>Loading {actualFolder}...</p>;
    }

    return (
        <div>
            <h1>Folder: {actualFolder}</h1>
            <div className="appcontainer">
                {folders.Subfolders?.map((folder, i) => (
                    <Link
                        href={`/folder?folder=${encodeURIComponent(actualFolder + folder.Name)}`}
                        key={i}
                        className="FolderButton"
                    >
                        <div className="LinkHolder"><img src={folderenen} alt="folder" style={{ height: "80%", float: "left", marginRight: "10px" }} />{folder.Name.replace("\\", "")}</div>
                        <div className="LinkPhoto"><img src={folderen} alt="folder" style={{ height: "85%" }} /></div>

                    </Link>
                ))}

                {folders.Files?.map((file, i) => (
                    <Link
                        key={`file-${i}`}
                        onClick={() => handleOpen(file.Name)}
                        className="FileButton"
                    >
                        <div className="LinkHolder"><img src={dokumenten} alt="folder" style={{ height: "80%", float: "left", marginRight: "10px" }} /><p>{file.Name.replace("\\", "")}</p></div>
                        <div className="LinkPhoto"><img src={dokumenten} alt="file" style={{ height: "85%" }} /></div>
                    </Link>
                ))}
            </div>
            {isOpen && (<FilePreview name={currentFileName} onDivClick={() => handleClose()} image={currentFilePreview} type={currentFileType} ></FilePreview>)
            }
        </div>
    );
}

export default DriveFolderView;