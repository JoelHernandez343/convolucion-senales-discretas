import { D } from './../rename/rename.js';
import { cFinita } from './../convolucion/convolucionFinita.js';
import { cPeriodica } from './../convolucion/convolucionPeriodica.js';

let validateNumber = e => {

  if (e.match(/^-?\d+$/)) {
    return parseInt(e);
  }

  if (e.match(/^-?\d*\.\d+$/)) {
    return parseFloat(e);
  }

  if (e.match(/^-?\d+\/[1-9]\d*$/)) {
    let parts = e.split(/\//);
    let a = parseInt(parts[0]);
    let b = parseInt(parts[1]);
    console.log(a, b);
    return a / b;
  }

  return NaN;

}

let getData = chosen => {
  let data = D.getElementById(`s${chosen}`).value;

  data = data.replace(/ /g, '').split(/,/);

  data = data.map(e => validateNumber(e)).filter(e => e == e);

  return data;
}

let getCenter = chosen => {
  let centro = D.getElementById(`cs${chosen}`).value;

  return centro.match(/^\d+$/) ? parseInt(centro) : NaN;
}

let getDomain = (n, center) => {
  return new Array(n).fill().map((e, i) => i - center);
}

let esPeriodica = chosen => {
  return D.getElementById(`ps${chosen}`).checked;
}

let makePeriod = (data, center) => {
  let newData = new Array(3 * data.length).fill().map( e => 0);
  let len = newData.length;
  let middle = ~~(len / 2);

  newData[middle] = data[center];
  
  var i = center - 1 < 0 ? data.length - 1 : center - 1;

  for (var j = middle - 1; j >= 0; --i, --j){
    newData[j] = data[i];

    if (i - 1 < 0){
      i = data.length;
    }
  }

  i = center + 1 == data.length ? 0 : center + 1;

  for (var j = middle + 1; j < newData.length; i++, j++){
    newData[j] = data[i];

    if (i + 1 == data.length){
      i = -1;
    }
  }

  console.log(newData);


  return { "data": newData, "center": middle };
}

let buildGraph = (data, domain, chosen) => {

  let parent = D.getElementById(`graph${chosen}`).parentNode;
  while (parent.lastChild){
    parent.removeChild(parent.lastChild);
  }

  let canvas = D.createElement('canvas');
  canvas.setAttribute('id', `graph${chosen}`);
  parent.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: domain,
      datasets: [{
        data: data,
        backgroundColor: 'rgba(255, 0, 0)'
      }, {
        label: "My First dataset",
        type: "line",
        pointRadius: 3,
        pointHoverRadius: 4,
        backgroundColor: 'rgba(255, 0, 0)',
        data: data,
        showLine: false,
        fill: false,
      }]
    },
    options: {
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      scales: {
        xAxes: [{
          barThickness: 1,
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
        }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      maintainAspectRatio: false
    }
  });

  chart.canvas.parentNode.style.height = '200px';
}

function graph(e) {

  let chosen = this.id.charAt(2);
  let data = getData(chosen);
  let center = getCenter(chosen);

  if (!data.length) {
    throw 'No se ingresaron datos';
  }
  if (center != center) {
    throw 'El centro ingresado no es un entero positivo';
  }
  if (center >= data.length) {
    throw 'El centro no es un índice válido';
  }

  var newCenter = center;
  var newData = data;

  if (esPeriodica(chosen)){
    var newInfo = makePeriod(data, center);

    newCenter = newInfo.center;
    newData = [...newInfo.data];
  }

  var domain = getDomain(newData.length, newCenter);

  signals[chosen].data = data;
  signals[chosen].center = center;
  signals[chosen].periodica = esPeriodica(chosen);

  if (esPeriodica(chosen)){
    signals[chosen].periodo = data.length;
  }

  buildGraph(newData, domain, chosen);

}

let signals = {
  
  1: {
    data: [],
    center: 0,
    periodica: false,
    periodo: 0,
  },
  
  2: {
    data: [],
    center: 0,
    periodica: false,
    periodo: 0,
  },

  3: {
    data: [],
    center: 0,
    periodica: false,
    periodo: 0,
  }

}

let convolucionar = e => {
  if (!signals[1].data.length){
    throw 'No hay información de la señal 1';
  }

  if (!signals[2].data.length){
    throw 'No hay información de la señal 2';
  }

  let x = signals[1];
  let y = signals[2];
  var puntos = '';

  if (!x.periodica && !y.periodica){
    let ans = cFinita(x.data, y.data, x.center, y.center);

    signals[3].data = [...ans.arreglo];
    signals[3].center = ans.centro;
    signals[3].periodica = false;
    signals[3].periodo = 0;

    let domain = getDomain(ans.arreglo.length, ans.centro);
    buildGraph(ans.arreglo, domain, 3);
  }
  else if (x.periodica || y.periodica){

    puntos = '...';

    let xp = x;
    
    if (!x.periodica || (y.periodica && y.periodo > x.periodo)){
      xp = y;
      y = x;
    }

    let ans = cPeriodica(xp.data, y.data, xp.center, y.center);

    signals[3].data = [...ans.arreglo];
    signals[3].center = ans.centro;
    signals[3].periodica = true;
    signals[3].periodo = ans.arreglo.length;

    var newInfo = makePeriod(ans.arreglo, ans.centro);
    var centro = newInfo.center;
    var arreglo = [...newInfo.data];
    let domain = getDomain(arreglo.length, centro);
    buildGraph(arreglo, domain, 3);
  }

  var final = signals[3].data.map((e, i) => {
    if (i == signals[3].center){
      return '<span class="center">' + Number.parseFloat(e).toFixed(2) + ' </span>';
    }
    return Number.parseFloat(e).toFixed(2) + ' ';
  });

  D.getElementById('s3').innerHTML = puntos + final.toString() + puntos;

  var pPer = D.getElementById('ps3');

  pPer.innerHTML = signals[3].periodica ? 'Periodo: ' + signals[3].periodo : '';
}

export { graph, convolucionar };