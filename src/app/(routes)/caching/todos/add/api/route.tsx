import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { Todo } from "@/app/_utils/GlobalInterfacesAndTypes";

export async function POST(request: Request) {

    const { userId, title, completed }: { userId: number, title: string, completed: boolean } = await request.json();

    const options: object = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ //id of the post is assigned by the api
            userId: userId,
            title: title,
            completed: completed
        })
    }

    const response: Response = await fetch('https://jsonplaceholder.typicode.com/todos', options);
    const newTodo: Todo = await response.json(); //API returns the todo we just created. It contains a newly created/auto-incremented 'id' for the TODO.

    /**
     * On-Demand revalidation.
     * Now that we're confirmed to have added a new todo item, we invalidate the current server-cache using "stale-while-revalidate" semantics with a 'max' profile
     * This means that the server serves the stale data instantly back to the client while querying the database in the background for fresh data(the query being referred to here is the query/fetch request that was cached in MyTodosPage where the tag was declared)
     * The reason we're doing it here is because we know we're being redirected immediately after the response below returns us to see a list of all my todos in MyTodosPage. We want this new todo to be among them.
     * While it won't be at first due to stale data being returned instantly on this request, the next request we make for that page(MyTodosPage) in the future will show the new fresh cache.
     * Ofcourse it goes without saying that if the client had its own cache that is still fresh, we'd have to wait untill it went stale for revalidateTag() to take effect during the first server check.
     * If we wanted to avoid these "stale-while-revalidate" semantics, we would have used updateTag(), but remember while it works on server actions, it doesn't work on route handlers like this one.
     * For more, read your own notes on this. Also remember, you're the one who determines what type of request is too important to receive stale data(meaning updateTag() has to be used) and which one is safe enough for stale data(meaning revalidateTag() can be used)
     * In our case, we've decided that updated todos have to always be fresh so that the user can see the changes made immediately(updateTag()) while new todos that have been added recently aren't as important to view immediately so stale data can be viewed(revalidateTag)
     * It could easily have been the opposite. It's just a matter of use-case and perspective and the user has to decide. It's still important to remember that the wrong caching strategy could be disastrous if stale data is used in an important operation where fresh data is needed or when a user uses stale data to make an important decision.
     * In short, it's up to the developer what qualifies as a "read-your-own-writes" scenario vs a "stale-while-revalidate" scenario and based on this answer, the appropriate caching strategy follows for each case. 
     */

    revalidateTag('my-todos', 'max'); //invalidate the cache now that we've added a new todo. Remember: revalidateTag can only be used in server actions & route handlers.
    return NextResponse.json(newTodo, { status: 201 }); //Or return new NextResponse(JSON.stringify(newTodo), { status: 201 }); //Both are the same.

}