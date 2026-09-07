import type { Metadata } from "next";

import AccountProvider from "./_context/AccountProvider";
import Header from "./_components/Header";
import "./globals.css"; //Occasional error on this line on new projects happens because a particular version of typescript is unable to resolve CSS files due to a conflict between local configuration and a strict typescript version update. To fix it, manually create a globals.d.ts file at root level as seen in this project and make sure it's included in the "include" key in the file tsconfig.json

/**
 * Applies strictly to server components and requires cache components to be true for this app to work as long as this line is exporting.
 * Enable Cache Components in next.config.ts. If file extension is next.config.js you can change it to .ts in order to use typescript for typechecking, but make sure .ts is included in the "include" key of your tsconfig.json
 * Opts a route out of Instant Navigations by forcing it to be a blocking route. Introduced as part of the Next.js Route Segment Config options alongside features like cacheComponents.
 * When false, Next.js will completely pause the navigation until the server finishes executing its dynamic data fetching(db queries, uncached fetch calls etc.). The page transition will also block, meaning the user won't see the new page layout or fallbacks until the data is fully ready. 
 * When true, Next.js automatically treats navigations as "instant" using Partial Prefetching. When a user clicks a link, Next.js immediately serves a cached or static visual shell(like layout headers or a <Suspense> fallback) while streaming the remaining dynamic server-side data in the background.
 */
export const instant = true; //default behavour is true even if left out/commented out.

export const metadata: Metadata = {
  title: "API Demo",
  description: "Explores how to work with an api in Next.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AccountProvider>
          <Header />
          <main>{children}</main>
        </AccountProvider>
      </body>
    </html>
  );
}
