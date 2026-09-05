'use client'

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import requireAuthCompositionPattern from '@/app/_utils/RequireAuthCompositionPattern';
import { updateTodo } from '@/app/_utils/actions/UpdateTodos';
import { AccountRequired } from '@/app/_utils/GlobalEnumerations';
import { Todo } from '@/app/_utils/GlobalInterfacesAndTypes';

const account_required: AccountRequired = AccountRequired.Any;

let myTodo: Todo;

const UpdateTodoPage = ({ params }: { params: Promise<{ id: number }> }) => {

    const { id }: { id: number } = use(params);
    const router = useRouter();

    const [title, setTitle] = useState<string>('');
    const [completed, setCompleted] = useState<boolean>(false);

    useEffect(() => {
        /**
         * We don't cache this request because we need the most recent version of this specific todo for update accuracy, and also because we'd need to invalidate the cache as soon as the todo is returned in the fetch(then() function) for said accuracy with updateTag. revalidateTag wouldn't be an option as we can't afford a stale todo in the future.
         * The problem with this is we're in a client component, which renders the use of updateTag inapropriate. As such, since we're not caching this request and it means there will be a delay while the todo is fetched before it's loaded in the component, we have to use a suspense boundary.
         */
        const options: object = {
            method: 'GET',
            headers: {
                Accept: 'application/json' //Or '*/*' if you wanted to be more general. In our case, we know exacly what we're getting back.
            }
        }

        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, options)
        .then((res) => res.json())
        .then((todo: Todo) => {
            myTodo = todo;
            setTitle(todo.title);
            setCompleted(todo.completed);
        });
    }, []);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedTodo: Todo = {
                userId: myTodo.userId,
                id: id,
                title: title,
                completed: completed

            }
        updateTodo(id, updatedTodo).then((data: Todo) => {
            console.log(data);
            router.replace('/caching/todos');
        });
    }

    const handleTitle = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        e.preventDefault();
        setTitle(e.target.value);
    }

    const handleRadio = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, radio_value: string) => {
        //e.preventDefault(); //default behaviour needs to happen for radio to function as intended.
        setCompleted(radio_value === "Yes" ? true : radio_value === "No" ? false : false);
    }

    /**
     * Because we've used event handlers like onClick, onChange, onSubmit, this can't be a server component.
     * This means we can't have updateTag() here because it only works in server actions. It doesn't work in route handlers either.
     * We could simply have the PUT request to add the todo happen here and then create a server action that runs updateTag() as the only line of code.
     * Instead, we'll have server action that does both: execute the PUT request to add the new todo & updateTag().
     * Unlike caching/todos/add where we used a route handler because they accept revalidateTag(), here, we can't use a route handler so we have to use a server action instead.
     * The server action will have to use the 'use server' directive to explicitly indicate that it's a server component.
     * If it doesn't, the default behavour is that Next.js bundles it together with the component it was called from and because this component is a client component, it because a client component too.
     * As such, the app ends up crashing or throwing a compilation exception because the server action has updateTag(), which is server-side logic that can't be used client-side.
     * 
     */
    return (
        <div> 
            <h1>Update Todo</h1>
            <form onSubmit={handleSubmit}>
                <p>Title</p>
                <input type="text" placeholder="Title" name="title" value={title} onChange={(e) => handleTitle(e)} /><br/>
                <p>Completed</p><br />
                <input type="radio" name="completed" value="Yes" checked={completed === true} onChange={(e) => handleRadio(e, e.target.value)}/>True<br/>
                <input type="radio" name="completed" value="No" checked={completed === false} onChange={(e) => handleRadio(e, e.target.value)}/>False<br/>
                <button type="submit">Update</button>
            </form>
            <br />
            <Link href="/caching/todos">Back to list</Link>
        </div>
    )
}

export default requireAuthCompositionPattern(UpdateTodoPage, account_required);