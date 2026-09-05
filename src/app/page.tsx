import React from 'react';

import { AccountRequired } from './_utils/GlobalEnumerations';
import requireAuthCompositionPattern from './_utils/RequireAuthCompositionPattern';
import styles from './page.module.css';

/**
 * Applies strictly to server components and requires cache components to be true for this app to work as long as this line is exporting.
 * Opts a route out of Instant Navigations by forcing it to be a blocking route. Introduced as part of the Next.js Route Segment Config options alongside features like cacheComponents.
 * When false, Next.js will completely pause the navigation until the server finishes executing its dynamic data fetching(db queries, uncached fetch calls etc.). The page transition will also block, meaning the user won't see the new page layout or fallbacks until the data is fully ready. 
 * When true, Next.js automatically treats navigations as "instant" using Partial Prefetching. When a user clicks a link, Next.js immediately serves a cached or static visual shell(like layout headers or a <Suspense> fallback) while streaming the remaining dynamic server-side data in the background.
 */
export const instant = true; //default behavour is true even if left out/commented out.

const account_required: AccountRequired = AccountRequired.Any;

const Home = (props: { message: string }) => {
  //throw new Error('Error handling with error.tsx works.'); //To test how error.tsx works in app/page.tsx files.

  return (
    <div className={styles.title_container}>
      <p>You should only be able to see this page if you're logged in.</p>
      <h1 className={styles.title}>{ props.message ? props.message : 'No message available because the message prop is only passed from /content/customers or /content/investors where <Home /> is embeded with extra props.' }</h1>
    </div>
  )
}

export default requireAuthCompositionPattern(Home, account_required);
