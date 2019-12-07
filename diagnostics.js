const Log = require('./log');

//const PATH = '/home/mk/.gazebo/diagnostics/';
const PATH = '/home/mk/ws_study/gzModeling/diagnostics/';
const logs = LogsNew2Old(PATH);

//console.log(logs[0].date);
//console.log(logs[0].worldUpdate.values);
logs.forEach(log=> console.log(log.worldUpdate.SumAll('maxAbs')));
