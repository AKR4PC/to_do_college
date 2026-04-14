require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');

const seeds = [
  // To do
  { title: 'Design new UI presentation', project: 'Dribbble marketing', columnId: 'todo', order: 0, progress: 70, dueDate: '24 Aug 2022', comments: 7, attachments: 2, color: '#ffa048' },
  { title: 'Add more UI/UX mockups',     project: 'Pinterest promotion', columnId: 'todo', order: 1, progress: 40, dueDate: '25 Aug 2022', comments: 0, attachments: 0, color: '#ffa048' },
  { title: 'Design few mobile screens',  project: 'Dropbox mobile app',  columnId: 'todo', order: 2, progress: 30, dueDate: '26 Aug 2022', comments: 6, attachments: 4, color: '#ff7979' },
  { title: 'Create a tweet and promote', project: 'Twitter marketing',   columnId: 'todo', order: 3, progress: 14, dueDate: '27 Aug 2022', comments: 0, attachments: 0, color: '#ff7979' },
  // In progress
  { title: 'Design system update',       project: 'Oreo website project',  columnId: 'inprogress', order: 0, progress: 30, dueDate: '12 Nov 2022', comments: 0, attachments: 0, color: '#ffa048' },
  { title: 'Create brand guideline',     project: 'Oreo branding project', columnId: 'inprogress', order: 1, progress: 70, dueDate: '13 Nov 2022', comments: 2, attachments: 13, color: '#ffa048' },
  { title: 'Create wireframe for iOS',   project: 'Oreo iOS app project',  columnId: 'inprogress', order: 2, progress: 40, dueDate: '14 Nov 2022', comments: 0, attachments: 0, color: '#ff7979' },
  { title: 'Create UI kit for layout',   project: 'Crypto mobile app',     columnId: 'inprogress', order: 3, progress: 30, dueDate: '15 Nov 2022', comments: 23, attachments: 12, color: '#ff7979' },
  // Done
  { title: 'Add product to the market',  project: 'Ui8 marketplace',       columnId: 'done', order: 0, progress: 100, dueDate: '6 Jan 2022',  comments: 1, attachments: 5, color: '#78d700' },
  { title: 'Launch product promotion',   project: 'Kickstarter campaign',  columnId: 'done', order: 1, progress: 100, dueDate: '7 Jan 2022',  comments: 17, attachments: 3, color: '#78d700' },
  { title: 'Make twitter banner',        project: 'Twitter marketing',     columnId: 'done', order: 2, progress: 100, dueDate: '8 Jan 2022',  comments: 0, attachments: 0, color: '#78d700' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const count = await Task.countDocuments();
  if (count > 0) {
    console.log(`⚠️  DB already has ${count} tasks — skipping seed.`);
  } else {
    await Task.insertMany(seeds);
    console.log(`✅ Seeded ${seeds.length} tasks.`);
  }
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
