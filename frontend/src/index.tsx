import ReactDOM from 'react-dom/client';
import React from 'react';
import './assets/index.css';

import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import {RecoilRoot} from "recoil";

import {ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache} from '@apollo/client';
import {RetryLink} from "@apollo/client/link/retry";

const httpLink = new HttpLink({
    // PLEASE DO NOT SHARE THIS URL OUTSIDE OF THE TEAM (the query key 563... is private).
    // This URL will be disabled and replaced w/ a public one when we launch.
    uri: "https://subgraph.satsuma-prod.com/5636b4e4f174/2f2cac0b14bf2592543789045a02fa2ea9f0a91ab1f6e23e8859e8e618e6d1a7/real-functions-manager2/api",
});
const retryLink = new RetryLink({
    delay: {
        initial: 100,
        max: 300,
        jitter: true
    },
    attempts: {
        max: 3
    }
});
export const graphqlClient = new ApolloClient({
    //TODO Below is private (query key). We're on free credit from QuickNode, so feel free to use internally, but please don't share
    cache: new InMemoryCache(),
    link: from([httpLink, retryLink])
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode>
    <RecoilRoot>
        <ApolloProvider client={graphqlClient}>
            <App/>
        </ApolloProvider>
    </RecoilRoot>
</React.StrictMode>);