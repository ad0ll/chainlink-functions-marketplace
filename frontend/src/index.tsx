import ReactDOM from 'react-dom/client';
import React from 'react';
import './assets/index.css';

import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import {RecoilRoot} from "recoil";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode>
    <RecoilRoot>
        <App/>
    </RecoilRoot>
</React.StrictMode>);