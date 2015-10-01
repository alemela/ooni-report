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


var digestYamlArchived = function (path) {
    extractArchive(path, function (p) {
        try {
            var doc = yaml.safeLoadAll(fs.readFileSync(p, 'utf8'), function (doc) {
                console.log(doc);
            });
        } catch (e) {
            console.log(e);
        }
    });
}

searchDir(process.argv[2], function (d) {
    d.forEach(function (dir) {
        searchDir(process.argv[2]+"/"+dir, function (f) {
            f.forEach(function (file) {
                if (file.indexOf('tcp_connect') > -1) {
                //    digestYamlArchived(process.argv[2]+dir+"/"+file);
                }
                if (file.indexOf('dns_injection') > -1) {
                    digestYamlArchived(process.argv[2]+dir+"/"+file);
                }
            });
        });
    });
});

