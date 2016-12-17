
var CronJob = require('cron').CronJob;
const fs = require('fs');
var TSTAT = JSON.parse(fs.readFileSync('private/tstat.json', 'utf8'));
var mysql      = require('mysql');
var request = require('request');
var vars = require('./private/vars');

var connection = mysql.createConnection({
  user     : vars.db.usr,
  password : vars.db.pass,
  database : vars.db.name
});



new CronJob('0 0 */15 * * * *', function(){

  var queryString = `INSERT thermostat SET 
    \`day\`     = ${TSTAT.time.day}, 
    \`hour\`    = ${TSTAT.time.hour}, 
    \`minute\`  = ${TSTAT.time.minute}`;
  if(typeof TSTAT.temp != "undefined")        queryString += `, temp        = ${TSTAT.temp}`;
  if(typeof TSTAT.tmode != "undefined")       queryString += `, tmode       = ${TSTAT.tmode}`;
  if(typeof TSTAT.t_heat != "undefined")      queryString += `, t_heat      = ${TSTAT.t_heat}`;
  if(typeof TSTAT.t_cool != "undefined")      queryString += `, t_cool      = ${TSTAT.t_cool}`;
  if(typeof TSTAT.fmode != "undefined")       queryString += `, fmode       = ${TSTAT.fmode}`;
  if(typeof TSTAT.override != "undefined")    queryString += `, override    = ${TSTAT.override}`;
  if(typeof TSTAT.hold != "undefined")        queryString += `, hold        = ${TSTAT.hold}`;
  if(typeof TSTAT.tstate != "undefined")      queryString += `, tstate      = ${TSTAT.tstate}`;
  if(typeof TSTAT.t_type_post != "undefined") queryString += `, t_type_post = ${TSTAT.t_type_post}`;
  queryString += ";";

  console.info("DATABASE - INFO -  writing to database");

  connection.query({sql: queryString, timeout: 60000}, function (err, rows) {
    if (err && err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
      throw new Error('too long to count table rows!');
    }
    if (err) throw err;

    console.log("DATABASE - INFO -   success");
  });

}, null, true, 'America/New_York');
 


var jsonUpdate = new CronJob('0 */5 * * * * *', function(){
  console.info("JSON  - INFO - updating tstat.json...");
  jsonUpdate.stop();
  request(`${vars.address}/tstat/`, function(error, response, body){
    if(!error && response.statusCode == 200){
      try{
        var json = JSON.parse(body);
          fs.truncate("./private/tstat.json", 0, function() {
            fs.writeFile("./private/tstat.json", body, function (err) {
              if (err) return console.log("Error writing file: " + err);
              console.info("JSON  - INFO - success");
            });
          });
      }catch(e) {
          console.warn("JSON  - WARN - invalid json")
      }
    } else {
      console.error("JSON  - ERRO - error requesting thermostat");
    }
    jsonUpdate.start();
  });
}, null, true, 'America/New_York');