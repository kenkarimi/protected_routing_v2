
/**
 * 'AccountRequired' isn't an RSC. It's a named export imported from this server file(lacks the 'use client' directive)
 * This means it can be imported and used in client components as we've done in RequireAuth.tsx, /content/customers & /content/investors
 */
export enum AccountRequired { //Numbered from 0 by default.
   Customer,
   Investor,
   Any
}

//export default { AccountRequired } //put in curly braces in order to export more than one.