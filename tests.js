var fs = require('fs');
var yamlator = require('./yamlator.js');

var mainArray = [];

var save2disk = function (obj) {
    obj.forEach(function (o) {
        fs.writeFileSync("output/" + o.key + ".json", JSON.stringify(o.json, null, 4));
    });
}


var indexOf = function(array, needle) {
    for(var i = 0; i < array.length; i++) {
        if(array[i] === needle) {
            return 1;
        }
    }
    return 0;
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
            if (data.connection === "success") {
            obj.totalSucceded = 1;
            } else {
            obj.totalSucceded = 0;
            }
            json.tcpConnect.domains.push(obj);
        }

        mainArray.forEach(function (e) {
            if (e.key === id)
                e.json = json;
        });
    }
}

var dns_injectionDigest = function (data) {
    if (data.record_type === "entry") {
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
      
        if (json.dnsInjection === undefined) {
            json.dnsInjection = {};
            json.dnsInjection.versions = [];
            json.dnsInjection.domains = [];
        }
        if (!indexOf(json.dnsInjection.versions, data.test_version))
            json.dnsInjection.versions.push(data.test_version);

        var flag = 0;
        for (var i = 0; i < json.dnsInjection.domains.length; i++) {
            if (json.dnsInjection.domains[i].url === data.input) {
                json.dnsInjection.domains[i].totalTests++;
                if (data.injected === false)
                    json.dnsInjection.domains[i].totalNotInjected++;
                flag = 1;
                break;
            }
        }

        if (!flag) {
            var obj = {};
            obj.url = data.input;
            obj.totalTests = 1;
            if (data.injected === false) {
               obj.totalNotInjected = 0;
            } else {
               obj.totalNotInjected = 1; 
            }
            json.dnsInjection.domains.push(obj);
        }
        
        mainArray.forEach(function (e) {
            if (e.key === id)
                e.json = json;
        });

    }
}

var http_invalid_request_lineDigest = function (data) {
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

        if (json.httpInvalidRequestLine === undefined) {
            json.httpInvalidRequestLine = {};
            json.httpInvalidRequestLine.versions = [];
            json.httpInvalidRequestLine.domains = [];
        }
        if (!indexOf(json.httpInvalidRequestLine.versions, data.test_version))
            json.httpInvalidRequestLine.versions.push(data.test_version);

        var flag = 0;
        for (var i = 0; i < json.httpInvalidRequestLine.domains.length; i++) {
            if (json.httpInvalidRequestLine.domains[i].url === data.input) {
                json.httpInvalidRequestLine.domains[i].totalTests++;
                if (data.tampering === true)
                    json.httpInvalidRequestLine.domains[i].totalNotTamperd++;
                flag = 1;
                break;
            }
        }

        if (!flag) {
            var obj = {};
            obj.url = data.input;
            obj.totalTests = 1;
            if (data.tampering === false) {
            obj.totalNotTamperedSucceded = 1;
            } else {
            obj.totalNotTampered = 0;
            }
            json.httpInvalidRequestLine.domains.push(obj);
        }

        mainArray.forEach(function (e) {
            if (e.key === id)
                e.json = json;
        });
    }
}

var http_header_field_manipulationDigest = function (data) {
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

        if (json.httpHeaderFieldManipulation === undefined) {
            json.httpHeaderFieldManipulation = {};
            json.httpHeaderFieldManipulation.versions = [];
            json.httpHeaderFieldManipulation.domains = [];
        }
        if (!indexOf(json.httpHeaderFieldManipulation.versions, data.test_version))
            json.httpHeaderFieldManipulation.versions.push(data.test_version);

        var flag = 0;
        for (var i = 0; i < json.httpHeaderFieldManipulation.domains.length; i++) {
            if (json.httpHeaderFieldManipulation.domains[i].url === data.input) {
                json.httpHeaderFieldManipulation.domains[i].totalTests++;
                if (data.tampering.header_field_name === true)
                    json.httpHeaderFieldManipulation.domains[i].header_field_name++;
                if (data.tampering.header_field_number === true)
                    json.httpHeaderFieldManipulation.domains[i].header_field_number++;
                if (data.tampering.header_field_value  === true)
                    json.httpHeaderFieldManipulation.domains[i].header_field_value++;
                if (data.tampering.header_name_capitalization  == true)
                    json.httpHeaderFieldManipulation.domains[i].header_name_capitaliazation++;
                if (data.tampering.header_name_diff  == true)
                    json.httpHeaderFieldManipulation.domains[i].header_name_diff++;
 
                flag = 1;
                break;
            }
        }

        if (!flag) {
            var obj = {};
            obj.url = data.input;
            obj.totalTests = 1;
            if (data.tampering.header_field_name === true) {
               json.httpHeaderFieldManipulation.domains[i].header_field_name = 1;
               console.log(1);
            } else {
               json.httpHeaderFieldManipulation.domains[i].header_field_name = 0;
           
               console.log(1);
            } 
            if (data.tampering.header_field_number === true) {
                console.log(1);
              json.httpHeaderFieldManipulation.domains[i].header_field_number = 1;
            } else {
                 console.log(1);
             json.httpHeaderFieldManipulation.domains[i].header_field_number = 0;
            }
            if (data.tampering.header_field_value  === true) {
                  console.log(1);
            json.httpHeaderFieldManipulation.domains[i].header_field_value = 1;
            } else {
                   console.log(1);
           json.httpHeaderFieldManipulation.domains[i].header_field_value = 0;
            }
            if (data.tampering.header_name_capitalization  == true) {
                    console.log(1);
          json.httpHeaderFieldManipulation.domains[i].header_name_capitaliazation = 1;
            } else {
                     console.log(1);
         json.httpHeaderFieldManipulation.domains[i].header_name_capitaliazation = 0;
            }
            if (data.tampering.header_name_diff  == true) {
                      console.log(1);
        json.httpHeaderFieldManipulation.domains[i].header_name_diff = 1;
            } else {
                       console.log(1);
       json.httpHeaderFieldManipulation.domains[i].header_name_diff = 0;
            }
            json.httpHeaderFieldManipulation.domains.push(obj);
        }

        mainArray.forEach(function (e) {
            if (e.key === id)
                e.json = json;
        });
    }
}


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
                            if (d !== 0) {
                                dns_injectionDigest(d);
                            } else {
                                save2disk(mainArray);
                            }
                        });
                    if (file.indexOf('http_invalid_request_line') > -1) {
                        yamlator.digestYamlArchived(process.argv[2]+dir+"/"+file, function (d) {
                            if (d !== 0) {
                                http_invalid_request_lineDigest(d);
                            } else {
                                save2disk(mainArray);
                            }
                        });
                    }
 
                    }
                });                    
            });
        }
    });
});
