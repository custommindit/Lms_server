const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
  keyFile: 'service-account.json',
  scopes: ['https://www.googleapis.com/auth/drive']
});

async function shareWithServiceAccount(fileId) {
  const drive = google.drive({ version: 'v3', auth });
  
  // احصل على إيميل حساب الخدمة من ملف JSON
  const serviceAccountEmail = require('./service-account.json').client_email;
  
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'user',
      emailAddress: serviceAccountEmail
    }
  });
  
  console.log('تمت مشاركة الملف مع حساب الخدمة بنجاح');
}

// استخدم ID الملف الذي حصلت عليه من النتيجة السابقة
shareWithServiceAccount('1-YQayJKCunAGAJgLpBD9eZ9pdTBdv4_y');