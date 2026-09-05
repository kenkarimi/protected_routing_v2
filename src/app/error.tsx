'use client'

import React, { useEffect } from 'react';

const Error = ({ error, reset }: { error: Error, reset: () => void }) => { //For app/page.tsx files.

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    /**
     * The root app/error.js boundary does not catch errors thrown in the root app/layout.js or app/template.js component. For that, you would need to use app/global-error.js
     * The reset button is important because many errors are caused by temporary outages. It attempts to rerender the child components to this route.
     * Apart from the 'throw Error' in app/page.tsx, another way to test this is by commenting out 'use client' in a page.tsx that's supposed to have it.
     */
    return (
        <div>
            <h2>Something went wrong!</h2>
            <p>{error.message}</p>
            <button onClick={() => reset()}>Try again</button>
        </div>
    )
}

export default Error;