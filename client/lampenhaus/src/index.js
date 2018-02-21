import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import LampenhausWrapper from './components/LampenhausWrapper/LampenhausWrapper';
import reducers from './reducers/reducers';
import './index.css';
import './assets/global.css';

const store = createStore(
    reducers,
    // config for redux chrome dev tool
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunkMiddleware),
);

render(
    <Provider store={store}>
        <LampenhausWrapper />
    </Provider>,
    document.getElementById('root'),
);
