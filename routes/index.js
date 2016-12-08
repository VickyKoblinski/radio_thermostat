var express = require('express');
var request = require('request');
var address = require('../private/address');
var router = express.Router();

/* GET radio thermostat listing. */
router.get('/', function(req, res, next) {
  request(address+'/tstat/', function(error, response, body){
    if(!error && response.statusCode == 200){
      var tstat = JSON.parse(body);
      var t_temp = tstat.t_heat ? tstat.t_heat : tstat.t_cool;
      var tmode = ['OFF', 'HEAT', 'COOL', 'AUTO'];
      var fmode = ['AUTO', 'AUTO/CIRCULATE', 'ON'];
      var override = ['DISABLED', 'ENABLED'];
      var hold = ['DISABLED', 'ENABLED'];
      var tstate = ['OFF', 'HEAT', 'COOL'];
      var time = dateToString(tstat.time);
      var t_type_post = ['TEMPORARY', 'ABSOLUTE', 'UNKOWN'];

      res.render('index', { temp: tstat.temp,
                            t_temp: t_temp,
                            tmode: tmode[tstat.tmode],
                            fmode: fmode[tstat.fmode],
                            override: override[tstat.override],
                            hold: hold[tstat.hold],
                            tstate: tstate[tstat.tstate],
                            time: time,
                            t_type_post: t_type_post[tstat.t_type_post]
                          }
              );
    } else {
      res.send('oops, lol.');
    }
  })

});


function dateToString(date){
  var day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  var am_pm = date.hour > 12 ? 'pm' : 'am'; 
  var hour = date.hour > 12 ? date.hour-12 : date.hour;
  var minute = date.minute;

  var str = day[date.day] + ' ' + hour + ':' + minute + am_pm;

  return str;
}

module.exports = router;
