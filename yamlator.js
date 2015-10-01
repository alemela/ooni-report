var crypto = require('crypto');
var fs = require('fs');
var yaml = require('js-yaml');
var exec = require('child_process').exec;

var calcDate = function (seconds) {
    var d = {}; 
    var date = new Date(seconds*1000)

    d.year = date.getFullYear();
    d.month = (parseInt(date.getMonth())+1).toString();

    return d;
}


var makeSHA1Hash = function (data) {
    var hash = crypto.createHash('sha1');
    return hash.update(data, 'utf8').digest('hex');
}


var searchDir = function (dir, cb) {
    fs.readdir(dir, function (err, files) {
        if (err) {
            console.error(err);
            process.exit();
        }
        cb(files);
    });
}


var extractArchive = function (archive, cb) { //XXX
    var hash = makeSHA1Hash(archive);
    child = exec('gunzip -c ' + archive + ' > ' + hash + '.yml', function (error, stdout, stderr) {      
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        cb(hash + '.yml');
        return;
    });
}


var digestYamlArchived = function (path, cb) {
    extractArchive(path, function (p) {
        try {
            var rl = require('readline').createInterface({
              input: fs.createReadStream(p),
              terminal: false
            });
            var chunk = "";
     
            rl.on("line", function (line) {
                if (line.indexOf('...') < 0) //se no
                    chunk+=line+"\n";
                if (line.indexOf('...') >= 0) { //se sì
                    chunk+=line;
                    var doc = yaml.safeLoadAll(chunk, function (doc) {
                        cb(doc);
                    });
                    chunk="";
                }
            });

            rl.on("close", function (c) {
                fs.unlinkSync(p);
            });
        } catch (e) {
            console.log(e);
        }
    });
}

exports.searchDir = searchDir;
exports.calcDate = calcDate;
exports.makeSHA1Hash = makeSHA1Hash;
exports.extractArchive = extractArchive;
exports.digestYamlArchived = digestYamlArchived;
