'use client'

import React, { useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { AccountContext } from '@/app/_context/AccountProvider'; //Using module path aliases for deeply nested project files.
import { AccountType, Account } from '@/app/_utils/GlobalInterfacesAndTypes';

interface DecodedClaims {
  decodedClaims: Account; //Account as the type instead of object.
  setDecodedClaims: React.Dispatch<React.SetStateAction<Account>>;
}

const LoginPage = () => {

    const { decodedClaims, setDecodedClaims } = useContext<DecodedClaims>(AccountContext);
    const router = useRouter();

    useEffect( () => {
        if(!decodedClaims.logged_in && decodedClaims.account_type === null) return;
        console.log('logged_in', decodedClaims.logged_in);
        console.log('account_type', decodedClaims.account_type);

        //path, maxAge, expires & domain are configuration choices & are optional(you can ommit the object as one of the parameters of Cookies.set()). '/' will be the default path in that case, allowing all paths to have access to the cookie( set & get).
        Cookies.set('decoded_claims', JSON.stringify(decodedClaims), {
            path: '/',
            expires: new Date('2027-09-30') //Can be date interface or milliseconds.
        }); //cookies can only store string values.

        /**
         * NB: The path option('/') is used in this case to allow the program to access the cookie from any location when the response is sent to the client.
         * '/' is the default path even if the configuration choices object is ommited. Since '/login' is a child path of '/', it allows us to set and read the cookie here.
         * But if the path of the cookie were to be changed to e.g. '/about', not only would we not be able to read the cookie from non child paths such as '/content', we also wouldn't be able to set the cookie here in '/login' since we're specifying it as a cookie for the '/about' path and its children.
         */

        router.replace('/'); //Go to home. Unlike router.push, replaces '/login' without pushing '/' as a new entry to the browsers history array.
    }, [decodedClaims]);

    const handleLogIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, account_type: AccountType) => {
        e.preventDefault();
        console.log('Handling log in: ', account_type);
        setDecodedClaims({
            logged_in: true,
            account_type: account_type,
            email: 'jondoe@gmail.com'
        });
    }
    return (
        <div>
            <h1>Log in here. You are currently logged out!</h1>
            <button onClick={(e) => handleLogIn(e, 'customer')}>Log in as customer</button>
            <button onClick={(e) => handleLogIn(e, 'investor')}>Log in as investor</button>
            <br/>
            <p> Logged In: {`${decodedClaims.logged_in}`} &nbsp; Account type {`${decodedClaims.account_type}`}</p>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    )
}

export default LoginPage;