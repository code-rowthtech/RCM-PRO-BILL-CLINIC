import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import './main.css'
import './i18n';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'react-quill/dist/quill.snow.css';
ReactDOM.render(
    <Provider store={configureStore({})}>
        <ReactNotifications />
        <App />
    </Provider>,
    document.getElementById('root')
);
// index.js or main entry file
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';
// import { Provider } from 'react-redux';
// import { configureStore } from './redux/store';
// import './main.css';
// import './i18n';
// import { ReactNotifications } from 'react-notifications-component';
// import 'react-notifications-component/dist/theme.css';
// import 'react-quill/dist/quill.snow.css';

// // Create store **once**
// const store = configureStore({});

// const root = createRoot(document.getElementById('root'));
// root.render(
//     <Provider store={store}>
//         <ReactNotifications />
//         <App />
//     </Provider>
// );
