'use client'

import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

import { AccountContext } from '../_context/AccountProvider';
import { Account } from '../_utils/GlobalInterfacesAndTypes';

interface DecodedClaims {
  decodedClaims: Account; //Account as the type instead of object.
  setDecodedClaims: React.Dispatch<React.SetStateAction<Account>>;
}

const Header = () => {

  const { decodedClaims, setDecodedClaims } = useContext<DecodedClaims>(AccountContext);

  useEffect(() => { //componentDidMount.
    console.log('HEADER', decodedClaims);
    /**
     * The decoded_claims object cookie that we set at login only persists in the Context API state as long as navigation is made via the Next.js router.
     * Upon a page being refreshed/reloaded or a route being accessed via the url being entered directly/manually to the browser, decoded_claims is no longer accessible via the context api.
     * To counter this, we retrieve it from the cookie here to persist it to the Context API as a contingency for these two scenarios.
     * The header is an especially good place for doing this because it appears in every route(see root layout.tsx file). The only other component that would be even remotely suitable for this is the requireAuth HOC although that would only apply for routes that require access control.
     * This way, the header and body don't look logged out on refresh or manual navigation, in contrast with the middleware/proxy, which has access to the decoded_claims cookie directly via the request object and doesn't have to rely on the Context API.
     */
    let cookie_value_stringified: string | undefined = Cookies.get('decoded_claims');

    if(cookie_value_stringified === undefined) return;

    const cookie_value: Account = JSON.parse(cookie_value_stringified);
    setDecodedClaims(cookie_value);
  }, []);

  return (
    <header>
        <div className="container">
            <div className="logo">API Demo</div>
        </div>
        <ul>
          <li hidden={!decodedClaims.logged_in}><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/about/team">Team</Link></li>
          <li hidden={!decodedClaims.logged_in}><Link href="/code/repos">Repos</Link></li>
          <li hidden={!decodedClaims.logged_in}><Link href="/caching/todos">Todos</Link></li>
          <li hidden={!decodedClaims.logged_in}><Link href="/caching/todos/add">Add Todo</Link></li>
          <li hidden={!decodedClaims.logged_in || decodedClaims.account_type !== 'customer'}><Link href="/content/customers">Customer Content</Link></li>
          <li hidden={!decodedClaims.logged_in || decodedClaims.account_type !== 'investor'}><Link href="/content/investors">Investor Content</Link></li>
          <li hidden={!decodedClaims.logged_in}><Link href="/params/clientside/jondoe/a">Client-Side Params(A)</Link></li>
          <li hidden={!decodedClaims.logged_in}><Link href="/params/clientside/jondoe/b">Client-Side Params(B)</Link></li>
          <li hidden={!decodedClaims.logged_in}><Link href="/params/serverside/jondoe">Server-Side Params</Link></li>
          <li hidden={!decodedClaims.logged_in}><Link href="/search_params/clientside/a?name=jondoe">Client-Side Search Params(A)</Link></li>
          <li hidden={!decodedClaims.logged_in}><Link href="/search_params/clientside/b?name=jondoe">Client-Side Search Params(B)</Link></li>
          <li hidden={!decodedClaims.logged_in}><Link href="/search_params/serverside/a?name=jondoe">Server-Side search Params(A)</Link></li>
          <li hidden={decodedClaims.logged_in}><Link href="/login">Log In</Link></li>
          <li hidden={!decodedClaims.logged_in}><Link href="/logout">Log Out</Link></li>
        </ul>
    </header>
  )
}

export default Header;
