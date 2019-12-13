;'use strict';

const process = require('process')
    , child_process = require('child_process');

const PCS_LAUNCH = [process.env['PCS_LAUNCH_PATH'], 'pcs_dev.launch'].join('/')
    , MAX_ITERATION = 50;

let failures = [];

process.on('exit', code=>{
    console.log('exit code :',code);
    console.log('failure iterations :', failures);
});
process.env['GZMODELING_NUM_POCO'] = 0;
startPCS();


function startPCS() {
    let pcs = child_process.spawn('roslaunch', [PCS_LAUNCH]);
    let numPoco = Number(process.env['GZMODELING_NUM_POCO']);

    console.log(`\niteration : ${numPoco}/${MAX_ITERATION}`);
    console.log('loading ...');

    pcs.stderr.on('data', data=>{
        if(String(data).search('process has died') === -1)
            return;

        failures.push(numPoco);
        console.log('failure iterations :', failures);
    });

    pcs.on('exit', code=>{
        console.log('exit: '+code);
        if(numPoco === MAX_ITERATION+1)
            return;

        process.env['GZMODELING_NUM_POCO'] = numPoco+1;
        startPCS();
    });

    setTimeout(()=>{
        console.log('killing ...');
        pcs.kill('SIGINT');
    }, 10000);
}
