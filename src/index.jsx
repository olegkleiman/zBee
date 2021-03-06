import React from "react";
import { render } from "react-dom";
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';
import store from './store';
import DataProvider from './DataContext';

render(<Provider store={store}>
          <App />
       </Provider>,
      document.getElementById("root"));
