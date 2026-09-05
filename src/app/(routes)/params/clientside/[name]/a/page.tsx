'use client'

import React, { use } from 'react';

import requireAuthCompositionPattern from '@/app/_utils/RequireAuthCompositionPattern';
import { AccountRequired } from '@/app/_utils/GlobalEnumerations';

/**
 * React's use hook can also technically be used to unwrap promises in server components similar to its use here with use(params)
 * We however don't do so because it's anti-pattern since server components already support async/await. 
 * As such, we stick to using the use() hook client side where async/await isn't supported.
 */

const account_required: AccountRequired = AccountRequired.Any;

const ParamsPageAClientSide = ({ params }: { params: Promise<{ name: string }> }) => { //Can't use async/await in a client component.

    const { name }: { name: string} = use(params);

    return (
        <div>
            <h1>Promise unwrapped using the use() hook client side.</h1>
            <h2>Name: {name}</h2>
        </div>
    )
}

export default requireAuthCompositionPattern(ParamsPageAClientSide, account_required);