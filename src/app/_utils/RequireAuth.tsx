'use client'

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { AccountRequired } from './GlobalEnumerations';
import useConstructor from './UseConstructor';

interface Todos {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

const RequireAuth = ({ children, account_required }: { children: React.ReactNode, account_required: AccountRequired }) => { //This HOC wraps every function component that requires auth: /, /content/customers, /content/investors
    
    const [todos, setTodos] = useState<Array<Todos>>([]);
    const pathname = usePathname(); //pathname being requested.

    //constructor has to be defined after setTodos is declared and initialized.
    useConstructor(() => {
        //For anything that needs to execute before the first render.
        console.log('requireAuth() CONSTRUCTOR EXECUTING...');
        /**
         * We use a constructor for this for the same reason we use a useEffect for the fetch call: calling setTodos outside fo this constructor would cause setTodos to fire every single time the component re-renders, causing an accidental infinite loop.
         * We only need setTodos reset once for each route we go to. Renders triggered by the state being set once the initial render of a route completes don't cause this constructor to fire again.
         * It's only when we visit an new route, meaning that this entire component is initialized afresh and receives new props that the constructor fires again and for that, we need setTodos reset back to an empty array before the fetch operation happens again.
         * Remember this is a trial app, in reality we'd have a backend function that performs access control in place of fetching todos so setTodos and todos would instead be setLoading and loading.
         */
        setTodos([]);
    });

    //console.log(`HOC executing at ${new Date()} for path ${pathname}`);
    //console.log(`Account required to access this route: ${account_required}`);

    /**
     * NB: Don't make raw direct fetch calls inside the body of a client component(emphasis on client).
     * Doing so will cause the network request to fire every single time the component re-renders,
     * creating an accidental infinite loop that can crash your application or spam your API.
     * Order of events: The component renders, The fetch call triggers, The fetch finishes and updates a local state variable, The state update triggers a new render, The loop repeats infinitely.
     * Instead, make fetch calls inside a useEffect. This would otherwise be okay in server components because they don't update state and you also can't use a useEffect in them anyway.
     */
    useEffect( () => {
        if(todos.length > 0) return;
        //Accept(only media types that the client willing to accept) can be */*(the default), application/json, text/html etc. No Content-Type because this is a GET request. Unlike Content-Type, Accept is not wrapped in quotation marks.
        const options: object = {
            method: 'GET',
            cache: 'force-cache', //force-cache is the default for NextJs and automatically caches the returned values. Others: default(if fresh, use cache if stale check server if changed, if so, fetch resource from server & update cache), no-store(fetch resource from server without checking if cached version changed, don't update cache), reload(fetch resource from server without checking if cached version changed, but update cache), no-cache(regardless of whether fresh/stale, check server if changed, if not, use cache, if so, fetch resource from server & update cache), only-if-cached(if cached, regardless of whether fresh/stale use cache. if not cached, return 504 gateway timeout error). For sensitive information, always use no-store so its not stored in cache and is always fetched directly from server & ignores cache. For constantly changing information consider using no-cache or use the default force-cache with time-based cache revalidation at short intervals.
            next: {
                revalidate: 3600 //cache lifetime of resource in seconds. Not only purges the data cache but also re-fetches every 3600 seconds making sure the user is always seeing the latest version.
            },
            headers: {
                Accept: '*/*'
                
            }
        }
        sleep(0).then(() => {
            //Unlike axios which automatically transforms the data returned from the server, with fetch you have to call res.json() to parse the data to a Javascript object.
            fetch('https://jsonplaceholder.typicode.com/todos', options)
            .then( (res) => res.json())
            .then( (data: Array<Todos>) => {
                console.log('RequireAuth', 'GET request successful for pathname: '+ pathname);
                //console.log(data);
                setTodos(data);
            }).catch( (err) => {
                console.log(err);
            });
        });
    }, []);

    const sleep = (milliseconds: number) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds)); //Wait extra 3 seconds to make loading spinner(not loading.tsx) even more noticeable.
    }

    if(todos.length > 0) {
        return children;
    } else {
        //return <></>;
        return (
            <div>
                <h1>loading spinner...</h1>
                <p>loading.tsx not used for any route that requires access control. This script is loaded instead while data is fetching...</p>
            </div>
        )
    }
    
}

export default RequireAuth;