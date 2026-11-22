
/**
 * Portfolio Contact Form - Google Sheets API
 * Method: POST
 * Fields: name, email, subject, message
 */

function doPost(e) {
  try {
    // Get the active Google Spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Get the active sheet
    const sheet = spreadsheet.getActiveSheet();

    // Check whether POST data exists
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No POST data received.");
    }

    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Extract form attributes
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const subject = String(data.subject || "").trim();
    const message = String(data.message || "").trim();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw new Error("All four fields are required.");
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please provide a valid email address.");
    }

    // Ensure headers exist
    const headers = ["name", "email", "subject", "message"];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    // Verify column headers
    const existingHeaders = sheet
      .getRange(1, 1, 1, 4)
      .getDisplayValues()[0];

    if (existingHeaders.join(",") !== headers.join(",")) {
      throw new Error(
        "Sheet headers must be: name, email, subject, message"
      );
    }

    // Prevent simultaneous submissions from conflicting
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      // Insert form data into Google Sheet
      sheet.appendRow([
        name,
        email,
        subject,
        message
      ]);

      SpreadsheetApp.flush();

    } finally {
      lock.releaseLock();
    }

    // Success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: "Contact form submitted successfully!"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {

    // Error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// Optional GET endpoint for testing deployment
function doGet() {
  return ContentService
    .createTextOutput("Portfolio Google Sheets API is running!")
    .setMimeType(ContentService.MimeType.TEXT);
}
