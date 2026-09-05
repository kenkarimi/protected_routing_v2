import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) { //Async/await can only be used in server components. Also remember: Unlike search params where every value has to be a string, dynamic ids allow for other types as well, so { name: string } could also have been { id: number }
    const { name }: { name: string } = await params;

    /**
     * Similar to /params/serverside/[name] except that was a serverside function component. 
     * Now we're doing the same, but in a route handler.
     */

    return NextResponse.json({ name: name }, { status: 200}); //Or return new NextResponse(JSON.stringify({ name: name }), { status: 200 }); //Both are the same.
}