import { Link, Route, Switch } from "wouter";
import { useState } from "react";
import DriveFolderView from './DriveFolderView.jsx'
import './App.css';
import { GlobalStateContext } from "./GlobalState";

function App()
{
    const [folders, setFolders] = useState("");

    return (<>
        <GlobalStateContext.Provider value={{ folders, setFolders }}>
            <Switch>
                <Route path="/" component={DriveFolderView} />
                <Route path="/folder" component={DriveFolderView} />
            </Switch>
        </GlobalStateContext.Provider>
    </>)
}

export default App;