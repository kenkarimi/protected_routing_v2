'use client'

import React from 'react';
import { useParams } from 'next/navigation';

import requireAuthCompositionPattern from '@/app/_utils/RequireAuthCompositionPattern';
import { AccountRequired } from '@/app/_utils/GlobalEnumerations';

const account_required: AccountRequired = AccountRequired.Any;

const ParamsPageBClientSide = () => {

    const { name }: { name: string } = useParams<{ name: string }>(); //Or simply useParams();

    return (
        <div>
            <h1>Promise unwrapped using the useParams() hook client side.</h1>
            <h2>Name: {name}</h2>
        </div>
    )
}

export default requireAuthCompositionPattern(ParamsPageBClientSide, account_required);