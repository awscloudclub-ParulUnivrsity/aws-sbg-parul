/**
 * Google Apps Script — AWS SBG Certified Students Sheet Writer
 *
 * HOW TO DEPLOY:
 * 1. Go to https://script.google.com → New Project
 * 2. Paste this entire file, replacing the default code
 * 3. Replace SHEET_ID below with your actual Sheet ID
 * 4. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone (anonymous)
 * 5. Copy the Web App URL → paste into VITE_APPS_SCRIPT_URL in .env
 *
 * RE-DEPLOY after any code change:
 *   Deploy → Manage Deployments → Edit → New Version → Deploy
 */

const SHEET_ID = '1aTgU6R6zmh5ngtZQAQE-smz0XevxiRYBdhkOyYU5ZM8'; // ✅ already set
const TAB_NAME = 'Certified';

const COLUMNS = [
  'name', 'email', 'parul_email', 'mobile', 'enrolment',
  'department', 'semester', 'institute', 'exam_date',
  'cert_title', 'credly_link', 'result_url', 'photo_url'
];

// Browser calls this via GET ?name=...&cert_title=... (no CORS issues)
function doGet(e) {
  try {
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let sheet   = ss.getSheetByName(TAB_NAME);

    // Create the tab if it doesn't exist
    if (!sheet) sheet = ss.insertSheet(TAB_NAME);

    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.getRange(1, 1, 1, COLUMNS.length)
        .setFontWeight('bold')
        .setBackground('#232F3E')
        .setFontColor('#FF9900');
    }

    // Append the row from query params
    sheet.appendRow(COLUMNS.map(col => e.parameter[col] || ''));

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Manual test — run this in Apps Script editor to verify everything works ──
function testWrite() {
  const e = {
    parameter: {
      name: 'Test Student', email: 'test@example.com', parul_email: 'test@paruluniversity.ac.in',
      mobile: '9876543210', enrolment: '22012345678901', department: 'Computer Engineering',
      semester: '5', institute: 'PIET', exam_date: '2025-01-15',
      cert_title: 'AWS Certified Cloud Practitioner', credly_link: 'https://credly.com/test',
      result_url: '', photo_url: ''
    }
  };
  const result = doGet(e);
  Logger.log(result.getContent());
}
