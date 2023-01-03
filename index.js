const puppeteer = require("puppeteer");
require("dotenv").config();

const EMAIL = process.env.EMAIL;
const PSW = process.env.PASSWORD;

async function validerAppel(uid, alvstu, simplesaml, samlauth) {
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
    }
  );
}

async function yo() {
  const browser = await puppeteer.launch({ headless: false });
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

  await page.goto("https://www.leonard-de-vinci.net/student/presences/");

  const f = await page.$("#body_presences");
  console.log(f);
}

yo();
