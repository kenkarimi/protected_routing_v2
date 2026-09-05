'use client'

import React, { useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { AccountContext } from '../../_context/AccountProvider';
import { Account } from '../../_utils/GlobalInterfacesAndTypes';

interface DecodedClaims {
  decodedClaims: Account; //Account as the type instead of object.
  setDecodedClaims: React.Dispatch<React.SetStateAction<Account>>;
}

const LogoutPage = () => {

    const { decodedClaims, setDecodedClaims } = useContext<DecodedClaims>(AccountContext);
    const router = useRouter();

    useEffect( () => { //Runs when the component mounts.
        setDecodedClaims({
            logged_in: false,
            account_type: null,
            email: ''
        });
    }, []);

    useEffect( () => {
        if(decodedClaims.logged_in && decodedClaims.account_type !== null) return;  //We only want to remove the cookie after setDecodedClaims is done logging us out.

        Cookies.remove('decoded_claims'); //default attributes were used in configuration object when the cookie was set({path: '/'}) so no need to include it when deleting the cookie.
        //IMPORTANT! When deleting a cookie and you're not relying on the default attributes, you must pass the exact same path and domain attributes that were used to set the cookie. This rule doesn't apply to the expires attribute. You can have it as we currently do.

        router.replace('/login'); //redirect to /login without adding to browser history.
    }, [decodedClaims]);

    return (
        <></>
    )
}

export default LogoutPage;