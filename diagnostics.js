/* !!! FIXME !!!  Modify this path */
diagPath = '/home/mk/.gazebo/diagnostics/';

(()=>{
const Log = require('./log')
    , fs = require('fs')
    , process = require('process');

if( process.argv.pop() === 'test' || !fs.existsSync(diagPath))
  diagPath = './diagnostics/';

main();

function main() {
  const logs = LogsNew2Old(diagPath);

  printDiagnostics(logs);
  saveCSV(logs);
  saveCSVthe(logs, "World::Update");
  saveCSVthe(logs, "World::Update::ContactManager::PublishContacts");
  saveCSVthe(logs, "World::Update::LogRecordNotify");
  saveCSVthe(logs, "World::Update::PhysicsEngine::UpdatePhysics");
  saveCSVthe(logs, "World::Update::Events::beforePhysicsUpdate");
  saveCSVthe(logs, "World::Update::PhysicsEngine::UpdateCollision");
  saveCSVthe(logs, "World::Update::Model::Update");
  saveCSVthe(logs, "World::Update::Events::worldUpdateBegin");
  saveCSVthe(logs, "World::Update::needsReset");
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
  /*   /iteration/   maxAbs,  mean,  min,   variate
   *       0      odePhisics odeCollision worldStep worldUpdate
   *       1
   *       ...
   */
  let csvStr = "maxAbs,mean,min,var\n";
  logs.reverse();
  logs.forEach(log=> {
    csvStr += log.SumAllAll("maxAbs") + ',';
    csvStr += log.SumAllAll("mean") + ',';
    csvStr += log.SumAllAll("min") + ',';
    csvStr += log.SumAllAll("variate") + '\n';
  });
  fs.writeFileSync('test.csv', csvStr, 'utf8');
}

function saveCSVthe(logs, section) {
  let csvStr = "maxAbs,mean,min,var\n";
  logs.reverse();
  logs.forEach(log=> {
    if(log.worldUpdate.Value("maxAbs", section) === undefined)
        return;
    csvStr += log.worldUpdate.Value("maxAbs", section) + ',';
    csvStr += log.worldUpdate.Value("mean", section) + ',';
    csvStr += log.worldUpdate.Value("min", section) + ',';
    csvStr += log.worldUpdate.Value("variate", section) + '\n';
  });
  fs.writeFileSync(section.trim().split('::').pop()+'.csv', csvStr, 'utf8');
}
})();
