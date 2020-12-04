import React from 'react';
import ReactDOM from 'react-dom';

import { Clock } from './Main';

const rootHTML = document.createElement('div');
rootHTML.id = 'root';
document.body.after(rootHTML);

ReactDOM.render(
  React.createElement(Clock, { title: 'hello!' }),
  document.getElementById('root')
);

//let clock_A = new Clock({title: 'hello clock_A'});
