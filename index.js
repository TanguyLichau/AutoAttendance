const { cp } = require("fs");
const puppeteer = require("puppeteer");
require("dotenv").config();

const EMAIL = process.env.EMAIL;
const PSW = process.env.PASSWORD;

async function validerAppel(uid, alvstu, simplesaml, samlauth, seance_pkId) {
  const response = await fetch(
    `https://www.leonard-de-vinci.net/student/presences/upload.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://www.leonard-de-vinci.net",
        Referer: "https://www.leonard-de-vinci.net/",
        "X-Requested-With": "XMLHttpRequest",
        Cookie:
          "alvstu=" +
          alvstu +
          ";" +
          " SimpleSAML=" +
          simplesaml +
          ";" +
          " SimpleSAMLAuthToken=" +
          samlauth +
          ";" +
          " uids=" +
          uid +
          ";",
      },
      body: new URLSearchParams({
        act: "set_present",
        seance_pk: seance_pkId,
      }),
    }
  );
  if (response.headers.get("content-length")) return true;
  console.log(response.headers.get("content-length"));
  //console.log(typeof response);
  //console.log
  return false;
}

async function main() {
  //#region connectToSite
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
  });
  const page = await browser.newPage();
  await page.goto("https://www.leonard-de-vinci.net/");

  await page.focus("#login");
  await page.keyboard.type(EMAIL);
  await page.click("#btn_next");

  await page.waitForSelector("#passwordInput");
  await page.focus("#passwordInput");
  await page.keyboard.type(PSW);
  await page.click("#submitButton");
  await page.waitForNavigation();
  //#endregion
  //#region getCookies
  const client = await page.target().createCDPSession();
  let listcookies = (await client.send("Storage.getCookies")).cookies;
  const uid = listcookies.find((element) => element.name == "uids").value;
  const alvstu = listcookies.find((element) => element.name == "alvstu").value;
  const SimpleSAML = listcookies.find(
    (element) => element.name == "SimpleSAML"
  ).value;
  const SimpleSAMLAuthToken = listcookies.find(
    (element) => element.name == "SimpleSAMLAuthToken"
  ).value;
  //#endregion
  await page.goto("https://www.leonard-de-vinci.net/student/presences/");

  const text = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("td"));
    return anchors.map((a) => a.innerText);
  });
  listDate = [];
  for (let index in text) {
    if (index % 6 == 0) listDate.push(text[index]);
  }
  console.log(listDate);
  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("a"));
    return anchors.map((a) => a.href);
  });
  const regex = /\/student\/presences\/(\d+)/;
  const matchingLinks = links.filter((link) => link.match(regex));
  const listOfSeance_pk = matchingLinks.map((link) => link.match(regex)[1]);
  console.log(listOfSeance_pk);

  const unixTimeStartingCourse = [];
  await listDate.forEach((date) => {
    const [start, _] = date.split(" -");

    const startDate = new Date();
    startDate.setHours(start.split(":")[0]);
    startDate.setMinutes(start.split(":")[1]);

    const unixTime = Math.floor(startDate.getTime() / 1000);
    unixTimeStartingCourse.push(unixTime);
  });

  for (let index in unixTimeStartingCourse) {
    // delay for the setTimeout to know when we trigger it
    const delay = unixTimeStartingCourse[index] * 1000 - Date.now();
    //console.log(delay);
    if (delay > -5400 * 1000) {
      setTimeout(() => {
        const intervalId = setInterval(async () => {
          const success = await validerAppel(
            uid,
            alvstu,
            SimpleSAML,
            SimpleSAMLAuthToken,
            listOfSeance_pk[index]
          );
          //console.log(success);
          if (success) clearInterval(intervalId);
        }, 1 * 60 * 1000); // ATTENTION LA C EST TOUTES LES 1 MIN
      }, delay);
      console.log("Done");
    }
  }
}

main();

process.exit(1);
