import { Link, Route, Switch, useLocation, useRoute } from "wouter";
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

    const [match, params] = useRoute("/error/:errcode", location);

    if (match) {
        return <ErrorView errcode={params.errcode} />;
    }

    if (location === '/login') {
        return <Login />;
    }
    
    return (<>
        <div className="Logo">
        </div>
        <div className="TopNavContainer">
            <div className={`${location == "/" || location == "/folder" ? "active" : ""}`}><Link href="/" className={`${location === "/" || location == "/folder" ? "active" : ""}`}>x</Link></div>
            <div className={`${location === "/kanban" ? "active" : ""}`}><Link href="/kanban" className={`${location === "/kanban" ? "active" : ""}`}>y</Link></div>
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
        <div className="SideNavContainer" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '10px 0'
        }}>
            <Switch>
                <Route path="/kanban">
                    <Link href="/kanban">
                        <div style={{
                            width: '100%',
                            height: '5vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            borderRadius: '0 16px 16px 0',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '20px'
                        }}>
                            📋
                        </div>
                    </Link>
                </Route>
                <Route>
                    <Link href="/folder">
                        <div style={{
                            width: '100%',
                            height: '5vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            borderRadius: '0 16px 16px 0',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '20px'
                        }}>
                            📁
                        </div>
                    </Link>
                </Route>
            </Switch>
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
                <Route path="/kanban">
                    <ProtectedRoute>
                        <DriveFolderView />
                    </ProtectedRoute>
                </Route>
            </Switch>
            </GlobalStateContext.Provider>
        </div>
    </>)
}

export default App;