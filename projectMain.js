const request = require("request");
const cheerio = require("cheerio");
const scoreCardobj = require("./scorecard");
function getAllMatchesLink(url) {
  request(url, function (err, response, html) {
    if (err) {
      console.log(err);
    } else {
      extractLinkmatch(html);
    }
  });
}
function extractLinkmatch(html) {
  let $ = cheerio.load(html);
  let scoreCardElems = $("a[data-hover='Scorecard']");
  for (let i = 0; i < scoreCardElems.length; i++) {
    let link = $(scoreCardElems[i]).attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    scoreCardobj.ps(fullLink);
  }
}
module.exports = {
  gAlmatches: getAllMatchesLink,
};
