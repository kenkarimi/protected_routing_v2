//'use client' //For testing purposes. Remove comment to test if server components(Repo, RepoDirs) can be imported in client components and the interersting edge case that leads to it being possible here provided you're using Next.js 14. A comment on this is written within the suspense boundary below.

import React, { Suspense, /*use*/ } from 'react';
//import { useParams } from 'next/navigation';
import Link from 'next/link';

import Repo from '@/app/_components/Repo';
import RepoDirs from '@/app/_components/RepoDirs';
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

//IF SERVER COMPONENT:
const RepoPage = async ({ params }: { params: Promise<{ name: string }> }) => { //We can use async-await because it's a server component.
//IF CLIENT COMPONENT Alternative method (a):
//const RepoPage = ({ params }: { params: Promise<{ name: string }> }) => { //We can NOT use async-await because it's a client component.
//IF CLIENT COMPONENT Alternative method (b):
//const RepoPage = () => {

    //IF SERVER COMPONENT:
    const { name }: { name: string } = await params; //Using params to get a dynamic id.
    //IF CLIENT COMPONENT: There are two alternatives:
    //a)
    //const { name }: { name: string } =  use(params); //NOTE: Import "use" hook from react above.
    //b)
    //const { name }: { name: string } = useParams<{ name: string}>(); //"useParams" is a hook from next/navigation unlike "use" which is from react.

    //NB: You'll have to comment out Repo and RepoDirs below in order to test the client component alternatives above.
    return (
        <div>
            <br/>
            <br/>
            <Link href="/code/repos">Back To Repositories</Link>
            <p>Details of this repository: <b>{ name }</b></p>
            <br/>
            {/**
             * 
             * <Repo /> loads quickly while data is fetched as no timeout is used to artificially delay it.
             * <RepoDirs/> on the other hand takes three seconds to load while data is fetched due to a timeout.
             * Without the use of a suspense boundary, rendering of the entire page would be delayed while loading.tsx renders awaiting for all the components to finish fetching.
             * By separating <Repo /> and <RepoDirs /> each with their own suspense boundaries, we avoid using loading.tsx.
             * In this case, the <Header /> and the tags above, including "Back To Repositories" and "Details of this repository" renders first.
             * <Repo /> renders second almost instanteneosly after its done fetching its data. The fallback never shows because of how quickly this component renders.
             * <RepoDirs /> renders last after the Suspense fallback shows for three seconds before the component appears.
             * This way, we don't hold up the whole page because of one request from one component.
             */}
            {/**
             * Bceause this is a server component(uncomment 'use client' above for this test) being imported and nested inside a client component, which is illegal,
             * Next.js tries to convert Repo/RepoDirs from a server to a client component.
             * This should work provided that said server component doesn't use any server-only features or dependencies. e.g. async-await, which can only be used in server components, not client components.
             * In our case, both <Repo /> and <RepoDirs /> use async-await, which means they can't be converted from server to client components by Next.js
             * The only correct way to nest a server component inside a client component is to pass it as children or props.
             * NOTE: In Next.js v19(This project was done with Next.js v14) This no longer works because it leads to a runtime error.
             * This is because client components cannot be async in v19 as async/await is not supported in Client Components(Both Repo & RepoDirs use async await here.)
             */}
            <Suspense fallback={<div>Loading repo details...</div>}>
                <Repo name={name} />
            </Suspense>
            <Suspense fallback={<div>Loading repo directories...</div>}>
                <RepoDirs name={name} />
            </Suspense>
        </div>
    )
}

export default requireAuthCompositionPattern(RepoPage, account_required);
