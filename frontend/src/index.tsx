import ReactDOM from 'react-dom/client';
import React from 'react';
import './assets/index.css';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import {RecoilRoot} from "recoil";
import {ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache} from '@apollo/client';
import {RetryLink} from "@apollo/client/link/retry";

const httpLink = new HttpLink({
    // This URL shouldn't be accessible from any origin except the vercel app.
    // If you're able to access it, please let us know
    uri: "https://subgraph.satsuma-prod.com/5636b4e4f174/2f2cac0b14bf2592543789045a02fa2ea9f0a91ab1f6e23e8859e8e618e6d1a7/real-functions-manager3/api",
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