const process = require('process')
    , child_process = require('child_process');

const pcsLaunch = [process.env['PCS_LAUNCH_PATH'], 'pcs_dev.launch'].join('/');
const iteration = 50;
let errV = [];

process.env['GZMODELING_NUM_POCO'] = 0;
startPCS();
process.on('exit', code=>{
    console.log('exit code :',code);
    console.log('error iterations :', errV);
});


function startPCS(){
    let pcs = child_process.spawn('roslaunch', [pcsLaunch]/*options=[]*/);

    pcs.stderr.on('data', data=>{
        if(String(data).search('process has died') !== -1)
            errV.push(process.env['GZMODELING_NUM_POCO']);
    });

    pcs.on('exit', code=>{
        console.log('exit: '+code);
        if(Number(process.env['GZMODELING_NUM_POCO']) === 1+iteration)
            return;

        process.env['GZMODELING_NUM_POCO'] = Number(process.env['GZMODELING_NUM_POCO'])+1;
        startPCS();
    });

    setTimeout(()=>{
        console.log(pcs.pid);
        pcs.kill('SIGINT');
    }, 60000);
}

