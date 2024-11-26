function lastrow() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PhysicAttendance")
    const checksheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Check")
    let latestrow = PropertiesService.getScriptProperties().getProperty("latestrow");
    const sheetlastrow = sheet.getLastRow();
  
  
    if (!latestrow) {
      latestrow = 2;
    } else {
      latestrow = parseInt(latestrow, 10);
    }
  
    for (check = latestrow; check <= sheetlastrow; check++) {
      const timeStampDate = sheet.getRange(check, 1).getValue()
      const timeStampDateString = Utilities.formatDate(timeStampDate, Session.getScriptTimeZone(), "dd/MM");
      const timeStampDateString2 = Utilities.formatDate(timeStampDate, Session.getScriptTimeZone(), "yyyy:MM:dd");
      const cellcheck = sheet.getRange(check, 4).getValue();
  
      if (cellcheck) {
        const idcellcheck = cellcheck.match(/[?&]id=([^&]+)/)[1];
        const metadata = Drive.Files.get(idcellcheck, {
          fields: "id,name,mimeType,imageMediaMetadata"
        });
        const currentcheck = metadata.imageMediaMetadata;
  
  
        if (currentcheck.location) {
          sheet.getRange(check, 5).setValue("https://www.google.com/maps?q=" + currentcheck.location.latitude + "," + currentcheck.location.longitude)
        } else {
          sheet.getRange(check, 5).setValue("-")
        }
  
        if (currentcheck.time) {
  
          const [date, time] = currentcheck.time.split(" ")
          sheet.getRange(check, 6).setValue(date)
          sheet.getRange(check, 7).setValue(time)
          if (date === timeStampDateString2) {
            const studentidcheck = sheet.getRange(check, 2).getValue().toString()
            const timeMap = new Map([
              ['26/11', 6], ['28/11', 7], ['03/11', 8], ['05/11', 9], ['10/12', 10],
              ['12/12', 11], ['17/12', 12], ['19/12', 13], ['24/12', 14], ['26/12', 15],
              ['31/12', 16], ['02/01', 17], ['07/01', 18], ['09/01', 19], ['14/01', 20],
              ['16/01', 21], ['21/01', 22], ['23/01', 23], ['28/01', 24], ['30/01', 25],
              ['04/02', 26], ['06/02', 27], ['11/02', 28], ['13/02', 29], ['18/02', 30],
              ['23/02', 31], ['25/02', 32], ['27/02', 33], ['04/03', 34], ['06/03', 34],
              ['11/03', 32], ['13/03', 33], ['18/03', 34], ['20/03', 35], ['25/03', 36],
              ['27/03', 37], ['01/04', 38], ['03/04', 39]
            ]);
            const studentidMap = new Map([
              //studentid and row of name
            ]);
  
  
            if (timeMap.has(timeStampDateString)) {
  
              const studentslashreplcae = studentidcheck.replace("-", "")
              const studentposition = studentidMap.get(studentslashreplcae)
              if (studentposition) {
                checksheet.getRange(studentposition + 4, timeMap.get(timeStampDateString)).setValue("1")
              }
            }
          }
        } else {
          sheet.getRange(check, 6).setValue("-")
          sheet.getRange(check, 7).setValue("-")
        }
  
      }
    }
    PropertiesService.getScriptProperties().setProperty("lastestrow", sheetlastrow);
  }
  
  