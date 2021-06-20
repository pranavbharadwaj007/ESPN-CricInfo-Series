const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
function processScorecard(url) {
  request(url, cb);
}
function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    extractMatchDetail(html);
  }
}
function extractMatchDetail(html) {
  // .event .description
  //result->  .event.status-text
  let $ = cheerio.load(html);
  let descElem = $(".event .description");
  let result = $(".event .status-text");
  let stringArr = descElem.text().split(",");
  let venue = stringArr[1].trim();
  let date = stringArr[2].trim();
  result = result.text();
  //console.log(venue);
  // console.log($(result).text());
  let innings = $(".card.content-block.match-scorecard-table>.Collapsible");
  let htmlStr = "";
  for (let i = 0; i < innings.length; i++) {
    // htmlStr += $(innings[i]).html();
    let teamName = $(innings[i]).find("h5").text();
    teamName = teamName.split("INNINGS")[0].trim();
    let opponentindex = i == 0 ? 1 : 0;
    let opponentName = $(innings[opponentindex]).find("h5").text();
    opponentName = opponentName.split("INNINGS")[0].trim();
    // console.log(`${venue} ${date} ${teamName} ${opponentName}  ${result}`);
    let cInnings = $(innings[i]);
    let allRows = cInnings.find(".table.batsman tbody tr");
    for (let j = 0; j < allRows.length; j++) {
      let allCols = $(allRows[j]).find("td");
      let isWorthy = $(allCols[0]).hasClass("batsman-cell");
      if (isWorthy == true) {
        let playerName = $(allCols[0]).text().trim();
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let fours = $(allCols[5]).text().trim();
        let sixers = $(allCols[6]).text().trim();
        let sr = $(allCols[7]).text().trim();
        console.log(`${playerName} ${runs} ${balls} ${fours} ${sixers} ${sr}`);
        processPlayer(
          teamName,
          playerName,
          runs,
          balls,
          fours,
          sixers,
          sr,
          opponentName,
          venue,
          date,
          result
        );
      }
    }
  }
}
function processPlayer(
  teamName,
  playerName,
  runs,
  balls,
  fours,
  sixers,
  sr,
  opponentName,
  venue,
  date,
  result
) {
  let teamPath = path.join(__dirname, "ipl", teamName);
  dirCreator(teamPath);
  let filePath = path.join(teamPath, playerName + ".xlsx");
  let content = excelReader(filePath, playerName);
  let playerObj = {
    teamName,
    playerName,
    runs,
    balls,
    fours,
    sixers,
    sr,
    opponentName,
    venue,
    date,
    result,
  };
  content.push(playerObj);
  excelWriter(filePath, content, playerName);
}
function dirCreator(filePath) {
  if (fs.existsSync(filePath) == false) {
    fs.mkdirSync(filePath);
  }
}
function excelWriter(filePath, json, sheetName) {
  let newWb = xlsx.utils.book_new();

  let newsWs = xlsx.utils.json_to_sheet(json);

  xlsx.utils.book_append_sheet(newWb, newsWs, sheetName);
  xlsx.writeFile(newWb, filePath);
}
function excelReader(filePath, sheetName) {
  if (fs.existsSync(filePath) == false) {
    return [];
  }
  let wb = xlsx.readFile(filePath);
  let excelData = wb.Sheets[sheetName];
  let ans = xlsx.utils.sheet_to_json(excelData);
  return ans;
}

module.exports = {
  ps: processScorecard,
};
