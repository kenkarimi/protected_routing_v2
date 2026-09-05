import React, { FunctionComponent } from 'react';

import { AccountRequired } from './GlobalEnumerations';
import RequireAuth from './RequireAuth';

/**
 * Because we don't know whether we're receiving a client or server component as a child,
 * we have to pass it down to requireAuth, which is a client component, as props and 'slot' it(Just in case the child was a server component).
 * This is because we can't render a server component inside a client component otherwise.
 * We use a <Client> <Server/> <Client/> composition pattern in a parent server component(like this one) to send it down as a child prop. More here: https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#unsupported-pattern-importing-server-components-into-client-components
 */

 /**
  * Type added to FunctionComponent to make it FunctionComponent<any> because code/repos/:name(RepoPage) recieves a dynamic id typed as { params: { name: string }}
  * So to avoid an error in RepoPage when requireAuthCompositionPattern receives 'RepoPage' as a parameter/argument which isn't of type FunctionComponent but rather FunctionComponent<{ params: { name: string } }>,
  * We simply type it here as FunctionComponent<any> instead of the more accurate FunctionComponent<{ params: { name: string } }> because it may not be the only FunctionComponent in this project that receives a dynamic id/params and that type might be different from { params: { name: string } } e.g. { params: { numRepos: number } }
  * This strategy fits with how we handle props below with typing them as props: any. Generalized enough for any FunctionComponent to be ably to send any type of props downstream even though we know that the specific context in which its used in this project is a message wich is of type string in content/customers & content/investors.
  */
const requireAuthCompositionPattern = (Child: FunctionComponent<any>, account_required: AccountRequired) => {
    
    const NewComponent = (props: any) => {
        return (
            <RequireAuth account_required={account_required}> {/*account_required is passed down the same way we would've done it in a HOC in create-react-app using react-router-dom. It's also received the same way in requireAuth.*/}
                <Child {...props} /> {/*Passes down the message prop passed to the embeded <Home /> component in /content/customers and /content/investors to the Child*/}
            </RequireAuth>
        )
    }
    
    return NewComponent;
}

export default requireAuthCompositionPattern;