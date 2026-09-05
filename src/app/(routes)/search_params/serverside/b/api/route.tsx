import { NextResponse } from "next/server";

//To access this route handler, go to http://localhost:3000/search_params/serverside/b/api?name=Brad on the browser.
export function GET(request: Request) {

    const { searchParams }: { searchParams: URLSearchParams } = new URL(request.url); //Using the request url to get the search parameters.
    
    let name: string | null = ''; //search params HAVE to be of type string | null. URL search parameters always store values as strings. No numbers, no booleans.
    if(searchParams.has('name')) { //Not a must to use the has() method because search params are required to have an alt type e.g. string | null.
        name = searchParams.get('name');
    }

    return NextResponse.json({ message: `Promise unwrapped in serverside route handler: Name: ${name}` }); //Or return new NextResponse(JSON.stringify({ message: `Promise unwrapped in serverside route handler: Name: ${name}` }), { status: 201 }); //Both are the same.
}