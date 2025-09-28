import { Link, Route, Switch } from "wouter";
import DriveFolderView from './DriveFolderView.jsx'
import './App.css';

const App = () => (
    <>
        <Switch>
            <Route path="/" component={DriveFolderView} />
            <Route path="/folder" component={DriveFolderView} />
        </Switch>
    </>
);

export default App;