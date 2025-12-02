import { useEffect, useState} from 'react';
import { Link, useSearch } from "wouter";
import { useGlobalState } from "./GlobalState";
import { useErrorHandlerResource } from "./ErrorHandlers.jsx";
import { authFetch } from './AuthWrapper.jsx';
import folderen from './assets/icons8-folder-512.png'
import folderenen from './assets/icons8-folder-64.png'
import dokumenten from './assets/icons9-document-512.png'
import downloaden from './assets/icons8-download-96.png'
import path from "path-browserify";
import './style/App.css';
import './style/inputStyle.css';

function FolderNode({ node, onSelect, selected }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div style={{ marginLeft: "16px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>

                <div
                    style={{
                        cursor: "pointer",
                        color: (selected === node ? "lightBlue" : "white"),
                        marginRight: "8px"
                    }}
                    onClick={() => onSelect(node)}
                >
                    📁 {node.Name}
                </div>

                <div
                    style={{
                        cursor: "pointer",
                        color: "white",
                    }}
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? "⬆️" : "⬇️"}
                </div>

            </div>

            {expanded && node.Subfolders?.length > 0 && (
                <div style={{ marginLeft: "16px" }}>
                    {node.Subfolders.map((sf, i) => (
                        <FolderNode
                            key={i}
                            node={sf}
                            onSelect={onSelect}
                            selected={selected}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function MoveWindow({ curFilePath, handleMoveClose, handleSuccess }) {
    const [folderTree, setFolderTree] = useState(null);
    const [selected, setSelected] = useState(null);

    const loadTree = async () => {
        const res = await authFetch(
            "/api/File/GetFolderPaths?folderPath=" + "/media/pi/Extreme SSD"
        );
        if (res.ok) {
            const json = await res.json();
            setFolderTree(json);
        }
    };

    useEffect(() => {
        loadTree();
    }, []);

    const handleMove = async () => {
        if (!selected) return;

        const fileName = curFilePath.split("/").at(-1);
        const newPath = path.join(selected.FullPath, fileName);

        try {
            const res = await authFetch(
                "/api/File/UpdateFilePath?filePath=" + curFilePath +
                "&newPath=" + newPath,
                { method: "PATCH" }
            );

            if (res.ok) {
                handleSuccess();
                handleMoveClose();
            }
        } catch (err) {
            console.error("Move failed:", err);
        }
    };

    return (
        <>
            <div
                onClick={handleMoveClose}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    zIndex: 1003,
                }}
            ></div>

            <div
                style={{
                    position: "fixed",
                    top: "20vh",
                    left: "30vw",
                    width: "40vw",
                    height: "60vh",
                    backgroundColor: "rgb(30,30,30)",
                    zIndex: 1004,
                    borderRadius: "16px",
                    padding: "20px",
                    color: "white",

                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <h3>Select destination folder</h3>
                
                <div
                    style={{
                        flex: 1,              
                        backgroundColor: "rgb(60,60,60)",
                        borderRadius: "16px",
                        padding: "20px",
                        overflowY: "scroll",

                       
                        scrollbarWidth: "none",      
                        msOverflowStyle: "none",     
                    }}
                    className="no-scrollbar"
                >
                    {!folderTree ? (
                        <p>Loading folders...</p>
                    ) : (
                        <FolderNode node={folderTree} onSelect={setSelected} selected={selected} />
                    )}
                </div>
                
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "20px",
                    }}
                >
                    <button className="Cancel-btn" onClick={handleMoveClose}>
                        Cancel
                    </button>

                    <button className="Save-btn" disabled={!selected} onClick={handleMove}>
                        Move Here
                    </button>
                </div>
            </div>
        </>
    );
}

function RenameWindow({ curFilePath, handleRenameCloseRef, handleSuccess }) {
    let extention = path.extname(curFilePath);

    const [inputValue, setInputValue] = useState(
        path.basename(curFilePath, extention)
    );

    const handleSave = async () => {
        let newPath = path.join(path.dirname(curFilePath), inputValue + extention);

        try {
            const res = await authFetch("/api/File/UpdateFilePath?filePath=" + curFilePath + "&newPath=" + newPath, {
                method: 'PATCH'
            });

            if (!res.ok) {
                useErrorHandlerResource(res.status);
                return;
            }

            handleSuccess(inputValue + extention);
        } catch (error) {
            console.error('Rename failed:', error);
            useErrorHandlerResource(500);
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

function FilePreview({ fileBlob, curFilePath, onDivClick, type, handleFileChangingAction, isLoadingPreview}) {
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [fileName, setFileName] = useState(curFilePath.split('/').at(-1));
    const [isMoveOpen, setIsMoveOpen] = useState(false);
    const [imageScale, setImageScale] = useState(1);

    let errHandler = useErrorHandlerResource();
    
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
        authFetch("/api/File/GetFileBlob?filePath=" + curFilePath)
            .then(res => res.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = curFilePath.split("/").at(-1);
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
    }

    return (
        <>
            {isLoadingPreview && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 3000,
                    color: "white",
                    fontSize: "24px",
                    fontWeight: "bold",
                    backdropFilter: "blur(3px)"
                }}>
                    Loading preview...
                </div>
            )}
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "Calc(100vw - 30px)",
                height: "4vh", 
                backgroundColor: "rgb(30,30,30)",
                display: "flex",
                alignItems: "center",
                padding: "0 15px",
                zIndex: 2000,
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                userSelect: "none"
            }}>
                <img src={dokumenten} alt="file" style={{ height: "70%", marginRight: 10, maxHeight: "80%" }} />
                <p style={{
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer"
                }} onClick={handleRenameOpen}>
                    {fileName}
                </p>

                <div style={{ marginLeft: "auto", display: "flex", gap: "18px" }}>
                    <img src={downloaden} alt="move" style={{ height: "24px", cursor: "pointer" }} onClick={() => setIsMoveOpen(true)} />
                    <img src={downloaden} alt="download" style={{ height: "24px", cursor: "pointer" }} onClick={handleFileDownload} />
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
            {type == "Image" && (
                <img 
                    className="previewImage" 
                    src={fileBlob} 
                    alt="file" 
                    style={{ height: `${85 * imageScale}%`, zIndex: 1002 }} 
                />)}
            {type === "Video" && (
                <video 
                    controls 
                    style={{ Height: "85%", maxWidth: "85%", zIndex: 1002 }}> 
                    <source src={fileBlob} /> 
                    Your browser does not support video playback. 
                </video>)}
            {type === "Audio" && (
                <audio 
                    controls 
                    style={{ width: "40%", zIndex: 1002 }}> 
                    <source src={fileBlob} /> 
                    Your browser does not support audio playback. 
                </audio>)}
            {type === "Text" && (
                <div style={{
                    background: "rgb(30,30,30)",
                    color: "white",
                    padding: "20px",
                    width: "70vw",
                    height: "70vh",
                    overflowY: "auto",
                    borderRadius: "12px",
                    whiteSpace: "pre-wrap",
                    fontFamily: "monospace",
                    zIndex: 1002
                }}>
                    {fileBlob}
                </div>)}
            {type === "Zip" && (
                <div style={{
                    background: "rgb(30,30,30)",
                    color: "white",
                    padding: "20px",
                    width: "60vw",
                    height: "70vh",
                    overflowY: "auto",
                    borderRadius: "12px",
                    fontFamily: "monospace",
                    zIndex: 1002
                }}>
                    <h2>ZIP Content</h2>
                    {Array.isArray(fileBlob) && fileBlob.length > 0 ? (
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>

                            {fileBlob.map((entry, index) => {
                                const displayName = entry.name;
                                
                                const depth = (entry.fullName.match(/\//g) || []).length - (entry.isDirectory ? 1 : 0);

                                return (
                                    <li
                                        key={index}
                                        style={{
                                            marginBottom: "8px",
                                            paddingLeft: `${depth * 20}px`,
                                            display: "flex",
                                            alignItems: "center"
                                        }}
                                    >
                                        {entry.isDirectory ? (
                                            <span style={{ color: "#4FC3F7" }}>
                                    📁 {entry.fullName.split('/').at(-2)}
                                </span>
                                        ) : (
                                            <span>
                                    📄 {entry.name} ({entry.size} bytes)
                                </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>No files found in ZIP.</p>
                    )}
                </div>
            )}
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
            <button
                style={{
                    backgroundColor: "#d3d3d3", 
                    border: "none",
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "bold",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%", 
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onClick={() => setImageScale(prev => Math.max(prev - 0.1, 0.1))}
            >
                -
            </button>
            <span style={{ color: "white", fontWeight: "bold" }}>{Math.round(imageScale * 100)}%</span>
            <button
                style={{
                    backgroundColor: "#d3d3d3", 
                    border: "none",
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "bold",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%", 
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onClick={() => setImageScale(prev => Math.min(prev + 0.1, 3))}
            >
                +
            </button>
        </div>)}

        {isRenameOpen && (<RenameWindow curFilePath={curFilePath} handleRenameCloseRef={() => handleRenameClose()} handleSuccess={newName => handleChangeNameSuccess(newName) }></RenameWindow>)}
        {isMoveOpen && (
            <MoveWindow
                curFilePath={curFilePath}
                handleMoveClose={() => setIsMoveOpen(false)}
                handleSuccess={() => handleFileChangingAction()}
            />)}
        </>)
}

function DriveFolderView() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentFilePreview, setCurrentFilePreview] = useState(null);
    const [currentFileName, setCurrentFileName] = useState("");
    const [currentFileType, setCurrentFileType] = useState("");
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const {folders, setFolders} = useGlobalState();
    const searchString = useSearch();
    const folderPath = searchString.split('&')[0].split('=')[1];
    const actualFolder = folderPath ? decodeURIComponent(folderPath) : "/media/pi/Extreme SSD";
    const [isDragging, setIsDragging] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);


    async function populateWeatherData(folder) {
        const response = await authFetch('/api/File/GetFolderData?folderPath=' + folder);
        if (response.ok) {
            return await response.json();
        }
    }

    const handleFileChanged = async () => {
    const data = await populateWeatherData(actualFolder);
        console.log(data + " " + actualFolder);
        setFolders(data);
    }

    const handlePreviewOpen = (file) => {
        var fullPath = path.join(actualFolder, file)
        setIsLoadingPreview(true);
        
        switch (file.split('.').at(-1))
        {
            case "jpg":
            case "jpeg":
            case "png":
            case "webp":
            case "gif":
            case "ico":
                setCurrentFileType("Image");
                authFetch("/api/File/GetFileBlob?filePath=" + fullPath)
                    .then(res => res.blob())
                    .then(blob => {
                        const url = URL.createObjectURL(blob);
                        setCurrentFilePreview(url);
                        setIsLoadingPreview(false);
                    });
                break;
            case "txt":
            case "md":
            case "json":
            case "csv":
                setCurrentFileType("Text");
                authFetch("/api/File/GetFileBlob?filePath=" + fullPath)
                    .then(res => res.text())
                    .then(text => 
                    {
                        setCurrentFilePreview(text); 
                        setIsLoadingPreview(false);
                    });
                break;
            case "mp3":
            case "wav":
            case "ogg":
            case "flac":
                setCurrentFileType("Audio");
                setCurrentFilePreview("/api/File/GetFileBlob?filePath=" + fullPath);
                setIsLoadingPreview(false);
                break;
            case "mp4":
            case "webm":
            case "mov":
            case "mkv":
            case "avi":
                setCurrentFileType("Video");
                setCurrentFilePreview("/api/File/GetFileBlob?filePath=" + fullPath);
                setIsLoadingPreview(false);
                break;
            case "zip":
                setCurrentFileType("Zip");
                authFetch("/api/File/GetZipContent?filePath=" + fullPath)
                    .then(res => res.json())
                    .then(content => {
                        setCurrentFilePreview(content);
                        setIsLoadingPreview(false);
                    });
                break;
            default:
                setCurrentFileType("Unknown");
                setIsLoadingPreview(false);
                break;
        }
        setCurrentFileName(file);
        setIsOpen(true);
    };

    const handlePreviewClose = () => {
        setCurrentFilePreview(null);
        setCurrentFileName("");
        setCurrentFileType("");
        setIsOpen(false);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => prev + 1);
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => {
            const newCount = prev - 1;
            if (newCount === 0) setIsDragging(false);
            return newCount;
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setDragCounter(0);
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        for (let file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("path", actualFolder); 

            try {
                const uploadRes = await authFetch("/api/File/UploadFile", {
                    method: "POST",
                    body: formData
                });

                if (!uploadRes.ok) {
                    console.error("Upload failed", uploadRes.status);
                }
            } catch (err) {
                console.error("Upload error:", err);
            }
        }
        
        handleFileChanged();
    };

    useEffect(() => {
        async function loadData() {
            const data = await populateWeatherData(actualFolder);
            console.log(data + " " + actualFolder);
            setFolders(data);
        }
        loadData();
    }, [actualFolder]);

    useEffect(() => {
        window.addEventListener("dragenter", handleDragEnter);
        window.addEventListener("dragleave", handleDragLeave);
        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("drop", handleDrop);

        return () => {
            window.removeEventListener("dragenter", handleDragEnter);
            window.removeEventListener("dragleave", handleDragLeave);
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("drop", handleDrop);
        };
    }, [actualFolder]);
    
    if (!folders) {
        return <p>Loading {actualFolder}...</p>;
    }

    return (
        <div>
            <h1>Folder: {actualFolder.split('/').at(-1)}</h1>
            <p style={{color:"RGB(30,30,30)"}}>Path: {actualFolder}</p>
            <div className="appcontainer">
                {folders.Subfolders?.map((folder, i) => (
                    <Link
                        href={`/folder?folder=${encodeURIComponent(actualFolder + folder)}`}
                        key={i}
                        className="FolderButton"
                    >
                        <div className="LinkHolder"><img src={folderenen} alt="folder" style={{ height: "80%", float: "left", marginRight: "10px" }} />{folder.replace("/", "")}</div>
                        <div className="LinkPhoto"><img src={folderen} alt="folder" style={{ height: "85%" }} /></div>

                    </Link>
                ))}

                {folders.Files?.map((file, i) => (
                    <Link
                        key={`file-${i}`}
                        onClick={(e) => { e.preventDefault(); handlePreviewOpen(file.Name) }}
                        className="FileButton"
                    >
                        <div className="LinkHolder" title={file.Name}><img src={dokumenten} alt="folder" style={{ height: "80%", float: "left", marginRight: "10px" }} /><p>{file.Name.replace("/", "")}</p></div>
                        <div className="LinkPhoto"><img src={dokumenten} alt="file" style={{ height: "85%" }} /></div>
                    </Link>
                ))}
            </div>
            {isOpen && (
                <FilePreview 
                    curFilePath={actualFolder + currentFileName} 
                    onDivClick={() => handlePreviewClose()} 
                    fileBlob={currentFilePreview} 
                    type={currentFileType} 
                    handleFileChangingAction={() => handleFileChanged() }
                    isLoadingPreview={isLoadingPreview}>
                </FilePreview>)
            }
            {isDragging && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 5000,
                        color: "white",
                        fontSize: "32px",
                        fontWeight: "bold",
                        border: "4px dashed white"
                    }}
                >
                    Drop files to upload into: {actualFolder}
                </div>
            )}
            </div>
    );
}

export default DriveFolderView;