var express = require("express");
var path = require("path");

var app = express();

var server = app.listen(3000, "localhost",  function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('client is at http://%s:%s/rippleClient', host, port)
});

app.route("/")
.get(function(req, res, next) {
	res.sendFile(path.join(__dirname, "frontend", "main.html"));	
});

app.use("/css", express.static(path.join(__dirname, "frontend", "css")));
app.use("/js", express.static(path.join(__dirname, "frontend", "js")));
app.use("/3rd_party", express.static(path.join(__dirname, "frontend", "3rd_party")));






/*	a wrapper for error reponses sent to client */
function errorResponse(errMsg, data)
{
	var d = data || {};
	d.success = false;
	d.errorMsg = errMsg || "Unknown error";	
	return JSON.stringify(d);
}

/*	a wrapper for successful reponses sent to client */
function successResponse(data)
{
	var d = data || {};
	d.success = true;
	return JSON.stringify(d);
}



