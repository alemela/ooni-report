var fs = require('fs');
var yamlator = require('./yamlator.js');

var mainArray = [];

var save2disk = function (obj) {
    //console.log(obj);
    obj.forEach(function (o) {
        fs.writeFileSync("output/" + o.key + ".json", JSON.stringify(o.json, null, 4));
    });
}


var tcp_connectDigest = function (data) {
    if (data.record_type === "entry" && data.connection !== undefined) {
        var json = {};
        var kFlag = 1;
        var date = yamlator.calcDate(data.start_time);
        var id = data.probe_cc + "_" + date.year + "_" + date.month;
        
        mainArray.forEach(function (e) {
            if (e.key === id) {
                json = e.json;
                kFlag = 0;
            }
        });

        if (kFlag) {
            var o = {}
            o.key = id;
            o.json = {};
            mainArray.push(o);
        }

        if (json.tcpConnect === undefined) {
            json.tcpConnect = {};
            json.tcpConnect.versions = [];
            json.tcpConnect.domains = [];
        }
        if (!indexOf(json.tcpConnect.versions, data.test_version))
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

        mainArray.forEach(function (e) {
            if (e.key === id)
                e.json = json;
        });
    }
}

var dns_injectionDigest = function (data) {
    if (data.record_type === "entry" && data.connection !== undefined) {
        var json = {};
        var date = yamlator.calcDate(data.start_time);
        var outputFile = 'output/' + data.probe_cc + "_" + date.year + "_" + date.month + ".json";
        if (fs.existsSync(outputFile)) {
            json = JSON.parse(fs.readFileSync(outputFile));
        }
        if (json.dnsInjection === undefined) {
            json.dnsInjection = {};
            json.dnsInjection.versions = [];
            json.dnsInjection.domains = [];
        }
        json.dnsInjection.versions.push(data.test_version);

        var flag = 0;
        for (var i = 0; i < json.dnsInjction.domains.length; i++) {
            if (json.dnsInjection.domains[i].url === data.input) {
                json.dnsInjection.domains[i].totalTests++;
                if (data.connection === "success")
                    json.dnsInjection.domains[i].totalSucceded++;
                flag = 1;
                break;
            }
        }

        if (!flag) {
            var obj = {};
            obj.url = data.input;
            obj.totalTests = 1;
            obj.totalSucceded = 1;
            json.dnsInjection.domains.push(obj);
        }
        fs.writeFileSync(outputFile, JSON.stringify(json, null, 4));
    }
}

var indexOf = function(array, needle) {
    for(var i = 0; i < array.length; i++) {
        if(array[i] === needle) {
            return 1;
        }
    }
    return 0;
};

yamlator.searchDir(process.argv[2], function (d) {
    d.forEach(function (dir) {
      if (fs.lstatSync(process.argv[2] + "/" + dir).isDirectory()) {
            yamlator.searchDir(process.argv[2]+"/"+dir, function (f) {
                var counter = 0;
                f.forEach(function (file) {
                    if (file.indexOf('tcp_connect') > -1) {
                        yamlator.digestYamlArchived(process.argv[2]+dir+"/"+file, function (d) {
                            if (d !== 0) {
                                tcp_connectDigest(d);
                            } else {
                                save2disk(mainArray);
                            }
                        });
                    }
                    if (file.indexOf('dns_injection') > -1) {
                        yamlator.digestYamlArchived(process.argv[2]+dir+"/"+file, function (d) {
                            //dns_injectionDigest(d);
                        });
                    }
                });                    
            });
        }
    });
});