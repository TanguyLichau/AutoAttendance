const puppeteer = require("puppeteer");
require("dotenv").config();

const EMAIL = process.env.EMAIL;
const PSW = process.env.PASSWORD;

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

  //const cookies = await page.cookies(
  // "https://www.leonard-de-vinci.net/?my=edt"
  //);
  const client = await page.target().createCDPSession();
  const cookies = (await client.send("Network.getAllCookies")).cookies;
  console.log("cookies : " + JSON.stringify(cookies));
}

yo();
