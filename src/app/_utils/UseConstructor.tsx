'use client'

import React, { useRef } from 'react';
//Custom hook(a javascript function whose name starts with ”use” and that may call other hooks).
const useConstructor: ((callback: () => void) => void) = (callback = () => {}) => {

    const has_been_called: React.MutableRefObject<boolean> = useRef<boolean>(false);

    if(has_been_called.current) return;
    callback();
    
    has_been_called.current = true;
}

export default useConstructor;