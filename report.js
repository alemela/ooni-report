var fs = require('fs');
var yamlator = require('./yamlator.js');

var tcp_connectDigest = function (data) {
    if (data.record_type === "entry" && data.connection !== undefined) {
        var json = {};
        var date = yamlator.calcDate(data.start_time);
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

yamlator.searchDir(process.argv[2], function (d) {
    d.forEach(function (dir) {
        yamlator.searchDir(process.argv[2]+"/"+dir, function (f) {
            f.forEach(function (file) {
                if (file.indexOf('tcp_connect') > -1) {
                    yamlator.digestYamlArchived(process.argv[2]+dir+"/"+file, function (d) {
                        tcp_connectDigest(d);
                    });
                }
                if (file.indexOf('dns_injection') > -1) {
                    //yamlator.digestYamlArchived(process.argv[2]+dir+"/"+file);
                }
            });
        });
    });
});