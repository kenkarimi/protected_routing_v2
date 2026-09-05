'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import requireAuthCompositionPattern from '@/app/_utils/RequireAuthCompositionPattern';
import { AccountRequired } from '@/app/_utils/GlobalEnumerations';
import { Todo } from '@/app/_utils/GlobalInterfacesAndTypes';

const account_required: AccountRequired = AccountRequired.Any;

const AddTodoPage = () => {

  const router = useRouter();

  const [title, setTitle] = useState<string>('');

  /**
   * Can't use uuid because it only gives string ids and we need numerical ones.
   * Remember this is not a real id generator. As such there's a small chance that a number might be repeated. That doesn't matter though because this isn't a real API so no data is actually being added to a db.
   * Math.random() only gives decimals under 1, you must combine it with scaling math and other Math functions to get usable integers or custom ranges.
   */
  function getRandomInt() {
    let min: number = 0;
    let max: number = 1000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    e.preventDefault();
    setTitle(e.target.value);
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const options: object = {
      method: 'POST',
      headers: {
        Accept: 'application/json', //Or '*/*' if you wanted to be more general. In our case, we know exacly what we're getting back.
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: getRandomInt(),
        title: title,
        completed: false
      })
    }

    fetch('/caching/todos/add/api', options)
    .then((res: any) => res.json())
    .then((data: Todo) =>{
      console.log(data);
      router.replace('/caching/todos');
    });
  }

  /**
   * Because we've used event handlers like onClick, onChange, onSubmit, this can't be a server component.
   * This means we can't have revalidateTag() here because it only works in server actions and route handlers.
   * We could simply have the POST request to add the todo happen here and then create a route handler that runs revalidateTag() as the only line of code.
   * Instead, we'll have a route handler that does both: execute the POST request to add the new todo & revalidateTag().
   */
  return (
    <div> 
      <h1>Add Todo</h1>
      <form onSubmit={handleSubmit}>
        <p>Title</p>
        <input type="text" placeholder="Title" name="title" onChange={(e) => handleChange(e)}/><br/>
        <button type="submit">Add</button>
      </form>
      <br />
      <Link href="/caching/todos">Go to list</Link>
    </div>
  )
}

export default requireAuthCompositionPattern(AddTodoPage, account_required);