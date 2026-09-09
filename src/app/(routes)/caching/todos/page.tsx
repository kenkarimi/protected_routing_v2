import React from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import Link from 'next/link';

import requireAuthCompositionPattern from '@/app/_utils/RequireAuthCompositionPattern';
import { AccountRequired } from '@/app/_utils/GlobalEnumerations';
import { Todo } from '@/app/_utils/GlobalInterfacesAndTypes';

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

async function fetchTodos() {
    'use cache'
    cacheLife('hours'); //time-based revalidation.
    cacheTag('my-todos');
    const options: object = {
        method: 'GET',
        headers: {
            Accept: 'application/json' //Because we get back an array of objects.
        }
    }
    const response: Response = await fetch('https://jsonplaceholder.typicode.com/todos', options);
    const todos: Array<Todo> = await response.json();

    return todos;
}

const MyTodosPage = async () => {

    const todos: Array<Todo> = await fetchTodos();

    const todosList: React.JSX.Element[] = todos.map( (todo) => (
        <li key={todo.id}>
            { todo.title } <Link href={`/caching/todos/${todo.id}`}>edit</Link>
        </li>
    ));

    return (
        <div>
            <h2>My todos</h2>
            <ul>
                {todosList}
            </ul>
        </div>
    )
}

export default requireAuthCompositionPattern(MyTodosPage, account_required);