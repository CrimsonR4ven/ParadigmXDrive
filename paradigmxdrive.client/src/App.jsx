import { Link, Route, Switch, useLocation } from "wouter";
import { useState } from "react";
import DriveFolderView from './DriveFolderView.jsx'
import ErrorView from './ErrorView.jsx'
import Login from './Login.jsx'
import { ProtectedRoute, useAuth, logout } from './AuthWrapper.jsx'
import './style/App.css';
import './style/BaseSiteStyle.css'
import { GlobalStateContext } from "./GlobalState";

function App()
{
    const [folders, setFolders] = useState("");
    const [location] = useLocation();
    const { isAuthenticated, username } = useAuth();

    if (location === '/login') {
        return <Login />;
    }
    
    return (<>
        <div className="Logo">
        </div>
        <div className="TopNavContainer">
            <div className={`${location == "/" || location == "/folder" ? "active" : ""}`}><Link href="/" className={`${location === "/" || location == "/folder" ? "active" : ""}`}>x</Link></div>
            <div className={`${location === "/sa" ? "active" : ""}`}><Link href="/sa" className={`${location === "/sa" ? "active" : ""}`}>y</Link></div>
            <div className={`${location === "/as" ? "active" : ""}`}><Link href="/as" className={`${location === "/as" ? "active" : ""}`}>z</Link></div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'whitesmoke', fontSize: '14px' }}>
                        {username}
                    </span>
                <button
                    onClick={logout}
                    style={{
                        padding: '5px 15px',
                        backgroundColor: 'rgb(220, 38, 38)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
        <div className="SideNavContainer">
        </div>
        <div className="ContentBox scrollable">
        <GlobalStateContext.Provider value={{ folders, setFolders }}>
            <Switch>
                <Route path="/">
                    <ProtectedRoute>
                        <DriveFolderView />
                    </ProtectedRoute>
                </Route>
                <Route path="/folder">
                    <ProtectedRoute>
                        <DriveFolderView />
                    </ProtectedRoute>
                </Route>
                <Route path="/error" component={ErrorView} />
                <Route path="/error/:errcode">params => <ErrorView errcode={params.errcode}/></Route>
            </Switch>
            </GlobalStateContext.Provider>
        </div>
    </>)
}

export default App;