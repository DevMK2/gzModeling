const Log = require('./log');

const PATH = '/home/mk/.gazebo/diagnostics/';
//const PATH = '/home/mk/ws_study/gzModeling/diagnostics/';
const logs = LogsNew2Old(PATH);

//console.log(logs[0].date);
//console.log(logs[0].worldUpdate.values);
logs.forEach(log=> {
    console.log('\n\n',log.date);
    console.log('maxAbs  : ', log.SumAllAll('maxAbs'));
    console.log('mean    : ', log.SumAllAll('mean'));
    console.log('min     : ', log.SumAllAll('min'));
    console.log('var     : ', log.SumAllAll('variate'));
    console.log('--step est--');
    console.log('maxAbs  : ', 1/log.SumAllAll('maxAbs'));
    console.log('mean    : ', 1/log.SumAllAll('mean'));
    console.log('min     : ', 1/log.SumAllAll('min'));
    console.log('var     : ', 1/log.SumAllAll('variate'));
});
saveCsv(logs);

//maxAbs mean min var, maxAbs mean min var


function saveCsv(logs) {
    /*   /iteration/   maxAbs,  mean,  min,   variate
     *       0      odePhisics odeCollision worldStep worldUpdate
     *       1
     *       2
     *       ...
     */
    let csvStr = "maxAbs,mean,min,var\n";
    logs.reverse();
    logs.forEach(log=> {
        csvStr += 1/log.SumAllAll("maxAbs") + ',';

        csvStr += 1/log.SumAllAll("mean") + ',';

        csvStr += 1/log.SumAllAll("min") + ',';

        csvStr += 1/log.SumAllAll("variate") + '\n';
    });
    fs = require('fs');
    fs.writeFileSync('test.csv', csvStr, 'utf8');
}
