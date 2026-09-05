export type AccountType = 'customer' | 'investor' | null;
//type AccountType = string | null; //If you don't mind the string being anything, you can do this.
//NB: An enum can't achieve this because while you can assign Customer = 'customer' & Investor = 'investor', you can't assign Default = null or undefined.

export type Account = {
    logged_in: boolean;
    account_type: AccountType;
    email: string;
}

export interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}