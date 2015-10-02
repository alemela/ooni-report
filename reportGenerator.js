var fs = require('fs');

var cc = process.argv[2];
var year = process.argv[3];
var month = process.argv[4];
var nameReport = cc + "_" + year + "_" + month;
var text = "";

var monthArray = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var testDict = [ 
        {"tcpConnect": 
            {"description": "For every item given as input we perform a TCP connect. If the connection is succesful, we record 'success' for the test." ,
             "conclusions": "Ability to determine that a specific host:port is blocked."}
        }
];

var pushDescription = function (test) {
    text += "### Test: " + test + "\n";
    text += "#### Description\n";
    text += testDict[0][test].description + "\n";
    text += "#### Possible conclusions\n";
    text += testDict[0][test].conclusions + "\n";
    text += "#### Results\n";
}

var tcpConnectResults = function (json) {
    var total = 0;
    var success = 0;

    json.tcpConnect.domains.forEach(function (d) {
        total += d.totalTests;
        success += d.totalSucceded;
    });

    text += "* Test executed: " + total + "\n";
    text += "* Test concluded with success: " + success + "\n";
    text += "*******";
}

text += "# OONI Report\n";
text += "## " + cc + " - " + monthArray[month] + " " + year + "\n";


fs.readFile("output/" + cc + "_" + year + "_" + month + ".json", function (err, data) {
    if (err)
        console.error(err);
    var json = JSON.parse(data);
    if (json.tcpConnect !== undefined) {
        pushDescription("tcpConnect");
        tcpConnectResults(json);
    }
    fs.writeFile("./reports/" + nameReport + ".md", text, function(err) {
        if (err)
            return console.error(err);
    });
});
