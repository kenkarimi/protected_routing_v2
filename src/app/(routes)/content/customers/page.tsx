import React from 'react';
import { Metadata } from 'next';
import { headers, cookies } from 'next/headers'; //only works in Server Components.

import Home from './../../../page';
import { AccountRequired } from '@/app/_utils/GlobalEnumerations'; //exported within curly brackets because it's not a default export but an named one, which is necessary in order to be able to access .Any, .Customer, .Inestor below.
import requireAuthCompositionPattern from '@/app/_utils/RequireAuthCompositionPattern';

/**
 * Applies strictly to server components and requires cache components to be true for this app to work as long as this line is exporting.
 * Opts a route out of Instant Navigations by forcing it to be a blocking route. Introduced as part of the Next.js Route Segment Config options alongside features like cacheComponents.
 * When false, Next.js will completely pause the navigation until the server finishes executing its dynamic data fetching(db queries, uncached fetch calls etc.). The page transition will also block, meaning the user won't see the new page layout or fallbacks until the data is fully ready. 
 * When true, Next.js automatically treats navigations as "instant" using Partial Prefetching. When a user clicks a link, Next.js immediately serves a cached or static visual shell(like layout headers or a <Suspense> fallback) while streaming the remaining dynamic server-side data in the background.
 */
export const instant = true; //default behavour is true even if left out/commented out.

const metadata: Metadata = {
    title: 'Customer Content'
}

const account_required: AccountRequired = AccountRequired.Customer; //can also be typed as 'number' since it's a numbered enum.

const CustomersPage = async () => { //We can use async-await because it's a server component.

    /**
     * The headers() function below from next/headers can only be used in a server component such as this one. This function returns a read-only web headers object that allows you to access headers from incoming requests.
     * As such when sending a response from middelware to a RSC or client component, use cookies instead.
     */
    let headers_list: any = await headers(); //ReadonlyHeaders is unresolved so use any as type. Also, 'headers' are reserved variables use header_list, myHeaders etc.

    if(headers_list.has('x-message-from-middleware')) { //returns true or false.
        let message_header: string = headers_list.get('x-message-from-middleware');
        console.log('/content/customers ReadonlyHeaders', message_header);
    } else {
        console.log('/content/customers ReadonlyHeaders', 'header not available.');
    }

    let cookies_list: any = await cookies(); //ReadonlyRequestCookies is unresolved so use any as type. Also, 'cookies' is a reserved variable use cookies_list, myCookies etc.

    if(cookies_list.has('next_response_cookie')) {
        let cookie = cookies_list.get('next_response_cookie');
        console.log('/content/customers cookie', cookie);
        let cookie_name = cookie.name;
        console.log('/content/customers cookie_name', cookie_name);
        let cookie_value = cookie.value;
        console.log('/content/customers cookie_value', cookie_value);
    } else {
        console.log('/content/customers cookie', 'Cookie not available or has expired');
    }

    return (
        <div>
            <h1>Customer content</h1>
            <p>You should only be able to see this page if you're logged in.</p>
            <p>Additionally, this content can only be seen by customers.</p>
            <Home message={'This is how extra props can be passed to a component which itself is being passed to a higher order component. The props have to be received by the HOC as well and passed down with the component using the spread operator. This also shows that a route component can be embeded/imported and rendered from another route component(still has to follow composition pattern rules from react docs).'} />
        </div>
    )
}

export default requireAuthCompositionPattern(CustomersPage, account_required);
