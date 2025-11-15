import {useLocation} from "wouter";
import './style/ErrorStyle.css';

export function useErrorHandlerCritical() {
    const [, setLocation] = useLocation();

    return (code) => {
        switch (code) {
            case 400:
                setLocation("/error/400");
                break;
            case 404:
                setLocation("/error/404");
                break;
            case 500:
                setLocation("/error/500");
                break;
            default:
                setLocation("/error");
        }
    };
}

export function useErrorHandlerResource() {
    let message = "";
    switch (code) {
        case 401:
            message = "Error 401: Authentication Failed";
            break;
        case 404:
            message = "Error 404: Resource not found";
            break;
        case 500:
            message = "Error 500: Server error";
            break;
        default:
            message = "Error: Something went wrong, try refreshing the site";
    }
    
    return (
        <>
            <div className="error-stripe">
                ⚠️ {message}
            </div>
        </>);
}