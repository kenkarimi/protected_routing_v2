'use client'

import React from 'react';
import { useSearchParams } from 'next/navigation';

import requireAuthCompositionPattern from '@/app/_utils/RequireAuthCompositionPattern';
import { AccountRequired } from '@/app/_utils/GlobalEnumerations';

const account_required: AccountRequired = AccountRequired.Any;

const SearchParamsPageBClientSide = () => {

    const searchParams = useSearchParams(); //Or simply useSearchParams();

    let name: string | null = ''; //search params HAVE to be of type string | null. URL search parameters always store values as strings. No numbers, no booleans.
    if(searchParams.has('name')) { //Not a must to use the has() method because search params are required to have an alt type e.g. string | null.
        name = searchParams.get('name');
    }

    return (
        <div>
            <h1>Promise unwrapped using the useSearchParams() hook client side.</h1>
            <h2>Name: {name}</h2>
        </div>
    )
}

export default requireAuthCompositionPattern(SearchParamsPageBClientSide, account_required);