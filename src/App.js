// @flow
import React, { useEffect } from 'react';
import Routes from './routes/Routes';

// setup fake backend
import { configureFakeBackend } from './helpers';

// Themes

// For Saas import Saas.scss
import './assets/scss/Saas.scss';

// For Modern demo import Modern.scss
// import './assets/scss/Modern.scss';

// For Creative demo import Creative.scss
// import './assets/scss/Creative.scss';

// configure fake backend
configureFakeBackend();

type AppProps = {};

/**
 * Main app component
 */
const App = (props: AppProps): React$Element<any> => {
    // useEffect(() => {
    //     function updateSelectColors() {
    //         const selects = document.getElementsByClassName('form-select');
    //         Array.from(selects).forEach(select => {
    //             select.style.color = select.value === '' ? 'red' : 'black';
    //         });
    //     }

    //     updateSelectColors();

    //     const observer = new MutationObserver(() => {
    //         updateSelectColors();
    //     });

    //     observer.observe(document.body, {
    //         childList: true,
    //         subtree: true,
    //     });

    //     // Add listeners
    //     const attachListeners = () => {
    //         const selects = document.getElementsByClassName('form-select');
    //         Array.from(selects).forEach(select => {
    //             select.addEventListener('change', updateSelectColors);
    //         });
    //     };

    //     attachListeners();

    //     return () => {
    //         observer.disconnect();
    //         const selects = document.getElementsByClassName('form-select');
    //         Array.from(selects).forEach(select => {
    //             select.removeEventListener('change', updateSelectColors);
    //         });
    //     };
    // }, []);


    return <Routes></Routes>;
};

export default App;
