

function ErrorView({errcode = null}) {
    let message = "";
    switch (errcode) {
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
            break;
    }
    return (
        <>
            <div className="error-screen">
                <div className="error-box">
                    <h1>⚠️ Error {errcode}</h1>
                    <p>{message}</p>
                </div>
            </div>
        </>
    )
}

export default ErrorView;