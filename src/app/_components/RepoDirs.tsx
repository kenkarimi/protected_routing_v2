import React from 'react';
import Link from 'next/link';

async function fetchRepoContents(name: string) {
    await new Promise((resolve) => setTimeout(resolve, 3000)); //Wait 3 seconds to show suspense boundary.

    const options: object = {
            method: 'GET',
            cache: 'force-cache', //force-cache is the default for NextJs and automatically caches the returned values. Others: default(if fresh, use cache if stale check server if changed, if so, fetch resource from server & update cache), no-store(fetch resource from server without checking if cached version changed, don't update cache), reload(fetch resource from server without checking if cached version changed, but update cache), no-cache(regardless of whether fresh/stale, check server if changed, if not, use cache, if so, fetch resource from server & update cache), only-if-cached(if cached, regardless of whether fresh/stale use cache. if not cached, return 504 gateway timeout error). For sensitive information, always use no-store so its not stored in cache and is always fetched directly from server & ignores cache. For constantly changing information consider using no-cache or use the default force-cache with time-based cache revalidation at short intervals.
            next: {
                revalidate: 60 //cache lifetime of resource in seconds. Not only purges the data cache but also re-fetches every 3600 seconds making sure the user is always seeing the latest version.
            },
        }

    const response = await fetch(`https://api.github.com/repos/kenkarimi/${name}/contents`, options);
    const contents = await response.json();
    return contents;
}

const RepoDirs = async ({ name }: { name: string }) => {
    const contents = await fetchRepoContents(name);
    //console.log(contents); //Logged on your console not browser because this is a server component.

    const dirs: Array<any> = contents.filter((content: any) => content.type === 'dir')

    const dirItems: React.JSX.Element[] = dirs.map((dir) => (
                        <li key={dir.path}>
                            <Link href={`code/repos/${name}/${dir.path}`}>{ dir.path}</Link>
                        </li>
                    ));
    return (
        <div>
            <h4>Directories:</h4>
            <ul> 
                {  dirItems }
            </ul>
        </div>
    )
}

export default RepoDirs;