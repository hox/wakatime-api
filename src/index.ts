require('dotenv').config();

import fetch from 'node-fetch';

/* CONFIG */

const emptChar = '-'; // The special character used to represent unfilled portions of the graph
const specChar = '#'; // The special character used to fill the graph
const hashCount = 30; // Amount of special characters representing the filled graph
const apiInterval = 60 * 1000; // Interval at which you send requests to wakatime

/* END CONFIG */

var lastMsg = '';

console.log('Starting auto-grab');

apiGrab();
setInterval(apiGrab, apiInterval);

async function apiGrab() {
  console.log('Grabbing API Info...');

  const langsData = JSON.parse(await wakReq(process.env.LANGS_PATH));

  const times = JSON.parse(await wakReq(process.env.TIMES_PATH));
  var totalTime = 0;
  var langs = [];

  times.data.forEach((time) => {
    totalTime += time.grand_total.total_seconds;
  });

  var finalStr = [];
  var highestStr = 0;

  langsData.data.forEach((lang) => {
    langs.push({ name: lang.name, time: (lang.percent / 100) * totalTime });
    if (lang.name.length > highestStr) highestStr = lang.name.length;
  });

  langs.forEach((lang) => {
    const percentage = Math.ceil((lang.time / totalTime) * 100);
    const hashRep = Math.floor(hashCount * (percentage / 100));
    const hours = (lang.time / 60 / 60).toFixed(1);
    finalStr.push(
      lang.name +
        ' '.repeat(highestStr - lang.name.length + 2) +
        (hours.split('.')[0] == '0' ? ' .' + hours.split('.')[1] : hours) +
        'h [' +
        specChar.repeat(hashRep) +
        emptChar.repeat(hashCount - hashRep) +
        ']'
    );
  });

  const totalHours = (totalTime / 60 / 60).toFixed(1) + 'h total';

  const content =
    'Top 3 languages: (based on hours)' +
    ' '.repeat(16 - totalHours.length) +
    totalHours +
    '\n\n' +
    finalStr.slice(0, 3).join('\n');

  if (content == lastMsg) return;

  fetch('https://api.github.com/gists/' + process.env.GIST_ID, {
    method: 'PATCH',
    headers: {
      Authorization: 'token ' + process.env.GITHUB_TOKEN,
    },
    body: JSON.stringify({
      description: 'Past 7 Days',
      files: {
        'Past 7 Days.txt': {
          content: content,
          filename: 'Past 7 Days.txt',
        },
      },
    }),
  })
    .then(() => {
      console.log('Updated gist #1 with most recent information.');
      lastMsg = content;
    })
    .catch((err) => {
      throw err;
    });
}

function wakReq(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fetch('https://wakatime.com/' + path)
      .then((value) => value.text())
      .then((json) => resolve(json))
      .catch((err) => reject(err));
  });
}
