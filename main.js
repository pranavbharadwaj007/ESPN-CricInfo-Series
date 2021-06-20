const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const iplPath = path.join(__dirname, "ipl");
dirCreator(iplPath);
const AllMatchObj = require("./projectMain");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url, cb);
function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    extractLink(html);
  }
}

function extractLink(html) {
  let $ = cheerio.load(html);
  let anchorElem = $("a[data-hover='View All Results']");
  let link = anchorElem.attr("href");
  let fullLink = "https://www.espncricinfo.com" + link;
  AllMatchObj.gAlmatches(fullLink);
}
// function getAllMatchesLink(url) {
//   request(url, function (err, response, html) {
//     if (err) {
//       console.log(err);
//     } else {
//       extractLinkmatch(html);
//     }
//   });
// }
// function extractLinkmatch(html) {
//   let $ = cheerio.load(html);
//   let scoreCardElems = $("a[data-hover='Scorecard']");
//   for (let i = 0; i < scoreCardElems.length; i++) {
//     let link = $(scoreCardElems[i]).attr("href");
//     let fullLink = "https://www.espncricinfo.com" + link;
//     console.log("Link =", fullLink);
//   }
// }
function dirCreator(filePath) {
  if (fs.existsSync(filePath) == false) {
    fs.mkdirSync(filePath);
  }
}
