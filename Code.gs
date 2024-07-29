function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

function doGet(e) {
  Logger.log(Utilities.jsonStringify(e));
  var template = HtmlService.createTemplateFromFile('index');
  template.cards = numberofcards();
  template.url = getScriptUrl();
  if (e.parameter.page){
    if (e.parameter.page != 'contactus'){
      var template = HtmlService.createTemplateFromFile('booking')
      template.date = e.parameter.page.slice(0,6)
      template.row = e.parameter.page.slice(7)
    }
    else {
      var template = HtmlService.createTemplateFromFile(e.parameter.page)
    }
    template.url = getScriptUrl();

  }
  return template.evaluate();
}

function AddRecord(name, email, message){
  var url = 'https://docs.google.com/spreadsheets/d/1KepshFSHjjiaaKUzEAIydXbC-YzF8ZRihaOqb4xEoL8/edit?gid=0#gid=0'
  var ss = SpreadsheetApp.openByUrl(url)
  var webAppSheet = ss.getSheetByName('FORM DATA')
  webAppSheet.appendRow([new Date(), name, email, message])
}

function AddRecord2(name, email, message, dateString, rowid){
  var url = 'https://docs.google.com/spreadsheets/d/1E9lyPmpS4AQ64SQbjCjz4FMFqPKZEwmdzEs3H7LD9Dk/edit?gid=0#gid=0'
  var ss = SpreadsheetApp.openByUrl(url)
  let row2 = parseInt(rowid)
  let day = parseInt(dateString.slice(0, 2), 10);
  let month = parseInt(dateString.slice(2, 4), 10); // Month is zero-based in JavaScript Date
  let year = 2000 + parseInt(dateString.slice(4, 6), 10); // Assuming '24' means 2024  
  var webAppSheet = ss.getSheetByName(`${day}-${month}-${year}`)
  var values = webAppSheet.getDataRange().getValues()
  var range = findIndex2DArray(values, row2)
  var range = webAppSheet.getRange(`B${range.row+1}:E${range.row+1}`)
  range.setValues([['Booked', name, email, message]])

}

function findIndex2DArray(array, value) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] === value) {
        return { row: i, col: j };
      }
    }
  }
  return null; // Return null if the value is not found
}

function numberofcards(){
  const images = ['https://i.ibb.co/R2BsvVS/cards4.jpg', 'https://i.ibb.co/TK3Thnm/cards3.jpg', 'https://i.ibb.co/47N3GsR/cards2.jpg', 'https://i.ibb.co/BZ5XjJL/cards1.jpg']
  const numberofsheets = []
  var url = 'https://docs.google.com/spreadsheets/d/1E9lyPmpS4AQ64SQbjCjz4FMFqPKZEwmdzEs3H7LD9Dk/edit?gid=0#gid=0'
  var ss = SpreadsheetApp.openByUrl(url)
  var webAppSheet = ss.getSheets()
  let counter = 0
  for (thisSheet of webAppSheet){
    var date = thisSheet.getName().split("-");
    var values = thisSheet.getDataRange().getValues();
    let spots = values[1][0]
    let spotsleft = 0
    let found = false
    for (i in values){
      if (values[i][1] == '' && found == false) {
        spotsleft = values[i][0]
        found = true
      }
    }
    var f = new Date(date[2], date[1]-1, date[0]);
    numberofsheets.push([f, spots, spotsleft])
  }
  let html = ''
  for (thisSheet of numberofsheets){
    var spots = thisSheet[1]
    var spotsleft = thisSheet[2]
    var thisSheet = thisSheet[0]
    let htmlp = `        <div class="col">
          <div class="card shadow-sm">
            <img src="${images[counter]}" class="card-img-top" alt="Image">
            <div class="card-body">
              <p class="card-text" id = "BookingDate">${thisSheet.toLocaleDateString("en-GB")}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <a href='${getScriptUrl()}?page=${formatDateToDDMMYY(thisSheet)}-${spotsleft}'><button type="button" class="btn btn-sm btn-outline-secondary"}>Book</button></a>
                </div>
                <small class="text-body-secondary">${spotsleft}/${spots}</small>
              </div>
            </div>
          </div>
        </div>`
    html = html.concat(htmlp)
    counter += 1;
  }
  return html
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function padToTwoDigits(num) {
  return num.toString().padStart(2, '0');
}

function formatDateToDDMMYY(date) {
  let day = padToTwoDigits(date.getDate());
  let month = padToTwoDigits(date.getMonth() + 1); // Months are zero-based
  let year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year

  return `${day}${month}${year}`;
}

