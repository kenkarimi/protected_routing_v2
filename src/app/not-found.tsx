import React from 'react';

const NotFound = () => { //Speacial file that allows for creation fo a custom 404 page. Remember. Function component name can't be 404 cause it's a number.
  return (
    <div>
        <h1>404</h1>
        <p>Page not found.</p>
    </div>
  )
}

export default NotFound;