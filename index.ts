import env from "dotenv";
env.config();

import fetch from "node-fetch";

/* CONFIG */

const emptChar = "-"; // The special character used to represent unfilled portions of the graph
const specChar = "#"; // The special character used to fill the graph
const hashCount = 30; // Amount of special characters representing the filled graph
const apiInterval = 60 * 1000; // Interval at which you send requests to wakatime

/* END CONFIG */

console.log("Starting auto-grab");

apiGrab();
setInterval(apiGrab, apiInterval);

async function apiGrab() {
  console.log("Grabbing API Info...");

  const todayDate = new Date();

  const todayDateStr = `${
    todayDate.getMonth() + 1
  }-${todayDate.getDate()}-${todayDate.getFullYear()}`;

  const weekAgoDate = new Date();

  weekAgoDate.setDate(todayDate.getDate() - 7);

  const weekAgoDateStr = `${
    weekAgoDate.getMonth() + 1
  }-${weekAgoDate.getDate()}-${weekAgoDate.getFullYear()}`;

  const weekStats: Summaries = await wakReq(
    `/users/current/summaries?start=${weekAgoDateStr}&end=${todayDateStr}`,
    "GET"
  );

  var langs = [];
  var finalStr = [];

  weekStats.data.forEach((day) => {
    day.languages.forEach((lang) => {
      if (langs.find((ln) => ln.name == lang.name)) {
        langs.find((ln) => ln.name == lang.name).total_seconds +=
          lang.total_seconds || 0;
      } else {
        langs.push({ name: lang.name, time: lang.total_seconds });
      }
    });
  });

  var totalTime = 0;
  var highestStr = 0;
  langs.forEach((lang) => {
    totalTime += lang.time;
    if (lang.name.length > highestStr) highestStr = lang.name.length;
  });

  langs.sort((a, b) => b.time - a.time);

  langs.forEach((lang) => {
    const percentage = Math.ceil((lang.time / totalTime) * 100);
    const hashRep = Math.floor(hashCount * (percentage / 100));
    const hours = (lang.time / 60 / 60).toFixed(1);
    finalStr.push(
      lang.name +
        " ".repeat(highestStr - lang.name.length + 2) +
        (hours.split(".")[0] == "0" ? " ." + hours.split(".")[1] : hours) +
        "h [" +
        specChar.repeat(hashRep) +
        emptChar.repeat(hashCount - hashRep) +
        "]"
    );
  });

  const totalHours = (totalTime / 60 / 60).toFixed(1) + "h total";

  fetch("https://api.github.com/gists/" + process.env.GIST_ID, {
    method: "PATCH",
    headers: {
      Authorization: "token " + process.env.GITHUB_TOKEN,
    },
    body: JSON.stringify({
      description: "Past 7 Days",
      files: {
        "Past 7 Days.txt": {
          content:
            "Top 3 languages: (based on hours)" +
            " ".repeat(16 - totalHours.length) +
            totalHours +
            "\n\n" +
            finalStr.slice(0, 3).join("\n"),
          filename: "Past 7 Days.txt",
        },
      },
    }),
  })
    .then(() => console.log("Updated gist #1 with most recent information."))
    .catch((err) => {
      throw err;
    });
}

interface Summaries {
  data: [
    {
      grand_total: {
        digital: string;
        hours: number;
        minutes: number;
        text: string;
        total_seconds: number;
      };
      projects: [
        {
          name: string;
          total_seconds: number;
          percent: number;
          digital: string;
          text: string;
          hours: number;
          minutes: number;
        }
      ];
      languages: [
        {
          name: string;
          total_seconds: number;
          percent: number;
          digital: string;
          text: string;
          hours: number;
          minutes: number;
          seconds: number;
        }
      ];
      editors: [
        {
          name: string;
          total_seconds: number;
          percent: number;
          digital: string;
          text: string;
          hours: number;
          minutes: number;
          seconds: number;
        }
      ];
      operating_systems: [
        {
          name: string;
          total_seconds: number;
          percent: number;
          digital: string;
          text: string;
          hours: number;
          minutes: number;
          seconds: number;
        }
      ];
      dependencies: [
        {
          name: string;
          total_seconds: number;
          percent: number;
          digital: string;
          text: string;
          hours: number;
          minutes: number;
          seconds: number;
        }
      ];
      machines: [
        {
          name: string;
          machine_name_id: string;
          total_seconds: number;
          percent: number;
          digital: string;
          text: string;
          hours: number;
          minutes: number;
          seconds: number;
        }
      ];
      branches: [
        {
          name: string;
          total_seconds: number;
          percent: number;
          digital: string;
          text: string;
          hours: number;
          minutes: number;
          seconds: number;
        }
      ];
      entities: [
        {
          name: string;
          total_seconds: number;
          percent: number;
          digital: string;
          text: string;
          hours: number;
          minutes: number;
          seconds: number;
        }
      ];
      range: {
        date: string;
        start: string;
        end: string;
        text: string;
        timezone: string;
      };
    }
  ];
  start: string;
  end: string;
}

function wakReq(url, method: RequestInit["method"]): Promise<any> {
  return new Promise((resolve, reject) => {
    fetch("https://wakatime.com/api/v1" + url, {
      method: method,
      headers: {
        Authorization:
          "Basic " + Buffer.from(process.env.API_KEY).toString("base64"),
      },
    })
      .then((value) => value.json())
      .then((json) => resolve(json))
      .catch((err) => reject(err));
  });
}
