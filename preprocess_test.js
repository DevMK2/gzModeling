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
  abss.sort();
  let result = [abss[0]];
  for(let i=1; i!=abss.length; ++i) {
    result.push(abss[i] - abss[i-1]);
  }

  testLog.preprocessing(); 
  abss = [];
  testLog.files[0].values.filter(item=>item.type==='maxAbs').forEach(abs=>abss.push(abs.value));

  if(AssertArray(abss.sort(),result.sort()))
      console.log('calcAbsTime done');
  else {
      console.log(abss.sort());
      console.log(result.sort());
  }
}

function AssertArray(a, b) {
    if(a.length !== b.length)
        return false;

    for(let i=a.length-1; i>=0; --i)
        if(a[i] !== b[i]) return false;

    return true;
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

