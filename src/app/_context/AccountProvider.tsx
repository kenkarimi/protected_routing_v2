'use client'

import React, { useState, createContext } from 'react';

import { Account } from '../_utils/GlobalInterfacesAndTypes';

interface DecodedClaims {
    decodedClaims: Account; //Account as the type instead of object.
    setDecodedClaims: React.Dispatch<React.SetStateAction<Account>>;
}

export const AccountContext: React.Context<DecodedClaims> = createContext<DecodedClaims>({
    decodedClaims: { //instead of an empty object, we now have to fulfill the conditions of the 'Account' type.
        logged_in: false,
        account_type: null,
        email: ''
    },
    setDecodedClaims: () => {}
});

const AccountProvider = ({ children }: { children: React.ReactNode }) => {

    const [decodedClaims, setDecodedClaims] = useState<Account>({
        logged_in: false,
        account_type: null,
        email: ''
    });

    return (
        <AccountContext.Provider value={{ decodedClaims, setDecodedClaims}}>
            { children }
        </AccountContext.Provider>
    )
}

export default AccountProvider;