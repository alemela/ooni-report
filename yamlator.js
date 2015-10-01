var crypto = require('crypto');
var fs = require('fs');
var yaml = require('js-yaml');
var exec = require('child_process').exec;


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

var tcp_connectDigest = function (data) {
    if (data.record_type === "entry" && data.connection !== undefined) {
    var date = new Date(data.start_time*1000)
    console.log(date.getFullYear() + " " + date.getMonth() + " " + date.getDate());
    console.log(data.test_version);
    console.log(data.connection);
    console.log(data.input);
    console.log(data.probe_cc);
    console.log(data.start_time);
    console.log("-------------------------");
    }
}

searchDir(process.argv[2], function (d) {
    d.forEach(function (dir) {
        searchDir(process.argv[2]+"/"+dir, function (f) {
            f.forEach(function (file) {
                if (file.indexOf('tcp_connect') > -1) {
                    digestYamlArchived(process.argv[2]+dir+"/"+file, function (d) {
                        tcp_connectDigest(d);
                    });
                }
                if (file.indexOf('dns_injection') > -1) {
                    //digestYamlArchived(process.argv[2]+dir+"/"+file);
                }
            });
        });
    });
});

