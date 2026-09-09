import React from 'react';

import requireAuthCompositionPattern from '@/app/_utils/RequireAuthCompositionPattern';
import { AccountRequired } from '@/app/_utils/GlobalEnumerations';

/**
 * Applies strictly to server components and requires cache components to be true for this app to work as long as this line is exporting.
 * Enable Cache Components in next.config.ts. If file extension is next.config.js you can change it to .ts in order to use typescript to type-check the configuration, but make sure .ts is included in the "include" key of your tsconfig.json
 * Opts a route out of Instant Navigations by forcing it to be a blocking route. Introduced as part of the Next.js Route Segment Config options alongside features like cacheComponents.
 * When false, Next.js will completely pause the navigation until the server finishes executing its dynamic data fetching(db queries, uncached fetch calls etc.). The page transition will also block, meaning the user won't see the new page layout or fallbacks until the data is fully ready. 
 * When true, Next.js automatically treats navigations as "instant" using Partial Prefetching. When a user clicks a link, Next.js immediately serves a cached or static visual shell(like layout headers or a <Suspense> fallback) while streaming the remaining dynamic server-side data in the background.
 * NB: This export only applies to valid Next.js route entry points(page.tsx, route.tsx, layout.tsx). It never applies to standalone embedded or nested components (e.g., custom Button.tsx or Header.tsx), even if those are Server Components.
 */
export const instant = true; //default behavour is true even if left out/commented out.

const account_required: AccountRequired = AccountRequired.Any;

const ParamsPageServerSide = async ({ params }: { params: Promise<{ name: string }> }) => { //Async/await can only be used in server components.

    const { name }: { name: string} = await params;

    return (
        <div>
            <h1>Promise unwrapped using async/await server side.</h1>
            <h2>Name: {name}</h2>
        </div>
    )
}

export default requireAuthCompositionPattern(ParamsPageServerSide, account_required);