'use server'

import { updateTag } from "next/cache";

import { Todo } from "../GlobalInterfacesAndTypes"

export async function updateTodo(id: number, updatedTodo: Todo) { //named export but can also be default.

    const options: object = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodo)
    }
    const response: Response = await fetch(`https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`, options); //Can also use id parameter from function in place of updatedTodo.id
    const todo: Todo = await response.json(); //API returns the todo we just updated.

    /**
     * On-Demand revalidation.
     * Now that we're confirmed to have updated an existing todo item, we invalidate the current server-cache using 'read-your-own-writes' semantics.
     * This means that NO stale data is served to the client while querying the database in the background for fresh data(the query being referred to here is the query/fetch request that was cached in MyTodosPage where the tag was declared)
     * Instead, the request is blocked, meaning the client is made to wait while the database is queried for fresh data. When the data is found, a response to the request is sent back to the client.
     * The reason we're doing it here is because we know we're being redirected immediately after the return statement below returns us to see a list of all my todos in MyTodosPage. We want this updated todo to be among them.
     * If we wanted to avoid these "read-your-own-writes-semantics" semantics, we would have used revalidateTag(), which works in both server actions and route handlers unlike this tag that only works in server actions like this one.
     * For more, read your own notes on this. Also remember, you're the one who determines what type of request is too important to receive stale data(meaning updateTag() has to be used) and which one is safe enough for stale data(meaning revalidateTag() can be used)
     * In our case, we've decided that updated todos have to always be fresh so that the user can see the changes made immediately(updateTag()) while new todos that have been added recently aren't as important to view immediately so stale data can be viewed(revalidateTag)
     * It could easily have been the opposite. It's just a matter of use-case and perspective and the user has to decide. It's still important to remember that the wrong caching strategy could be disastrous if stale data is used in an important operation where fresh data is needed or when a user uses stale data to make an important decision.
     * In short, it's up to the developer what qualifies as a "read-your-own-writes" scenario vs a "stale-while-revalidate" scenario and based on this answer, the appropriate caching strategy follows for each case.
     */

    updateTag('my-todos'); //invalidate the cache now that we've updated the existing todo. Remember: updateTag() can only be used in server actions. Not route handlers.
    return todo;
}