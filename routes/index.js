require('dotenv').config()
const express = require('express');
const request = require('request');
const vars = require('../private/vars');
const RadioThermostat = require('../RadioThermostat');

const router = express.Router();

function dateToString(date) {
  const { day, hour, minute } = date;
  const DAY = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  const AM_PM = hour > 12 ? 'pm' : 'am';
  const HOUR = hour > 12 ? hour - 12 : hour;
  const MINUTE = minute < 10 ? `0${minute}` : minute;

  const STR = `${DAY[day]} ${HOUR}:${MINUTE}${AM_PM}`;

  return STR;
}

/* GET radio thermostat listing. */
router.get('/', (req, res, next) => {
  const {
    temp,
    t_heat,
    t_cool,
    tmode,
    fmode,
    override,
    hold,
    tstate,
    time,
    t_type_post
  } = RadioThermostat.getData();

  const T_TEMP = t_heat || t_cool;
  const TMODE = ['OFF', 'HEAT', 'COOL', 'AUTO'];
  const FMODE = ['AUTO', 'AUTO/CIRCULATE', 'ON'];
  const OVERRIDE = ['DISABLED', 'ENABLED'];
  const HOLD = ['DISABLED', 'ENABLED'];
  const TSTATE = ['OFF', 'HEAT', 'COOL'];
  const TIME = dateToString(time);
  const T_TYPE_POST = ['TEMPORARY', 'ABSOLUTE', 'UNKOWN'];

  res.render('index', {
    temp,
    t_temp: T_TEMP,
    tmode: TMODE[tmode],
    fmode: FMODE[fmode],
    override: OVERRIDE[override],
    hold: HOLD[hold],
    tstate: TSTATE[tstate],
    time: TIME,
    t_type_post: T_TYPE_POST[t_type_post]
  });
});

router.post('/', (req, res) => {
  const tmode = parseInt(req.body.tmode);
  const settemp = parseInt(req.body.settemp);
  const fmode = parseInt(req.body.fmode);
  const hold = parseInt(req.body.hold);
  const body = {
    tmode: '',
    fmode: '',
    hold: '',
    it_cool: '',
    it_heat: ''
  };
  body.tmode = tmode;
  body.fmode = fmode;
  body.hold = hold;

  switch (body.tmode) {
    case 1:
      body.it_heat = settemp;
      break;
    case 2:
      body.it_cool = settemp;
      break;
    case 3:
    default:
      break;
  }

  request.post(
    {
      url: `${vars.address}/tstat/`,
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    },
    (err, httpResponse, bodyResponse) => {
      const newData = RadioThermostat.getData();
      newData.tmode = tmode;
      newData.fmode = fmode;
      newData.hold = hold;

      switch (tmode) {
        case 1:
          newData.t_heat = settemp;
          break;
        case 2:
          newData.t_cool = settemp;
          break;
        case 3:
        default:
          break;
      }

      RadioThermostat.setData(newData);
      res.send(
        `<meta http-equiv="refresh" content="0;URL='${process.env.REFRESH_URL}'" /> `
      );
    }
  );
});

module.exports = router;
