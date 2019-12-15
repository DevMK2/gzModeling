'use strict';

const fs = require('fs')
    , Log = require('./log');


testPreprocessing();

function testPreprocessing() {
  let testLog = new Log('.', 'testLog');

  let abss = [];
  testLog.files[0].values.filter(item=>item.type==='maxAbs').forEach(abs=>{
    abss.push(abs.value);
  });
  console.log(abss);
  abss.sort();
  console.log(abss);
  let result = [abss[0]];
  for(let i=1; i!=abss.length; ++i) {
    result.push(abss[i] - abss[i-1]);
  }
  console.log(result.sort());

  testLog.preprocessing(); 
  abss = [];
  testLog.files[0].values.filter(item=>item.type==='maxAbs').forEach(abs=>abss.push(abs.value));
  console.log(abss.sort() === result.sort())

  console.log(abss.sort());
  console.log(result.sort());
}



function getValue(str, indicator = 'maxAbs') {
  let lines = str.trim().split('\n');
  let values = [];
  lines.forEach(line=>{
    let indicatorIDX = line.search(indicator) + indicator.length;
    values.push(Number(line.substr(indicatorIDX).trim().split(' ').shift()));
  });

  let first = values.shift();
  let sumation = 0;
  values.forEach(value=>sumation+=value);

  console.log(first);
  console.log(sumation/values.length);
}

