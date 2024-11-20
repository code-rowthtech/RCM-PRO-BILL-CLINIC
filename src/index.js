import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import './main.css'
import './i18n';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
ReactDOM.render(
    <Provider store={configureStore({})}>
        <ReactNotifications />
        <App />
    </Provider>,
    document.getElementById('root')
);
