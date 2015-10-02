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
        },
        {"dnsInjection": 
            {"description": "For every domain in the input list we perform a A query towards the target IP address using UDP on port 53.\n\nWe wait for a DNS response until the timeout (by default 3 seconds) is reached.\n\nIf we have received an answer by that time we say that that hostname is being injected (since the endpoint is not a DNS resolver the answer we got must have been injected by the censorship middle boxes).\n\nIf we don't receive an answer that means everything is as usual and we mark that hostname as not being injected." ,
             "conclusions": "If DNS injection is being done and on which domains."}
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
    var media = 0;
    var mediaMin = 100;
    var mediaMax = 0;
    var alwaysWith = 0;
    var alwaysWithout = 0;
    var maxUrl = "", maxTot = 0, maxSuc = 0;
    var minUrl = "", minTot = 0, minSuc = 0;

    json.tcpConnect.domains.forEach(function (d) {
        total += d.totalTests;
        success += d.totalSucceded;
        if (d.totalTests === d.totalSucceded)
            alwaysWith++;
        if (d.totalSucceded === 0)
            alwaysWithout++;
        media += (d.totalSucceded*100/d.totalTests)
        if (d.totalSucceded*100/d.totalTests > mediaMax) {
            mediaMax = d.totalSucceded*100/d.totalTests;
            maxUrl = d.url;
            maxTot = d.totalTests;
            maxSuc = d.totalSucceded;
        }
        if (d.totalSucceded*100/d.totalTests < mediaMin) {
            mediaMin = d.totalSucceded*100/d.totalTests;
            minUrl = d.url;
            minTot = d.totalTests;
            minSuc = d.totalSucceded;
        }
    });

    text += "* Test executed: " + total + "\n";
    text += "* Test concluded with success: " + success + " (" + (success*100/total).toFixed(2) +"%)\n\n\n";
    text += "* Max percentual of success: " + mediaMax.toFixed(2) + "%\n";
    text += "\t* Item: " + maxUrl + " - " + maxSuc + " over " + maxTot + "\n";
    text += "* Min percentual of success: " + mediaMin.toFixed(2) + "%\n";
    text += "\t* Item: " + minUrl + " - " + minSuc + " over " + minTot + "\n";
    text += "* Median percentual of success: " + (media/json.tcpConnect.domains.length).toFixed(2) + "%\n\n\n";
    text += "* Domains concluded always with success: " + alwaysWith + "\n";
    text += "* Domains concluded always without success: " + alwaysWithout + "\n";
}

text += "# OONI Report\n";
text += "## " + cc + " - " + monthArray[month] + " " + year + "\n";
text += "*******\n";


fs.readFile("output/" + cc + "_" + year + "_" + month + ".json", function (err, data) {
    if (err)
        console.error(err);
    var json = JSON.parse(data);
    if (json.tcpConnect !== undefined) {
        pushDescription("tcpConnect");
        tcpConnectResults(json);
        text += "*******\n";
    }
    fs.writeFile("./reports/" + nameReport + ".md", text, function(err) {
        if (err)
            return console.error(err);
    });
});
