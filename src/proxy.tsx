import { NextRequest, NextResponse } from 'next/server';
import 'urlpattern-polyfill'; //installed from npm.
import { match } from 'path-to-regexp'; //installed from npm.
/**
 * Although middleware is out of the /app directory, you can still import from the app directory
 * Here, we import the AccountRequired enum from a file in the /app directory.
 */
import { AccountType, Account } from './app/_utils/GlobalInterfacesAndTypes';

const url_prefix: string = 'http://localhost:3000';
const routes: Array<string> = [ //'login', '/about', '/about/team', and any other static pages shouldn't be included here since they don't require log in.
    '/',
    '/code/repos',
    '/code/repos/:name', //No asterisk because we don't want the parameter to be optional. We want it matching exactly one segment. Not '/code/repos' or '/code/repos/:name/somethingelse'
    '/caching/todos',
    '/caching/todos/add',
    '/caching/todos/:id', //No asterisk because we don't want the parameter to be optional. We want it matching exactly one segment. Not '/caching/todos' or '/caching/todos/:id/somethingelse'
    '/content/customers',
    '/content/investors',
    '/params/clientside/:name/a', //No asterisk with blanket wildcard like '/params/clientside/:name*' for better precision and performance. We don't need to match the trailing segment as there are only two options(:name/a or :name/b). If there were dozens or hundreds of possibilities, then it would certainly be easier to just use '/params/clientside/:name*' instead of including them all individually in our matcher.
    '/params/clientside/:name/b', //No asterisk with blanket wildcard like '/params/clientside/:name*' for better precision and performance. We don't need to match the trailing segment as there are only two options(:name/a or :name/b). If there were dozens or hundreds of possibilities, then it would certainly be easier to just use '/params/clientside/:name*' instead of including them all individually in our matcher.
    '/params/serverside/:name', //No asterisk because we don't want the parameter to be optional. We want it matching exactly one segment. Not '/params/serverside' or '/params/serverside/:name/somethingelse'
    '/params/serverside/:name/api', //No asterisk with blanket wildcard like '/params/serverside/:name*' for better precision and performance. We don't need to match the trailing segment as there is only one option(:name/api). If there were dozens or hundreds of possibilities, then it would certainly be easier to just use '/params/serverside/:name*' instead of including them all individually in our matcher.
    '/search_params/clientside/a', //Search/Query params will exist after this pathname in the full url but they don't matter for this matcher since we're matching this to request.nextUrl.pathname.
    '/search_params/clientside/b', //Search/Query params will exist after this pathname in the full url but they don't matter for this matcher since we're matching this to request.nextUrl.pathname.
    '/search_params/serverside/a', //Search/Query params will exist after this pathname in the full url but they don't matter for this matcher since we're matching this to request.nextUrl.pathname.
    '/search_params/serverside/b/api', //Search/Query params will exist after this pathname in the full url but they don't matter for this matcher since we're matching this to request.nextUrl.pathname.
    '/logout'
];

function sleep(milliseconds: number) {
    return new Promise( (resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Next.js Middleware allows you to run custom code before a request is completed. 
 * It acts as an intermediary, intercepting incoming HTTP requests so you can modify the response by rewriting, redirecting, altering headers, or handling cookies.
 * NOTE: Deprecated after v15: https://nextjs.org/docs/14/app/building-your-application/routing/middleware
 * It has been renamed to proxy.ts. The functionality remains the same, but the Next.js team made the change to clarify that this feature acts as a network and routing boundary, rather than traditional backend middleware.
 */
export const proxy = (request: NextRequest) => {
    //Two ways to define which paths middleware will run on: 1. Conditional statements(if/switch) 2. Custom matcher config.

    //1. Conditional statements:
    //a) Using request.url
    /*if(request.url === `${url_prefix}/`) { //if home is the url requested/where request is coming from.
        return NextResponse.redirect(new URL('/login', request.url), { status: 308 }); //status 307 & 308(Temporary & Permanent redirect respectively) are the only status codes that are accepted by NextResponse.redirect(). The rest lead to an error when executing.
    }*/

    //b) Using request.nextUrl.pathname
    /*if(request.nextUrl.pathname === '/') { //in this case, we don't need to use a url prefix.
        return NextResponse.redirect(new URL('/login', request.url), { status: 308 }); //status 307 & 308(Temporary & Permanent redirect respectively) are the only status codes that are accepted by NextResponse.redirect(). The rest lead to an error when executing.
    }*/

    /**
     * Matching requested urls that include dynamic ids with the urls in our matcher can be done by one of two methods: 1. Next.js internal matcher 2. Using regular expressions(RegEx)
     * Note: Unlike dynamic id urls, search param urls in our matcher config don't need special methods for the sake of matching them to the requested urls other than the (===) operator.
     * This is because search params aren't included in the pathname(the path that comes after the domain extension(.com)) 
     * e.g. for /search_params/clientside/a/?name=johndoe it's pathname(request.nextUrl.pathname) is /search_params/clientside/a. That should match with the url in our matcher config simply with the (===) operator.
     */
    //In this project we only explore the first method:
    //1. Using Next.js Internal Matcher.
    /*const REPO_PATTERN: URLPattern = new URLPattern({ pathname: '/code/repos/:name' });
    const TODO_PATTERN: URLPattern = new URLPattern({ pathname: '/caching/todos/:id' });

    if(REPO_PATTERN.test({ pathname: request.nextUrl.pathname })) {
        const match_results: URLPatternResult | null = REPO_PATTERN.exec({ pathname: request.nextUrl.pathname }); //Takes a URL and returns an object containing the results of matching the URL or null if the URL does not match the pattern.
        if(!match_results) return; //to appease typescript. Could still delete this and use match_results?.pathname
        const name: string | undefined = match_results.pathname.groups.name;  // Extracts the dynamic ID directly from the pattern result.
        return NextResponse.json({ message: `Matched requested url with repo pattern even with dynamic id: ${name}` }, { status: 200 }); //Both return messages are similar.
    } else if(TODO_PATTERN.test({ pathname: request.nextUrl.pathname })) {
        const match_results: URLPatternResult | null = TODO_PATTERN.exec({ pathname: request.nextUrl.pathname }); //Takes a URL and returns an object containing the results of matching the URL or null if the URL does not match the pattern.
        if(!match_results) return; //to appease typescript. Could still delete this and use match_results?.pathname
        const id: string | undefined = match_results.pathname.groups.id
        return new NextResponse(JSON.stringify({ message: `Matched requested url with todo pattern even with dynamic id: ${id}` }), { status: 200 }); //Both return messages are similar.
    }*/

    //2. Using regular expressions(RegEx)
    /*const matchRepoFunction = match('/code/repos/:name', { decode: decodeURIComponent }); //Create matcher function.
    const matchTodoFunction = match('/caching/todos/:id', { decode: decodeURIComponent }); //Create matcher function.

    const repo_match_results = matchRepoFunction(request.nextUrl.pathname);
    const todo_match_results = matchTodoFunction(request.nextUrl.pathname);

    if(repo_match_results) {
        const name: string | string[] | undefined = repo_match_results.params.name;
        return NextResponse.json({ message: `Matched requested url with repo pattern even with dynamic id: ${name}` }, { status: 200 }); //Both return messages are similar.
    } else if(todo_match_results) {
        const id: string | string[] | undefined = todo_match_results.params.id;
        return new NextResponse(JSON.stringify({ message: `Matched requested url with todo pattern even with dynamic id: ${id}` }), { status: 200 }); //Both return messages are similar.
    }*/

    //Using if statements with the aid of an array to loop through all routes. Any non-existing route redirects to a custom NextJs 404 page.
    /*let route_exists: boolean = false;

    if(routes.length > 0) {
        for(let i = 0; i < routes.length; i++) {
            if(request.nextUrl.pathname === routes[i]) {
                route_exists = true;
                //Check if logged in. If not, redirect to log in.
                //console.log(request.cookies.has('decoded_claims')); //returns true/false.
                //console.log(request.cookies.get('decoded_claims')); //returns undefined if empty. else { name:, value:, path: } or { name: value: }
                //console.log(request.cookies.getAll()); //returns an empty array if empty. else [{ name:, value:, path: }] or [{ name:, value: }]
                //console.log(request.cookies.delete('decoded_claims')); //returns true/false.
                console.log('REQUEEEEEEEEST: ', request.url);
                if(request.cookies.has('decoded_claims')) {
                    const myCookie: any = request.cookies.get('decoded_claims');

                    let cookie_name = myCookie.name;
                    console.log('cookie name', cookie_name);

                    let cookie_value: Account = JSON.parse(myCookie.value); //unstringify decoded_claims object.
                    console.log('cookie value', cookie_value);

                    let logged_in: boolean = cookie_value.logged_in;
                    console.log('logged_in', logged_in);

                    let account_type: AccountType = cookie_value.account_type;
                    console.log('account_type', account_type);

                    let email: string = cookie_value.email;
                    console.log('email', email);

                    if(logged_in) {
                        const REPO_PATTERN: URLPattern = new URLPattern({ pathname: '/code/repos/:name' });
                        const TODO_PATTERN: URLPattern = new URLPattern({ pathname: '/caching/todos/:id' });
                        const CLIENTSIDE_PARAMS_A_PATTERN: URLPattern = new URLPattern({ pathname: '/params/clientside/:name/a'});
                        const CLIENTSIDE_PARAMS_B_PATTERN: URLPattern = new URLPattern({ pathname: '/params/clientside/:name/b'});
                        const SERVERSIDE_PARAMS_PATTERN: URLPattern = new URLPattern({ pathname: '/params/serverside/:name'});
                        const SERVERSIDE_PARAMS_API_PATTERN: URLPattern = new URLPattern({ pathname: '/params/serverside/:name/api' });
                        
                        //Check for access control then proceed to requested url.
                        if(request.nextUrl.pathname === '/' && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(request.nextUrl.pathname === '/code/repos' && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(REPO_PATTERN.test({ pathname: request.nextUrl.pathname }) && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(request.nextUrl.pathname === '/caching/todos' && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(request.nextUrl.pathname === '/caching/todos/add' && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if( TODO_PATTERN.test({ pathname: request.nextUrl.pathname }) && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(request.nextUrl.pathname === '/content/customers' && account_type !== 'customer') {
                            console.log('failed: /content/customers redirected to /');
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(request.nextUrl.pathname === '/content/investors' && account_type !== 'investor') {
                            console.log('failed: /content/investors redirected to /');
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(CLIENTSIDE_PARAMS_A_PATTERN.test({ pathname: request.nextUrl.pathname }) && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(CLIENTSIDE_PARAMS_B_PATTERN.test({ pathname: request.nextUrl.pathname }) && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(SERVERSIDE_PARAMS_PATTERN.test({ pathname: request.nextUrl.pathname }) && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(SERVERSIDE_PARAMS_API_PATTERN.test({ pathname: request.nextUrl.pathname }) && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(request.nextUrl.pathname === '/search_params/clientside/a' && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(request.nextUrl.pathname === '/search_params/clientside/b' && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(request.nextUrl.pathname === '/search_params/serverside/a' && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(request.nextUrl.pathname === '/search_params/serverside/b/api' && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                        } else if(request.nextUrl.pathname === '/logout' && account_type !== 'customer' && account_type !== 'investor') {
                            //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                            return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home(where else even???).
                        } else {
                            //You have permission. Go ahead.
                            //This sleep operation is meant to simulate a fetch call. Without a fetch or any other activity that requires a promise, the Middleware executes first before the Higher Order Component. With this fetch, the HOC now executes before the Middleware as can be seen from the console. This means we can't use a HOC to reuse/minimize the amount of code written on the client side. we have to do any resets to context on the function components componentDidMount equivalent or custom constructor after we are approved to go to that route.
                            return sleep(2000).then(() => { //Can also use async await.
                                console.log(`Middleware executing at ${new Date()}`);
                                console.log('Just before you switch up on me,', request.url);
                                return NextResponse.next(); //Can be left out and response would still send since this is the last line of code.
                            });
                        }
                    } else if(!logged_in) {
                        console.log('Not logged in');
                        return NextResponse.redirect(new URL('/login', request.url), { status: 308 }); //redirects to /login and shows login's content/page.tsx.
                        //return NextResponse.rewrite(new URL('/login', request.url)); //rewrites response such that user still goes to requested url path, but instead of showing that path's content/page.tsx, it shows the /login's content/page.tsx. So it's the login page, but the url path on the browser isn't /login.
                    }
                } else {
                    console.log('No cookie');
                    return NextResponse.redirect(new URL('/login', request.url), { status: 308 }); //redirects to /login and shows login's content/page.tsx.
                    //return NextResponse.rewrite(new URL('/login', request.url)); //rewrites response such that user still goes to requested url path, but instead of showing that path's content/page.tsx, it shows the /login's content/page.tsx. So it's the login page, but the url path on the browser isn't /login.
                }
            }
        }

        //If loop ends and requested pathname wasn't found in routes array.
        if(!route_exists) {
            if(request.nextUrl.pathname === '/login') { //If log in page was the one requested, we don't want to mistakenly redirect it to /404 just because it wasn't in routes array.
                //Check if logged in. If logged in, redirect to home('/'). If not, let user proceed to '/login'(empty else if)
                if(request.cookies.has('decoded_claims')) {
                    const myCookie: any = request.cookies.get('decoded_claims');

                    const cookie_value: Account = JSON.parse(myCookie.value); //unstringify decoded_claims object.
                    
                    if(cookie_value.logged_in) {
                        console.log('Hold on right there. You\'re logged in. Go home.');
                        return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //status 307 & 308(Temporary & Permanent redirect respectively) are the only status codes that are accepted by NextResponse.redirect(). The rest lead to an error when executing.
                    } else if(!cookie_value.logged_in) { //Cookie available but false. Let user proceed to '/login'(empty else if)
                        console.log('Fine! You\'re not logged in. Go ahead.');
                        return NextResponse.next(); //Can be left out and response would still send since this is the last line of code.
                    }
                } else { //Cookie unavailable. Let user proceed to '/login'(empty else if)
                    console.log('No cookie');
                    return NextResponse.next(); //Can be left out and response would still send since this is the last line of code.
                }
            } else {
                //If it's any of '/about', '/about/team' or /code/repos/[name] it'll continue to render. If the route is a 404, it'll be handled by not-found.tsx
                return NextResponse.next(); //Can be left out and response would still send since this is the last line of code.
            }
        }
    }*/




    //Unrelated with the above/below, but this is how you'd set a cookie with NextResponse before redirecting if you needed to:
    /*NextResponse.next().cookies.set('decoded_claims', 'This value', { //path, maxAge, expires & domain are configuration choices & are optional(you can ommit the object as one of the parameters of Set-Cookie).
        path: '/', //If path omitted, it returns '/' as it's default path.
        maxAge: 60, //Specifies the number (in seconds). if both expires and maxAge are set, then maxAge takes precedence, but it is possible not all clients obey this, so if both are set, they should point to the same date and time.
        expires: 60000 //A number of milliseconds or Date interface(new Date('2023-09-30')) containing the expires of the cookie.
    });
    NextResponse.next().cookies.set({ //path, maxAge & expires are optional keys but the others are required.
        name: 'decoded_claims',
        value: 'This Value',
        path: '/',
        //maxAge: 70, //commented out so that expires can take precedence, otherwise it would overwrite whatever date is written in expires.
        expires: new Date('2026-09-30')
    });
    //NB: The path option is used in this case to allow the program to access the cookie from any location when the response is sent to the client.
    
    console.log(NextResponse.next().cookies.get('decoded_claims'));
    return NextResponse.redirect(new URL('/login', request.url), { status: 308 }); //redirects to /login and shows login's content/page.tsx.
    */




    //2.Custom matcher config:
    if(request.nextUrl.pathname === '/login') {
        //Check if logged in. If logged in, redirect to home('/'). If not, let user proceed to '/login'(empty else if)
        if(request.cookies.has('decoded_claims')) {
            const myCookie: any = request.cookies.get('decoded_claims');

            const cookie_value: Account = JSON.parse(myCookie.value); //unstringify decoded_claims object.
            
            if(cookie_value.logged_in) {
                console.log('Hold on right there. You\'re logged in. Go home.');
                //return NextResponse.json({ message: 'You can\'t access /login as you\'re already logged in.' }, { status: 308 });
                return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //status 307 & 308(Temporary & Permanent redirect respectively) are the only status codes that are accepted by NextResponse.redirect(). The rest lead to an error when executing.
            } else if(!cookie_value.logged_in) { //Cookie available but false. Let user proceed to '/login'(empty else if)
                console.log('Fine! You\'re not logged in. Go ahead.');
                //return NextResponse.json({ message: 'Go ahead and log in.'}, { status: 200 });
                return NextResponse.next(); //Can be left out and response would still send since this is the last line of code.
            }
        } else { //Cookie unavailable. Let user proceed to '/login'(empty else if)
            console.log('No cookie');
            //return NextResponse.json({ message: 'Go ahead and log in.' }, { status: 200});
            return NextResponse.next(); //Can be left out and response would still send since this is the last line of code.
        }
    } else { //Any other pathname in the array.
        //Check if logged in. If not, redirect to log in.
        
        if(request.cookies.has('decoded_claims')) {
            const myCookie: any = request.cookies.get('decoded_claims');

            let cookie_name: string = myCookie.name;
            console.log('cookie name', cookie_name);

            let cookie_value: Account = JSON.parse(myCookie.value); //unstringify decoded_claims object.
            console.log('account object', cookie_value);

            let logged_in: boolean = cookie_value.logged_in;
            console.log('logged_in', logged_in);

            let account_type: AccountType = cookie_value.account_type;
            console.log('account_type', account_type);

            let email: string = cookie_value.email;
            console.log('email', email);

            if(logged_in) {
                const REPO_PATTERN: URLPattern = new URLPattern({ pathname: '/code/repos/:name' });
                const TODO_PATTERN: URLPattern = new URLPattern({ pathname: '/caching/todos/:id' });
                const CLIENTSIDE_PARAMS_A_PATTERN: URLPattern = new URLPattern({ pathname: '/params/clientside/:name/a'});
                const CLIENTSIDE_PARAMS_B_PATTERN: URLPattern = new URLPattern({ pathname: '/params/clientside/:name/b'});
                const SERVERSIDE_PARAMS_PATTERN: URLPattern = new URLPattern({ pathname: '/params/serverside/:name'});
                const SERVERSIDE_PARAMS_API_PATTERN: URLPattern = new URLPattern({ pathname: '/params/serverside/:name/api' });

                //Check for access control then proceed to requested url.
                if(request.nextUrl.pathname === '/' && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(request.nextUrl.pathname === '/code/repos' && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(REPO_PATTERN.test({ pathname: request.nextUrl.pathname }) && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(request.nextUrl.pathname === '/caching/todos' && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(request.nextUrl.pathname === '/caching/todos/add' && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(TODO_PATTERN.test({ pathname: request.nextUrl.pathname }) && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(request.nextUrl.pathname === '/content/customers' && account_type !== 'customer') {
                    console.log('failed: /content/customers redirected to /');
                    //return NextResponse.json({ message: 'You do not have permission to access /content/customers' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(request.nextUrl.pathname === '/content/investors' && account_type !== 'investor') {
                    console.log('failed: /content/investors redirected to /');
                    //return NextResponse.json({ message: 'You do not have permission to access /content/investors' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(CLIENTSIDE_PARAMS_A_PATTERN.test({ pathname: request.nextUrl.pathname }) && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(CLIENTSIDE_PARAMS_B_PATTERN.test({ pathname: request.nextUrl.pathname }) && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(SERVERSIDE_PARAMS_PATTERN.test({ pathname: request.nextUrl.pathname }) && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(SERVERSIDE_PARAMS_API_PATTERN.test({ pathname: request.nextUrl.pathname }) && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(request.nextUrl.pathname === '/search_params/clientside/a' && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(request.nextUrl.pathname === '/search_params/clientside/b' && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(request.nextUrl.pathname === '/search_params/serverside/a' && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(request.nextUrl.pathname === '/search_params/serverside/b/api' && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have permission to access /' }, { status: 401 });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home.
                } else if(request.nextUrl.pathname === '/logout' && account_type !== 'customer' && account_type !== 'investor') {
                    //Never executes. Gets filtered at the parent conditional. You can't be logged in and not be either customer or an investor.
                    //return NextResponse.json({ message: 'You do not have have permission to access /logout' });
                    return NextResponse.redirect(new URL('/', request.url), { status: 308 }); //no permission. redirect to home(where else even???).
                } else {
                    //You have permission. Go ahead.
                    //This sleep operation is meant to simulate a fetch call. Without a fetch or any other activity that requires a promise, the Middleware executes first before the Higher Order Component. With this fetch, the HOC now executes before the Middleware as can be seen from the console. This means we can't use a HOC to reuse/minimize the amount of code written on the client side. we have to do any resets to context on the function components componentDidMount equivalent or custom constructor after we are approved to go to that route.
                    return sleep(2000).then(() => { //Can also use async await.
                        console.log(`Middleware executing at ${new Date()}`);
                        console.log('Just before you switch up on me,', request.url);
                        return NextResponse.next(); //Can be left out and response would still send since this is the last line of code.

                        //return new NextResponse(JSON.stringify({ message: 'You have permission' }), { status: 200, headers: { 'content-type': 'application/json', 'x-hello-from-middleware': 'Habari yako?' } });
                        /*
                        const response = new NextResponse(JSON.stringify({ message: 'You have permission ' }), { status: 200 });
                        response.headers.set('x-message-from-middleware', 'You have permission');
                        response.headers.set('x-shift-data', JSON.stringify({
                            message: 'You have permission'
                        }));
                        response.cookies.set('next_response_cookie', 'Other than NextResponse.json() which overwrites a components html with the json response, the only other way to send responses to a react server component or client component from middleware is by sending a response cookie, response header or serialized data with the response.', {
                            path: '/', //If path omitted, it returns '/' as it's default path.
                            maxAge: 6000, //Specifies the number (in seconds). if both expires and maxAge are set, then maxAge takes precedence, but it is possible not all clients by obey this, so if both are set, they should point to the same date and time.
                            expires: 6000000 //A number of milliseconds or Date interface(new Date('2023-09-30')) containing the expires of the cookie.
                        });
                        return response;
                        */
                        //return NextResponse.json({ message: 'You have permission.' }, { status: 200, headers: { 'content-type': 'application/json', 'x-hello-from-middleware': 'Habari yako?' } }); //Can set cookies after headers too.
                        /*
                        const response = NextResponse.next({ status: 401 }); //Can also set headers here instead of response.headers below. Can't do that for cookies though. response.cookies.set() has to be done below.
                        response.headers.set('x-message-from-middleware', 'You have permission');
                        response.cookies.set('next_response_cookie', 'Other than NextResponse.json() which overwrites a component\'s html with the json response, the only other way to send responses to a react server component or client component from middleware is by sending a response cookie, response header or serialized data with the response.', {
                            path: '/', //If path omitted, it returns '/' as it's default path.
                            maxAge: 6000, //Specifies the number (in seconds). if both expires and maxAge are set, then maxAge takes precedence, but it is possible not all clients by obey this, so if both are set, they should point to the same date and time.
                            expires: 6000000 //A number of milliseconds or Date interface(new Date('2023-09-30')) containing the expires of the cookie.
                        });
                        return response; //Can be left out and response would still send since this is the last line of code.
                        */
                    });
                }
            } else if(!logged_in) {
                console.log('Not logged in');
                //return NextResponse.json({ message: 'You do not have permission to access this route. You need to first log in.'}, { status: 401 });
                return NextResponse.redirect(new URL('/login', request.url), { status: 308 }); //redirects to /login and shows login's content/page.tsx.
                //return NextResponse.rewrite(new URL('/login', request.url)); //rewrites response such that user still goes to requested url path, but instead of showing that path's content/page.tsx, it shows the /login's content/page.tsx. So it's the login page, but the url path on the browser isn't /login.
            }
        } else {
            console.log('No cookie');
            //return NextResponse.json({ message: 'You do not have permission to access this route. You need to first log in.'}, { status: 401 });
            return NextResponse.redirect(new URL('/login', request.url), { status: 308 }); //redirects to /login and shows login's content/page.tsx.
            //return NextResponse.rewrite(new URL('/login', request.url)); //rewrites response such that user still goes to requested url path, but instead of showing that path's content/page.tsx, it shows the /login's content/page.tsx. So it's the login page, but the url path on the browser isn't /login.
        }
    }

    //REQUEST & RESPONSE HEADERS: Request headers are used to provide additional information about the HTTP request.
    /*console.log('REQUEST.HEADERS', request.headers);

    console.log('////////////////////////////////////////Getting default headers that come with the original request from request.headers/////////////////////////////////////////////////////');
    let accept = request.headers.get('accept'); //type of data client is willing to accept. e.g. text/html, application/json etc.
    console.log('accept', accept);
    let accept_encoding = request.headers.get('accept-encoding'); //type of encoding client is willing to accept e.g. 
    console.log('accept-encoding', accept_encoding);
    let accept_language = request.headers.get('accept-language'); //language(s) client is willing to accept.
    console.log('accept-language', accept_language);
    let connection = request.headers.get('connection');
    console.log('connection', connection);
    let cookie: any = request.headers.get('cookie'); //Cookie the header. Not be confused with the actual cookie.
    console.log('cookie(encoded)', cookie);
    console.log('cookie(decoded)', decodeURIComponent(cookie)); //unescape/decodeURIComponent used to decoded cookie string. unescape() is deprecated so decodeURIComponent is preferred.
    let cache_control = request.headers.get('cache-control');
    console.log('cache-control', cache_control);
    let user_agent = request.headers.get('user-agent');
    console.log('user-agent', user_agent); //type of client that is making the request. e.g. web browser, mobile device etc.
    let host = request.headers.get('host');
    console.log('host', host);
    console.log('/////////////////////////////////////////////////////////////////////////////////////////////');

    // Clone the request headers and set a new header `x-hello-from-middleware1`
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-hello-from-middleware1', 'hello');
    requestHeaders.set('x-possible-user-name1', 'John Doe');
    requestHeaders.set('x-possible-user-name2', 'Jane Doe');
    console.log('REQUESTHEADERS', requestHeaders);

    console.log('///////////////////////////////////Getting headers by name from requestHeaders we just set//////////////////////////////////////////////////////////');
    let greeting_header_request = requestHeaders.get('x-hello-from-middleware1'); //Don't use the x-middleware-request that is prefixed within the header. Just use the name.
    console.log('hello request', greeting_header_request);
    let possible_user1 = requestHeaders.get('x-possible-user-name1');
    console.log('possible user 1', possible_user1);
    let possible_user2 = requestHeaders.get('x-possible-user-name2');
    console.log('possible user 2', possible_user2);
    console.log('/////////////////////////////////////////////////////////////////////////////////////////////');

    // You can also set request headers in NextResponse.rewrite
    const response = NextResponse.next({
        request: {
            // New request headers
            headers: requestHeaders
        }
    });

    // Set a new response header `x-hello-from-middleware2`
    response.headers.set('x-hello-from-middleware2', 'hello'); //In the console, this won't be prefixed. It'll appear as: x-hello-from-middleware2: 'hello' in the headers: {} section.
    console.log('RESPONSE.HEADERS',response);
    console.log('///////////////////////////////////Repeated again but instead of getting them from the requestHeders we get them from response.headers//////////////////////////////////////////////////////////');
    let greeting_header_response = response.headers.get('x-hello-from-middleware2'); //Don't prefix with x-middleware-request since this was set in response.headers
    console.log('hello response', greeting_header_response);
    console.log('/////////////////////////////////////////////////////////////////////////////////////////////');

    return response;*/
}

 //a)Custom matcher config with only one matching path. 
/*export const config = { //middleware only runs if this one path is matched.
    matcher: '/'
}*/

//b)Custom matcher config with an array of paths that can match.
/*export const config = {
    matcher: ['/', '/about/:path*', '/content/:path*']
}*/
/**
 * Using the asterisk in '/about/:path*' makes it different from 'about:path' in terms of how the matching happens:
 * '/about/:path*' matches zero or more trailing segments e.g. matches '/about', '/about/john' and '/about/john/more'. As you can see, the asterisk makes the parameter optional. You can include it, exclude it entirely, or include it and even add one or more trailing segments after it.
 * '/about/:path' matches exactly one segment. Exactly one dynamic value is allowed e.g. matches '/about/john'. Does NOT match '/about' (missing ID) like the asterisked version above, and also does NOT allow an extra segment either like so '/about/john/more'.
 * NOTE: '/about/:path' and '/about/:path*' can also be written with the exact name of the dynamic id e.g. '/about/:employee_name' and '/about/:employee_name*' with no issue. If you're using a rewrite() function in your middleware, you'll have to include the exact wildcard used, however:
 * e.g. in matcher.config: '/about/:path*' in middlware: return NextResponse.rewrite(new URL(`/about/:path*`, request.url));
 * e.g. in matcher.config: '/about/:employee_name*' in middlware in middlware: return NextResponse.rewrite(new URL(`/about/:employee_name*`, request.url));
 * Also NB: You can't do '/:path*' because the scope is too wide making the matcher almost useless since it matches everything. A Next.js default 404 page is never produced since everything matches.
 */

//All routes have to be explicitly defined if you want to always produce the default NextJs 404 page for non-existing routes. There can be no use of '/:path*'. Those are redirected to log in page for non-existing pathnames where '/:path*' is used.
//NB: Even though we still leave the '/about/:path*' pages out of this matcher like we did in the routes array above(doesn't require login to view), here, we include '/login' in the matcher array(unlike in the routes array) so as to stop a logged in user from going to the log in page. We achieve this with an if else conditional in the middleware.
//'/about', '/about/team' aren't included in the matcher array as they're static pages that don't require log in.

export const config = {
    matcher: [
        '/',
        '/code/repos',
        '/code/repos/:name', //No asterisk because we don't want the parameter to be optional. We want it matching exactly one segment. Not '/code/repos' or '/code/repos/:name/somethingelse'
        '/caching/todos',
        '/caching/todos/add',
        '/caching/todos/:id', //No asterisk because we don't want the parameter to be optional. We want it matching exactly one segment. Not '/caching/todos' or '/caching/todos/:id/somethingelse'
        '/content/customers',
        '/content/investors',
        '/params/clientside/:name/a', //No asterisk with blanket wildcard like '/params/clientside/:name*' for better precision and performance. We don't need to match the trailing segment as there are only two options(:name/a or :name/b). If there were dozens or hundreds of possibilities, then it would certainly be easier to just use '/params/clientside/:name*' instead of including them all individually in our matcher.
        '/params/clientside/:name/b', //No asterisk with blanket wildcard like '/params/clientside/:name*' for better precision and performance. We don't need to match the trailing segment as there are only two options(:name/a or :name/b). If there were dozens or hundreds of possibilities, then it would certainly be easier to just use '/params/clientside/:name*' instead of including them all individually in our matcher.
        '/params/serverside/:name', //No asterisk because we don't want the parameter to be optional. We want it matching exactly one segment. Not '/params/serverside' or '/params/serverside/:name/somethingelse'
        '/params/serverside/:name/api', //No asterisk with blanket wildcard like '/params/serverside/:name*' for better precision and performance. We don't need to match the trailing segment as there is only one option(:name/api). If there were dozens or hundreds of possibilities, then it would certainly be easier to just use '/params/serverside/:name*' instead of including them all individually in our matcher.
        '/search_params/clientside/a', //Search/Query params will exist after this pathname in the full url but they don't matter for this matcher since we're matching this to request.nextUrl.pathname.
        '/search_params/clientside/b', //Search/Query params will exist after this pathname in the full url but they don't matter for this matcher since we're matching this to request.nextUrl.pathname.
        '/search_params/serverside/a', //Search/Query params will exist after this pathname in the full url but they don't matter for this matcher since we're matching this to request.nextUrl.pathname.
        '/search_params/serverside/b/api', //Search/Query params will exist after this pathname in the full url but they don't matter for this matcher since we're matching this to request.nextUrl.pathname.
        '/login',
        '/logout'
    ]
}

// Limit the middleware to paths starting with `/api/`
/*export const config = {
    matcher: '/api/:function*'
}*/

//request.url returns the entire url including the pathname while request.nextUrl.pathname only returns the pathname after the domain.
//request.nextUrl returns an object containing href, origin, protocol, username, password, host, hostname, port, pathname etc. //To get the pathname only  you use request.nextUrl.pathname. The same can be done for any of the other keys in the object.
/*
{
    href: 'http://localhost:3000/',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    username: '',
    password: '',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    searchParams: <ref *1> URLSearchParams {
        [Symbol(query)]: [],
        [Symbol(context)]: URL {
            [Symbol(context)]: URLContext {
                href: 'http://localhost:3000/',
                protocol_end: 5,
                username_end: 7,
                host_start: 7,
                host_end: 16,
                pathname_start: 21,
                search_start: 4294967295,
                hash_start: 4294967295,
                port: 3000,
                scheme_type: 0
            },
            [Symbol(query)]: [Circular *1]
        }
    },
    hash: ''
}
*/