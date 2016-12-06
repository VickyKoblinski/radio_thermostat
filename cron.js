
var CronJob = require('cron').CronJob;
var i = 0;

new CronJob('* * * * * * *', function(){
  console.log(i++);
}, null, true, 'America/Los_Angeles');
 