import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import Lampenhaus from './components/Lampenhaus/Lampenhaus';
import reducers from './reducers/reducers';
import './index.css';

const store = createStore(
    reducers,
    applyMiddleware(thunkMiddleware),
    // config for redux chrome dev tool, doesnt work with thunk apparently
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

render(
    <Provider store={store}>
        <Lampenhaus />
    </Provider>,
    document.getElementById('root'),
);
