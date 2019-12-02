import { D } from './rename/rename.js';
import { graph, convolucionar } from './graph/graph.js';

const remote = require('electron').remote;

let toggleTools = () => remote.getCurrentWindow().toggleDevTools();

let minimize = e => {
  remote.getCurrentWindow().minimize();
}

let close = e => {
  remote.getCurrentWindow().close();
}

let show = e => {
  let main = D.querySelector('main');
  main.classList.add('showed');
}

let back = e => {
  let main = D.querySelector('main');
  main.classList.remove('showed');
}

let initialize = () => {
  D.getElementById('button').addEventListener('click', toggleTools);
  D.getElementById('close').addEventListener('click', close);
  D.getElementById('minimize').addEventListener('click', minimize);
  D.getElementById('back').addEventListener('click', back);
  D.getElementById('gs1').addEventListener('click', graph);
  D.getElementById('gs2').addEventListener('click', graph);
  D.getElementById('convolucionar').addEventListener('click', convolucionar);
  D.getElementById('about').addEventListener('click', show);
}

if (D.readyState == "loading") {
  D.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}