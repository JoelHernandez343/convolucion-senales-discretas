let convPeriodica = (x, y, cx, cy) => {
  let ans = Array.from(new Array(x.length)).map(e => 0);

  var begin = x.length > y.length ? y.length :  y.length % x.length, centro;

  for (var i = 0; i < y.length; ++i){

    var trueBegin = begin - i;

    if (trueBegin < 0){
      trueBegin *= -1;
      trueBegin %= x.length;
      trueBegin = x.length - trueBegin;
      trueBegin %= x.length;
    }

    for (var count = 0, j = trueBegin; count < x.length; ++count, ++j){
      ans[count] += y[i] * x[j];

      if (i == cy && j == cx){
        centro = count;
      }

      if (j >= x.length - 1) j = -1;
    }
  }

  // var centro = begin - cy;

  // if (centro < 0){
  //   var tmp = x.length - 1 - begin;
  //   tmp -= centro;
  //   tmp %= x.length;
  //   centro = x.length - 1 - tmp;
  // }
  // centro = cx < centro ? cx + x.length - centro : cx - centro;

  return { "arreglo": ans, "centro": centro};
}

export { convPeriodica as cPeriodica }

// let x = [1, 2, 0, -1, 1];
// let y = [-2, -1, 3, 1];

// let ans = convPeriodica(x, y, 0, 3);

// console.log(ans.arreglo, ans.centro, ans.arreglo[ans.centro]);