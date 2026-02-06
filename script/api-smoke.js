// Minimal Node.js API smoke test harness
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const endpoints = [
  { method: 'GET', url: '/api/site-config' },
  { method: 'GET', url: '/api/courses' },
  { method: 'GET', url: '/api/announcements' },
  { method: 'GET', url: '/api/success-stories' },
  { method: 'GET', url: '/api/director-message' },
  { method: 'GET', url: '/api/faculty' },
  { method: 'GET', url: '/api/testimonials' },
  { method: 'POST', url: '/api/testimonials', body: { name: 'Tester', role: 'Visitor', content: 'Nice', rating: 5 } },
  { method: 'POST', url: '/api/contacts', body: { name: 'User', phone: '999', message: 'Hi' } },
  { method: 'POST', url: '/api/career-applications', body: { name: 'Alice', subject: 'Teacher', experience: '5 yrs', phone: '999', email: 'a@b.com', resumeUrl: 'http://example.com/resume.pdf' } },
];

const host = 'http://localhost:5000';

async function run() {
  for (const ep of endpoints) {
    const opts = { method: ep.method, headers: { 'Content-Type': 'application/json' } };
    if (ep.body) opts.body = JSON.stringify(ep.body);
    try {
      const res = await fetch(host + ep.url, opts);
      const text = await res.text();
      console.log(`== ${ep.method} ${ep.url} ==`);
      console.log(`HTTP ${res.status}`);
      console.log(text.slice(0, 300));
    } catch (err) {
      console.error(`Error for ${ep.method} ${ep.url}:`, err);
    }
  }
}

run();
