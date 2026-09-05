import { NextResponse } from "next/server";
import data from './data.json';

//To access this route handler, go to http://localhost:3000/api/ on the browser.
export function GET(request: Request) { //the use of Request automatically disables caching on this route.
    console.log('API executing @ /content/investors/api/');
    return NextResponse.json(data);
}
//To access this route handler, go to http://localhost:3000/api/ on the browser.
export async function POST(request: Request) {
    interface Data {
        name: string;
        email: string;
        phone: number;
        customer: boolean;
        investor: boolean;
        code_name: string | null;
    }
    const { name, email, phone, customer, investor, code_name }: Data = await request.json(); //get data from the body of the request. Same can be done in middleware if intercepted request caries data in its body.

    //TODO: INSERT NEW USER INTO data.json file.

    return NextResponse.json({ message: 'User profile created.' });
}