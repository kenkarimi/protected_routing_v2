import React from 'react';

async function fetchRepo(name: string) {
    const options: object = {
            method: 'GET',
            cache: 'force-cache', //force-cache is the default for NextJs and automatically caches the returned values. Others: default(if fresh, use cache if stale check server if changed, if so, fetch resource from server & update cache), no-store(fetch resource from server without checking if cached version changed, don't update cache), reload(fetch resource from server without checking if cached version changed, but update cache), no-cache(regardless of whether fresh/stale, check server if changed, if not, use cache, if so, fetch resource from server & update cache), only-if-cached(if cached, regardless of whether fresh/stale use cache. if not cached, return 504 gateway timeout error). For sensitive information, always use no-store so its not stored in cache and is always fetched directly from server & ignores cache. For constantly changing information consider using no-cache or use the default force-cache with time-based cache revalidation at short intervals.
            next: {
                revalidate: 60 //cache lifetime of resource in seconds. Not only purges the data cache but also re-fetches every 3600 seconds making sure the user is always seeing the latest version.
            },
        }

    const response = await fetch(`https://api.github.com/repos/kenkarimi/${name}`, options);
    const repo = await response.json();
    return repo;
}
const Repo = async ({ name }: { name: string }) => {
    const repo = await fetchRepo(name);
    //console.log(repo); //Logged on your console not browser because this is a server component.

    return (
        <div>
            <h4>{ repo.name }</h4>
            <p>{ repo.description }</p>
            <p>Stargazers: { repo.stargazers_count}</p>
            <p>Forks: { repo.forks_count}</p>
            <p>Watchers: { repo.watchers_count}</p>
        </div>
    )
}

export default Repo