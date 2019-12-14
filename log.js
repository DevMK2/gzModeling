'use strict';

const fs = require('fs');
var LogFile = function(filename, fileText){
    this.filename = filename;
    this.values = [];
    this.setText(fileText);
};

LogFile.prototype.setText = function(text) {
    this.fulltext = text;

    let tokens = text.replace(/\n/gi,'').split(/[ ,]+/);
    tokens.pop();
    tokens.reverse();

    while(tokens.length !== 0)
    {
        let section = tokens.pop().split('::').pop();

        while(tokens.length !== 0){
            let type = tokens.pop();//maxAbs, mean, min ... etc
            if(type.search('::') !== -1) { // this is not a type but section
                tokens.push(type);
                break;
            }

            let value = {section: section, type: type, value: tokens.pop()};
            this.values.push(value);
        }
    }
};

function sumArray(array){
  let ret = 0;
  array.forEach(val=>ret+=Number(val));
  return ret;
}

LogFile.prototype.Value = function(whatValue, whatSection) {
    return this.values[whatValue][whatSection];
};

var Log = function(path, date) {
    let fileNames = fs.readdirSync([path, date].join('/'));

    this.date = date;
    this.files = [];

    fileNames.forEach(file=>{
        let a =file.lastIndexOf(':') + 1 , z = file.search('.log');

        let fileName = file.substr(a, z-a)
          , fileText = fs.readFileSync([path, date, file].join('/'), 'utf-8');

        let logFile =  new LogFile(fileName, fileText);
        this.files.push(logFile);
    });
}


Log.LogsNew2Old = function(path) {
    const Day = str => str.trim().split('T')[0].split('-').join('');
    const Time = str => str.trim().split('T')[1].split(':').join('');

    let logs = fs.readdirSync(path);
    logs.sort((a, b)=>{
        let aDay = Day(a)
          , bDay = Day(b);
        if(aDay!==bDay)
            return bDay-aDay;

        let aTime = Time(a)
          , bTime = Time(b);
        return bTime-aTime;
    });

    let logObjs = [];
    logs.forEach(log=> logObjs.push(new Log(path, log)));

    return logObjs;
}

module.exports = Log;
