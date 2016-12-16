const express = require('express');
const request = require('request');
const router = express.Router();
const TSTAT = require('../lib/tstat.js');

/* GET radio thermostat listing. */
router.get('/', (req, res, next) => {
  const T_TEMP = TSTAT.t_heat ? TSTAT.t_heat : TSTAT.t_cool;
  const TMODE = ['OFF', 'HEAT', 'COOL', 'AUTO'];
  const FMODE = ['AUTO', 'AUTO/CIRCULATE', 'ON'];
  const OVERRIDE = ['DISABLED', 'ENABLED'];
  const HOLD = ['DISABLED', 'ENABLED'];
  const TSTATE = ['OFF', 'HEAT', 'COOL'];
  const TIME = _dateToString(TSTAT.time);
  const T_TYPE_POST = ['TEMPORARY', 'ABSOLUTE', 'UNKOWN'];

  res.render('index', {
    temp: TSTAT.temp,
    t_temp: T_TEMP,
    tmode: TMODE[TSTAT.tmode],
    fmode: FMODE[TSTAT.fmode],
    override: OVERRIDE[TSTAT.override],
    hold: HOLD[TSTAT.hold],
    tstate: TSTATE[TSTAT.tstate],
    time: TIME,
    t_type_post: T_TYPE_POST[TSTAT.t_type_post]
  }
  );
}
);


function _dateToString(DATE){
  const DAY = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const AM_PM = DATE.hour > 12 ? 'pm' : 'am'; 
  const HOUR = DATE.hour > 12 ? DATE.hour-12 : DATE.hour;
  const MINUTE = DATE.minute < 10 ?  `0${DATE.minute}` : DATE.minute;

  const STR = `${DAY[DATE.day]} ${HOUR}:${MINUTE}${AM_PM}`;

  return STR;
}

module.exports = router;
