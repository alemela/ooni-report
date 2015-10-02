var fs = require('fs');

var cc = process.argv[2];
var year = process.argv[3];
var month = process.argv[4];

var monthArray = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var testDict = [ 
        {"tcpConnect": 
            {"description": "For every item given as input we perform a TCP connect. Ifthe connection is succesful, we record 'success' for the test." ,
             "conclusions": "Ability to determine that a specific host:port is blocked."}
        }
];

var pushDescription = function (test) {
    console.log("### " + test);
    console.log("#### Description");
    console.log(testDict[0][test].description);
    console.log("#### Possible conclusions");
    console.log(testDict[0][test].conclusions);
    console.log("#### Results");
}

var tcpConnectResults = function (json) {
    var total = 0;
    var success = 0;

    json.tcpConnect.domains.forEach(function (d) {
        total += d.totalTests;
        success += d.totalSucceded;
    });

    console.log("* Test executed: " + total);
    console.log("* Test concluded with success: " + success);
}

console.log("# OONI REPORT");
console.log("## " + cc + " - " + monthArray[month] + " " + year);

fs.readFile("output/" + cc + "_" + year + "_" + month + ".json", function (err, data) {
    if (err)
        console.error(err);
    var json = JSON.parse(data);
    if (json.tcpConnect !== undefined) {
        pushDescription("tcpConnect");
        tcpConnectResults(json);
    }
});
