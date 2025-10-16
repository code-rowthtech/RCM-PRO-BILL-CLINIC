// @flow
import React, { useEffect } from 'react';
import Routes from './routes/Routes';

// setup fake backend
import { configureFakeBackend } from './helpers';

// Themes

// For Saas import Saas.scss
import './assets/scss/Saas.scss';
import './components/timeZonePipe';
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

// color Changing of select options and date inputs
function useSelectColorWatcher() {
  useEffect(() => {
    const updateSelectColors = () => {
      const selects = document.querySelectorAll('.form-select');
      selects.forEach(select => {
        const value = select.value.trim();
        select.style.color = value === '' ? '#0908084f' : 'black';
      });

      const dateInputs = document.querySelectorAll('input[type="date"]');
      dateInputs.forEach(input => {
        const value = input.value.trim();
        input.style.color = value === '' ? '#0908084f' : 'black';
      });
    };

    // Initial update
    updateSelectColors();

    // Listen for changes to the DOM
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      mutations.forEach(mutation => {
        if (
          mutation.type === 'childList' ||
          (mutation.type === 'attributes' && mutation.attributeName === 'value')
        ) {
          needsUpdate = true;
        }
      });
      if (needsUpdate) updateSelectColors();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['value']
    });

    // Listen for user changes
    const handleChange = () => updateSelectColors();
    const attachListeners = () => {
      const selects = document.querySelectorAll('.form-select');
      selects.forEach(select => {
        select.addEventListener('change', handleChange);
      });

      const dateInputs = document.querySelectorAll('input[type="date"]');
      dateInputs.forEach(input => {
        input.addEventListener('change', handleChange);
      });
    };

    const detachListeners = () => {
      const selects = document.querySelectorAll('.form-select');
      selects.forEach(select => {
        select.removeEventListener('change', handleChange);
      });

      const dateInputs = document.querySelectorAll('input[type="date"]');
      dateInputs.forEach(input => {
        input.removeEventListener('change', handleChange);
      });
    };

    attachListeners();

    // Update styles if new elements are added later
    const intervalId = setInterval(() => {
      updateSelectColors();
      attachListeners();
    }, 1000); // Re-check every second just in case

    return () => {
      observer.disconnect();
      detachListeners();
      clearInterval(intervalId);
    };
  }, []);
}

const App = (props: AppProps): React$Element<any> => {
  useSelectColorWatcher();

  return <Routes></Routes>;
};

export default App;
