const fs = require('fs');
LogFile = function(){
    this.values =  {
        maxAbs: {},
        mean: {},
        min: {},
        variate: {}
    };
};

LogFile.prototype.setText = function(text) {
    this.fulltext = text;

    let tokens = text.replace(/\n/gi,'').split(/[ ,]+/);
    tokens.pop();
    tokens.reverse();

    while(tokens.length !== 0)
    {
        let id = tokens.pop();//ID
        tokens.pop();//maxAbs
        this.values.maxAbs[id] = tokens.pop();
        tokens.pop();//mean
        this.values.mean[id] = tokens.pop();
        tokens.pop();//min
        this.values.min[id] = tokens.pop();
        tokens.pop();//variate
        this.values.variate[id] = tokens.pop();
    }
};

function sumArray(array){
  let ret = 0;
  array.forEach(val=>ret+=Number(val));
  return ret;
}

LogFile.prototype.SumAll = function(whatValue) {
    return sumArray(Object.values(this.values[whatValue]));
};

Log = function(path, date) {
    let files = fs.readdirSync([path, date].join('/'));

    this.date = date;
    this.odePhysics = new LogFile();
    this.odeCollision = new LogFile();
    this.worldStep = new LogFile();
    this.worldUpdate = new LogFile();

    files.forEach(file=>{
        let fileText = fs.readFileSync([path, date, file].join('/'), 'utf-8');

        if(file.search('UpdateCollision.log') !== -1)
            this.odeCollision.setText(fileText); 
        else if(file.search('UpdatePhysics.log') !== -1)
            this.odePhysics.setText(fileText); 
        else if(file.search('Step.log') !== -1)
            this.worldStep.setText(fileText); 
        else if(file.search('Update.log') !== -1)
            this.worldUpdate.setText(fileText); 
    });
}

LogsNew2Old = function(path) {
    const Day = str => str.trim().split('T')[0].split('-').join('');
    const Time = str => str.trim().split('T')[1].split(':').join('');

    let logs = fs.readdirSync(path);
    logs.sort((a, b)=>{
        aDay = Day(a);
        bDay = Day(b);
        if(aDay!==bDay)
            return bDay-aDay;

        aTime = Time(a);
        bTime = Time(b);
        return bTime-aTime;
    });

    let logObjs = [];
    logs.forEach(log=>{
        logObjs.push(new Log(path, log));
    });

    return logObjs;
}

module.exports = Log;
module.exports = LogsNew2Old;
