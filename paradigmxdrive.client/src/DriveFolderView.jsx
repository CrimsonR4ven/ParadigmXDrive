﻿import { useEffect, useState} from 'react';
import { Link, useSearch } from "wouter";
import { useGlobalState } from "./GlobalState";
import folderen from './assets/icons8-folder-512.png'
import folderenen from './assets/icons8-folder-64.png'
import dokumenten from './assets/icons9-document-512.png'
import downloaden from './assets/icons8-download-96.png'
import './App.css';
import './inputStyle.css';

async function RenameFile(path, newName) {

    await fetch("/File/UpdateFileName?path=" + path + "&newName=" + newName, {
        method: 'PATCH'
    });
    return 200;
}


function RenameWindow({ path, handleRenameCloseRef, handleSuccess }) {
    var extention = "." + path.split("/").at(-1).split(".")[1];
    const [inputValue, setInputValue] = useState(
        path.split("/").at(-1).split(".")[0]
    );

    const handleSave = async () => {
        var response = await RenameFile(path, inputValue);
        if (response == 200) {
            handleSuccess(inputValue + extention);
        }
        handleRenameCloseRef();
    }
    return (
        <>
            <div onClick={handleRenameCloseRef}  style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.7)",
                zIndex: 1003
            }}>
            </div>
            <div
                style={{
                    position: "fixed",
                    top: "44vh",
                    left: "40vw",
                    width: "20vw",
                    height: "12vh",
                    padding: "0 2vw 4.5vh 2vw",
                    backgroundColor: "rgb(30,30,30)",
                    zIndex: 1004,
                    borderRadius: "16px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
                    flexDirection: "column",
                    textAlign: "center",
                }}
            >
                <p style={{ color: "whitesmoke" }}>Change file name:</p>
                <div className="input-wrapper">
                    <input type="text" name="text" className="input" onChange={e => setInputValue(e.target.value)} value={inputValue}/>
                    <button className="Extention-btn">
                        {extention}
                    </button>
                </div>
                <button className="Save-btn" onClick={() => handleSave() }>
                    Save
                </button>
                <button className="Cancel-btn" onClick={handleRenameCloseRef}>
                    Cancel
                </button>
            </div>
        </>
    )}

function FilePreview({ image, path, onDivClick, type, handleFileChangingAction}) {
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [fileName, setFileName] = useState(path.split('/').at(-1));

    const handleRenameOpen = () => {
        setIsRenameOpen(true);
    }

    const handleRenameClose = () => {
        setIsRenameOpen(false);
    }

    const handleChangeNameSuccess = newName => {
        setFileName(newName);
        console.log("state: " + fileName + " var: " + newName);
        handleFileChangingAction();
    }

    const handleFileDownload = () => {
        fetch("/File/GetDownloadFile?path=" + path)
            .then(res => res.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = path.split("/").at(-1);
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
    }

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
            <img src={dokumenten} alt="folder" style={{ height: "80%", float: "left", marginRight: "10px" }} />
            <p style={{ color: "white" }} onClick={() => handleRenameOpen()}>{fileName}</p>
            <img src={downloaden} alt="folder" style={{ height: "70%", marginLeft: "auto", marginRight: "20px", cursor: "pointer" }} onClick={() => handleFileDownload()} />
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
            {type == "Image" && (<img className="previewImage" src={image} alt="file" style={{ height: "85%", zIndex: 1002 }} />)}
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
                    onClick={() => handleFileDownload()}
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
        </div>)}

        {isRenameOpen && (<RenameWindow path={path} handleRenameCloseRef={() => handleRenameClose()} handleSuccess={ newName => handleChangeNameSuccess(newName) }></RenameWindow>)}
    </>)
}

function DriveFolderView() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentFilePreview, setCurrentFilePreview] = useState(null);
    const [currentFileName, setCurrentFileName] = useState("");
    const [currentFileType, setCurrentFileType] = useState("");
    const {folders, setFolders} = useGlobalState();
    const searchString = useSearch();
    const folderPath = searchString.split('&')[0].split('=')[1];
    const actualFolder = folderPath ? decodeURIComponent(folderPath) : "/Cool Art";

    async function populateWeatherData(folder) {
        const response = await fetch('/File/GetFolderData?folder=' + folder);
        if (response.ok) {
            return await response.json();
        }
    }

    const handleFileChanged = async () => {
        const data = await populateWeatherData(actualFolder);
        console.log(data + " " + actualFolder);
        setFolders(data);
    }

    const handleOpen = (file) => {
        switch (file.split('.').at(-1))
        {
            case "jpg":
            case "jpeg":
            case "png":
            case "webp":
            case "gif":
            case "ico":
                setCurrentFileType("Image");
                break;
            case "txt":
                setCurrentFileType("Text");
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
        setCurrentFileName(file);
        setIsOpen(true);
    };

    const handleClose = () => {
        setCurrentFilePreview(null);
        setCurrentFileName("");
        setCurrentFileType("");
        setIsOpen(false);
    };

    useEffect(() => {
        async function loadData() {
            const data = await populateWeatherData(actualFolder);
            console.log(data + " " + actualFolder);
            setFolders(data);
        }
        loadData();
    }, [actualFolder]);

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
                        onClick={(e) => { e.preventDefault(); handleOpen(file.Name) }}
                        className="FileButton"
                    >
                        <div className="LinkHolder" title={file.Name}><img src={dokumenten} alt="folder" style={{ height: "80%", float: "left", marginRight: "10px" }} /><p>{file.Name.replace("\\", "")}</p></div>
                        <div className="LinkPhoto"><img src={dokumenten} alt="file" style={{ height: "85%" }} /></div>
                    </Link>
                ))}
            </div>
            {isOpen && (<FilePreview path={actualFolder + currentFileName} onDivClick={() => handleClose()} image={currentFilePreview} type={currentFileType} handleFileChangingAction={() => handleFileChanged() }></FilePreview>)
            }
            </div>
    );
}

export default DriveFolderView;