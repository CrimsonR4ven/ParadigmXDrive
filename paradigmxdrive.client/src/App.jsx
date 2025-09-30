import { Link, Route, Switch, useLocation } from "wouter";
import { useState } from "react";
import DriveFolderView from './DriveFolderView.jsx'
import './App.css';
import './BaseSiteStyle.css'
import { GlobalStateContext } from "./GlobalState";

function App()
{
    const [folders, setFolders] = useState("");
    const [location] = useLocation();

    return (<>
        <div className="Logo">
        </div>
        <div className="TopNavContainer">
            <div className={`${location === "/" ? "active" : ""}`}><Link href="/" className={`${location === "/" ? "active" : ""}`}>x</Link></div>
            <div className={`${location === "/sa" ? "active" : ""}`}><Link href="/sa" className={`${location === "/sa" ? "active" : ""}`}>y</Link></div>
            <div className={`${location === "/as" ? "active" : ""}`}><Link href="/as" className={`${location === "/as" ? "active" : ""}`}>z</Link></div >
        </div>
        <div className="SideNavContainer">
        </div>
        <div className="ContentBox scrollable">
        <GlobalStateContext.Provider value={{ folders, setFolders }}>
            <Switch>
                <Route path="/" component={DriveFolderView} />
                <Route path="/folder" component={DriveFolderView} />
            </Switch>
            </GlobalStateContext.Provider>
        </div>
    </>)
}

export default App;