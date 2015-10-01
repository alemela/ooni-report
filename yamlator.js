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

var tcp_connectDigest = function (data) {
    if (data.record_type === "entry" && data.connection !== undefined) {
        var json = {};
        var date = calcDate(data.start_time);
        var outputFile = 'output/' + data.probe_cc + "_" + date.year + "_" + date.month + ".json";
        if (fs.existsSync(outputFile)) {
            json = JSON.parse(fs.readFileSync(outputFile));
        }
        if (json.tcpConnect === undefined) {
            json.tcpConnect = {};
            json.tcpConnect.versions = [];
            json.tcpConnect.domains = [];
        }
        json.tcpConnect.versions.push(data.test_version);

        var flag = 0;
        for (var i = 0; i < json.tcpConnect.domains.length; i++) {
            if (json.tcpConnect.domains[i].url === data.input) {
                json.tcpConnect.domains[i].totalTests++;
                if (data.connection === "success")
                    json.tcpConnect.domains[i].totalSucceded++;
                flag = 1;
                break;
            }
        }

        if (!flag) {
            var obj = {};
            obj.url = data.input;
            obj.totalTests = 1;
            obj.totalSucceded = 1;
            json.tcpConnect.domains.push(obj);
        }
        fs.writeFileSync(outputFile, JSON.stringify(json, null, 4));
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

