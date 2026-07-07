const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

/**
 * Sends certified student data to Google Apps Script via GET + query params.
 * GET requests to Apps Script never trigger CORS preflight — most reliable approach.
 */
export async function exportToSheet(cert) {
  if (!APPS_SCRIPT_URL) throw new Error('VITE_APPS_SCRIPT_URL is not set in .env');

  const params = new URLSearchParams({
    name:        cert.name        || '',
    email:       cert.email       || '',
    parul_email: cert.parul_email || '',
    mobile:      cert.mobile      || '',
    enrolment:   cert.enrolment   || '',
    department:  cert.department  || '',
    semester:    cert.semester    || '',
    institute:   cert.institute   || '',
    exam_date:   cert.exam_date   || '',
    cert_title:  cert.cert_title  || '',
    credly_link: cert.credly_link || '',
    result_url:  cert.result_url  || '',
    photo_url:   cert.photo_url   || '',
  });

  // Use no-cors GET — Apps Script handles doGet(), response is opaque but write succeeds
  await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
    method: 'GET',
    mode: 'no-cors',
  });
}
