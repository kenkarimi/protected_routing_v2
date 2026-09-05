import { NextResponse } from "next/server";

//To access this route handler, go to http://localhost:3000/api/search/?id=3&name=Brad on the browser.
export function GET(request: Request) {
    console.log(request.url);
    const { searchParams }: { searchParams: URLSearchParams } = new URL(request.url); //Using the request url to get the search parameters.

    let id: string | null = '', name: string | null = ''; //search params HAVE to be of type string | null. URL search parameters always store values as strings. No numbers, no booleans.
    if(searchParams.has('id')) { //Not a must to use the has() method because search params are required to have an alt type e.g. string | null.
        id = searchParams.get('id');
    }
    if(searchParams.has('name')) { //Not a must to use the has() method because search params are required to have an alt type e.g. string | null.
        name = searchParams.get('name');
    }
    return NextResponse.json({ message: `Search Params from api request: ID: ${id}, Name: ${name}` });
}