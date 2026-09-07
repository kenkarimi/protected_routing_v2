import React from 'react';
import type { Metadata } from 'next';

/**
 * Applies strictly to server components and requires cache components to be true for this app to work as long as this line is exporting.
 * Enable Cache Components in next.config.ts. If file extension is next.config.js you can change it to .ts in order to use typescript to type-check the configuration, but make sure .ts is included in the "include" key of your tsconfig.json
 * Opts a route out of Instant Navigations by forcing it to be a blocking route. Introduced as part of the Next.js Route Segment Config options alongside features like cacheComponents.
 * When false, Next.js will completely pause the navigation until the server finishes executing its dynamic data fetching(db queries, uncached fetch calls etc.). The page transition will also block, meaning the user won't see the new page layout or fallbacks until the data is fully ready. 
 * When true, Next.js automatically treats navigations as "instant" using Partial Prefetching. When a user clicks a link, Next.js immediately serves a cached or static visual shell(like layout headers or a <Suspense> fallback) while streaming the remaining dynamic server-side data in the background.
 */
export const instant = true; //default behavour is true even if left out/commented out.

export const metadata: Metadata = {
    title: "About"
}

const AboutLayout = ({ children }: { children: React.ReactNode }) => {
  //throw new Error('Error handling with global-error.tsx works.'); //To test how global-error.tsx works in layout.tsx or template.tsx files.

  return (
    <div>
        <h1>LOADING FROM about/layout.tsx</h1>
        { children }
    </div>
  )
}

export default AboutLayout;
