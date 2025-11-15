import { Link, Route, Switch, useLocation } from "wouter";
import { useState } from "react";
import DriveFolderView from './DriveFolderView.jsx'
import ErrorView from './ErrorView.jsx'
import './style/App.css';
import './style/BaseSiteStyle.css'
import { GlobalStateContext } from "./GlobalState";

function App()
{
    const [folders, setFolders] = useState("");
    const [location] = useLocation();

    return (<>
        <div className="Logo">
        </div>
        <div className="TopNavContainer">
            <div className={`${location == "/" || location == "/folder" ? "active" : ""}`}><Link href="/" className={`${location === "/" || location == "/folder" ? "active" : ""}`}>x</Link></div>
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
                <Route path="/error" component={ErrorView} />
                <Route path="/error/:errcode">params => <ErrorView errcode={params.errcode}/></Route>
            </Switch>
            </GlobalStateContext.Provider>
        </div>
    </>)
}

export default App;