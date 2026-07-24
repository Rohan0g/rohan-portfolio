import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const doc = new PDFDocument({ margin: 40, size: 'A4' });
const outputPath = path.join(process.cwd(), 'public', 'resume.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// Colors
const primaryColor = '#0F172A';
const accentColor = '#06B6D4';
const textColor = '#334155';
const lightBg = '#F8FAFC';

// Header
doc.rect(0, 0, 595.28, 110).fill(primaryColor);
doc.fillColor('#FFFFFF').fontSize(24).font('Helvetica-Bold').text('ROHAN PATTNAIK', 40, 30);
doc.fontSize(12).font('Helvetica').fillColor(accentColor).text('Founder & Full Stack Developer | Nexorith IT Solutions', 40, 58);

doc.fontSize(9).fillColor('#94A3B8').text('Email: the.rohanpattnaik@gmail.com  |  Phone: +91 7684830669  |  Location: Gunupur, Odisha, India', 40, 78);
doc.text('GitHub: github.com/Rohan0g  |  LinkedIn: linkedin.com/in/rohan-pattnaik-0112a11a2', 40, 92);

let y = 130;

function addSectionHeader(title) {
  doc.rect(40, y, 515, 20).fill('#E2E8F0');
  doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text(title, 48, y + 4);
  y += 28;
}

// Career Objective
addSectionHeader('CAREER OBJECTIVE');
doc.fillColor(textColor).fontSize(9.5).font('Helvetica').text(
  'Dedicated Full Stack Developer and Founder of Nexorith IT Solutions. Completed BCA (7.27 CGPA) and pursuing MCA at GIET University. Passionate about building real-world enterprise software, ERP systems, SaaS platforms, and scalable web solutions while driving technological innovation and business growth.',
  40, y, { width: 515, align: 'justify' }
);
y += 45;

// Technical Skills
addSectionHeader('TECHNICAL SKILLS & COMPETENCIES');
const skills = [
  ['Full Stack & Web:', 'React.js, Node.js, Express.js, HTML5, CSS3, JavaScript (ES6+), PHP, Spring Boot, JDBC'],
  ['Databases:', 'MongoDB, MySQL, SQL Queries, phpMyAdmin'],
  ['Programming:', 'JavaScript, Python, Java, C'],
  ['Tools & Platforms:', 'Git, GitHub, VS Code, XAMPP, Vercel, Postman, Cloudinary'],
  ['Core Capabilities:', 'ERP Systems, Custom Billing Software, REST APIs, Responsive Web Design, Clean Code Architecture']
];

skills.forEach(([label, val]) => {
  doc.fillColor(primaryColor).fontSize(9.5).font('Helvetica-Bold').text(label, 40, y, { continued: true });
  doc.fillColor(textColor).font('Helvetica').text(` ${val}`);
  y += 16;
});
y += 10;

// Education
addSectionHeader('EDUCATION');
const edu = [
  ['Post Graduation (MCA)', 'GIET University', '2025 - 2027', 'Pursuing (5 CGPA)'],
  ['Under Graduation (BCA)', 'GIET University', '2022 - 2025', '7.27 CGPA'],
  ['Intermediate (12th)', 'CBSE Board', '2022', '62.6%'],
  ['Matriculation (10th)', 'CBSE Board', '2020', '62.2%']
];

edu.forEach(([degree, inst, year, grade]) => {
  doc.fillColor(primaryColor).fontSize(9.5).font('Helvetica-Bold').text(degree, 40, y);
  doc.fillColor(textColor).font('Helvetica').text(`${inst}  |  ${year}`, 220, y);
  doc.fillColor(accentColor).font('Helvetica-Bold').text(grade, 460, y, { align: 'right' });
  y += 16;
});
y += 10;

// Projects
addSectionHeader('KEY PROJECTS');
const projects = [
  ['Nexorith IT Solutions Suite', 'Custom ERP, Store Management, Event Management & Travel Software for Clients.'],
  ['Dr.PATH (Major Project)', 'Doctor Appointment & Healthcare Management System.'],
  ['Health Qure+ (Smart India Hackathon)', 'Healthcare solution developed for national level hackathon.'],
  ['BUSiFY (Minor Project)', 'Online Bus Seat Reservation & Ticketing Management System.']
];

projects.forEach(([name, desc]) => {
  doc.fillColor(primaryColor).fontSize(9.5).font('Helvetica-Bold').text(`• ${name}: `, 40, y, { continued: true });
  doc.fillColor(textColor).font('Helvetica').text(desc);
  y += 16;
});
y += 10;

// Experience & Soft Skills
addSectionHeader('EXPERIENCE & LEADERSHIP');
const exp = [
  'Founder & Developer — Nexorith IT Solutions (Freelance & Client Projects)',
  'Web Development Intern — Y Hills',
  'Head Office Bearer — CSA Department (2022 - 2025)',
  'Languages: English (Professional), Hindi (Professional), Odia (Native)'
];

exp.forEach(item => {
  doc.fillColor(textColor).fontSize(9.5).font('Helvetica').text(`• ${item}`, 40, y);
  y += 15;
});

doc.end();
console.log('PDF Generated successfully at', outputPath);
