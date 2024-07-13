import React from 'react';

const NotFoundPage = () => {
    return (
        <>
            <div className="container text-center mt-5">
                <h1 className="display-4 text-danger" style={{fontFamily: 'Fredoka One, sans-serif'}}>404
                    - Not Found</h1>
                <p className="lead">Sorry, the page you are looking for does not exist.</p>
            </div>

        </>
    );
};

export default NotFoundPage;
