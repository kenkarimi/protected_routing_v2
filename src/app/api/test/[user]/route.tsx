import { NextResponse } from "next/server";

//To access this route handler, go to http://localhost:3000/api/test/[username] on the browser.
export async function GET(request: Request, props: { params: Promise<{ user: string }> }) { //Can use async-await because it's a server component. Can also use { params }: instead of props:
    //the use of Request automatically disables caching on this route.
    const { user }: { user: string } = await props.params; //Using params to get a dynamic id.
    return NextResponse.json({ message: `Dynamic ID from api request: Name: ${user}` });
}