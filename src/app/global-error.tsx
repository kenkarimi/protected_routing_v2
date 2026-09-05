'use client'

import React, { useEffect } from 'react';

const GlobalError = ({ error, reset }: { error: Error, reset: () => void }) => { //For app/layout & app/template.tsx files.

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    /**
     * The root app/error.js boundary does not catch errors thrown in the root app/layout.js or app/template.js component. For that, you would need to use this app/global-error.js
     * The reset button is important because many errors are caused by temporary outages. It attempts to rerender the child components to this route.
     */
    return (
        <div>
            <h2>Something went wrong!</h2>
            <p>{error.message}</p>
            <button onClick={() => reset()}>Try again</button>
        </div>
    )
}

export default GlobalError;