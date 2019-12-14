'use strict';

/* !!! FIXME !!!  Modify this path */
let diagPath = '/home/mk/.gazebo/diagnostics/';

(()=>{
const Log = require('./log')
    , fs = require('fs')
    , process = require('process');

if( process.argv.pop() === 'test' || !fs.existsSync(diagPath))
  diagPath = './diagnostics/';

main();

function main() {
  const logs = Log.LogsNew2Old(diagPath);

  //printDiagnostics(logs);
  saveCSV(logs);
}

function printDiagnostics(logs) {
  logs.forEach(log=> {
    console.log('\n\n',log.date);
    console.log('maxAbs  : ', log.SumAllAll('maxAbs'));
    console.log('mean    : ', log.SumAllAll('mean'));
    console.log('min     : ', log.SumAllAll('min'));
    console.log('var     : ', log.SumAllAll('variate'));
    console.log('-- step estimation --');
    console.log('maxAbs  : ', 1/log.SumAllAll('maxAbs'));
    console.log('mean    : ', 1/log.SumAllAll('mean'));
    console.log('min     : ', 1/log.SumAllAll('min'));
    console.log('var     : ', 1/log.SumAllAll('variate'));
  });
};

function saveCSV(logs) {
  /*   /iteration/   file,  section,  maxAbs, mean, min, variate 
   *       0      odePhisics odeCollision worldStep worldUpdate
   *       1
   *       ...
   */
  let csvStr = "iteration,file,section,type,value\n";
  let iter= 0;

  logs.reverse(); // for asscending to date
  logs.forEach(log=> {

      log.files.forEach(file=>{
          file.values.forEach(value=>{
              csvStr += `${String(iter)},`;
              csvStr += `${file.filename},`;
              csvStr += `${value.section},`;
              csvStr += `${value.type},`;
              csvStr += `${String(value.value)}\n`;
          });
      });

      iter++;
  });
  console.log(csvStr);
  fs.writeFileSync('test.csv', csvStr, 'utf8');
}

})();
