const vars = require('./private/vars');
const axios = require('axios');

let data = {};
let programHeat = {};
let programCool = {};

//* * THIS WORKS TOO */
// async function fetchData() {
//   const res = await axios.get(`${vars.address}/tstat/`);
//   return res.data;
// }

function fetchData() {
  return axios.get(`${vars.address}/tstat/`).then(res => res.data);
}

async function fetchProgram(url) {
  const program = await axios.get(url).then(res => res.data);
  const formattedResult = {
    mon: program['0'],
    tue: program['1'],
    wed: program['2'],
    thur: program['3'],
    fri: program['4'],
    sat: program['5'],
    sun: program['6']
  };
  return formattedResult;
}

function fetchProgramHeat() {
  return fetchProgram(`${vars.address}/tstat/program/heat`);
}

function fetchProgramCool() {
  return fetchProgram(`${vars.address}/tstat/program/cool`);
}

(async () => {
  programCool = await fetchProgramCool();
  programHeat = await fetchProgramHeat();
})();

(() => {
  setInterval(async () => {
    data = await fetchData();
  }, 5000);
})();

module.exports = {
  getData() {
    return data;
  },
  setData(newData) {
    data = newData;
  },
  getProgramHeat() {
    return programHeat;
  },
  getProgramCool() {
    return programCool;
  }
};
