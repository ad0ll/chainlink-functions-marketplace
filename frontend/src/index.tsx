import ReactDOM from 'react-dom/client';
import React from 'react';
import './assets/index.css';

import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import {RecoilRoot} from "recoil";

import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
export const graphqlClient = new ApolloClient({
  //TODO Hope this isn't private
  uri: "https://subgraph.satsuma-prod.com/5636b4e4f174/2f2cac0b14bf2592543789045a02fa2ea9f0a91ab1f6e23e8859e8e618e6d1a7/example-subgraph-name/api",
  cache: new InMemoryCache(),
});
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode>
    <RecoilRoot>
        <App/>
    </RecoilRoot>
</React.StrictMode>);