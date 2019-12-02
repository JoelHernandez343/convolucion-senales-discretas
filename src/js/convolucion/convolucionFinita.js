let convolucionFinita = (x, y, cx, cy) => {
  let ans = new Array(x.length + y.length - 1);

  for (var i = 0; i < ans.length; ++i) ans[i] = 0;

  for (var i = 0; i < y.length; ++i){
    let k = i;
    
    for (var j = 0; j < x.length; ++j){
      ans[k++] += y[i] * x[j];
    }
  }

  return { "arreglo": ans, "centro": cx + cy};
}

// let x = [1, 2, 3, 2, 1];
// let y = [1, 2, 3, 2, 1];

// let ans = convolucionFinita(x, y, 2, 2);

// var data = '';
// for (var i = 0; i < ans.arreglo.length; ++i){
//   data += ans.arreglo[i] + ' ';
// }

// console.log(data, ans.centro,ans.arreglo[ans.centro]);

export { convolucionFinita as cFinita }