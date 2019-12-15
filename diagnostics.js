'use strict';

/* !!! FIXME !!!  Modify this path */
let diagPath = '/home/mk/.gazebo/diagnostics/';

(()=>{
const Log = require('./log')
    , fs = require('fs')
    , process = require('process');

let diagFile = process.argv.pop();
if(diagFile !== 'diagnostics.js' && fs.existsSync('./'+diagFile))
  diagPath = './' + diagFile;
else if(!fs.existsSync(diagPath)) {
  console.log('need diagnostics directory');
  process.exit(1);
}

main();


function main() {
  const logs = Log.LogsNew2Old(diagPath);
  saveCSV(logs);
}

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
      log.preprocessing();
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
  //console.log(csvStr);
  fs.writeFileSync('test.csv', csvStr, 'utf8');
}

})();
