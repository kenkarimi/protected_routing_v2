import React from 'react';
import Link from 'next/link';

import { AccountRequired } from '@/app/_utils/GlobalEnumerations';
import requireAuthCompositionPattern from '@/app/_utils/RequireAuthCompositionPattern';

/**
 * Applies strictly to server components and requires cache components to be true for this app to work as long as this line is exporting.
 * Opts a route out of Instant Navigations by forcing it to be a blocking route. Introduced as part of the Next.js Route Segment Config options alongside features like cacheComponents.
 * When false, Next.js will completely pause the navigation until the server finishes executing its dynamic data fetching(db queries, uncached fetch calls etc.). The page transition will also block, meaning the user won't see the new page layout or fallbacks until the data is fully ready. 
 * When true, Next.js automatically treats navigations as "instant" using Partial Prefetching. When a user clicks a link, Next.js immediately serves a cached or static visual shell(like layout headers or a <Suspense> fallback) while streaming the remaining dynamic server-side data in the background.
 */
export const instant = true; //default behavour is true even if left out/commented out.

const account_required: AccountRequired = AccountRequired.Any;

async function fetchRepos() {
    await new Promise((resolve) => setTimeout(resolve, 1000)); //Wait 1 second to show loading page.

    const options: object = {
            method: 'GET',
            cache: 'force-cache', //force-cache is the default for NextJs and automatically caches the returned values. Others: default(if fresh, use cache if stale check server if changed, if so, fetch resource from server & update cache), no-store(fetch resource from server without checking if cached version changed, don't update cache), reload(fetch resource from server without checking if cached version changed, but update cache), no-cache(regardless of whether fresh/stale, check server if changed, if not, use cache, if so, fetch resource from server & update cache), only-if-cached(if cached, regardless of whether fresh/stale use cache. if not cached, return 504 gateway timeout error). For sensitive information, always use no-store so its not stored in cache and is always fetched directly from server & ignores cache. For constantly changing information consider using no-cache or use the default force-cache with time-based cache revalidation at short intervals.
            next: {
                revalidate: 60 //cache lifetime of resource in seconds. Not only purges the data cache but also re-fetches every 3600 seconds making sure the user is always seeing the latest version.
            },
        }

    const response = await fetch('https://api.github.com/users/kenkarimi/repos', options);
    const repos = await response.json();

    return repos;
}

const ReposPage = async () => {
    const repos: Array<any> = await fetchRepos();
    //console.log(repos); //Logged on your console not browser because this is a server component.

    const repoItems: React.JSX.Element[] = repos.map( (repo: any) => (
        <li key={repo.name}>
            <Link href={`/code/repos/${repo.name}`}>{repo.name}</Link>
        </li>
    ));

    return(
        <div>
            <h2>My Repos:</h2>
            <ul>
                {repoItems}
            </ul>
        </div>
    )
}

export default requireAuthCompositionPattern(ReposPage, account_required);
