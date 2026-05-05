/**
 * Seed Script – Team Task Manager
 * Run: node seed.js          → seeds the database
 *      node seed.js --destroy → wipes all data
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');
};

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const usersData = [
  { name: 'Alice Admin',   email: 'admin@demo.com',  password: 'admin123',  role: 'admin'  },
  { name: 'Bob Builder',   email: 'bob@demo.com',    password: 'member123', role: 'member' },
  { name: 'Carol Chen',    email: 'carol@demo.com',  password: 'member123', role: 'member' },
  { name: 'David Dev',     email: 'david@demo.com',  password: 'member123', role: 'member' },
  { name: 'Eva Engineer',  email: 'eva@demo.com',    password: 'member123', role: 'member' },
];

const projectColors = ['#7c6aff', '#22d98a', '#f5c842', '#ff5c7a', '#4da6ff'];

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const destroyData = async () => {
  await User.deleteMany();
  await Project.deleteMany();
  await Task.deleteMany();
  console.log('🗑  All data destroyed');
  process.exit(0);
};

const seedData = async () => {
  // Clear existing
  await User.deleteMany();
  await Project.deleteMany();
  await Task.deleteMany();

  // Create users
  const users = await User.create(usersData);
  const admin = users.find(u => u.role === 'admin');
  const members = users.filter(u => u.role === 'member');
  console.log(`👤 Created ${users.length} users`);

  // Create projects
  const projectsData = [
    {
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern UI/UX principles.',
      color: projectColors[0],
      createdBy: admin._id,
      members: [members[0]._id, members[1]._id, members[2]._id],
      status: 'active',
    },
    {
      name: 'Mobile App v2',
      description: 'Build the second version of our mobile app with React Native.',
      color: projectColors[1],
      createdBy: admin._id,
      members: [members[1]._id, members[2]._id, members[3]._id],
      status: 'active',
    },
    {
      name: 'API Integration',
      description: 'Integrate third-party payment and analytics APIs.',
      color: projectColors[2],
      createdBy: admin._id,
      members: [members[0]._id, members[3]._id],
      status: 'active',
    },
    {
      name: 'Brand Identity',
      description: 'Refresh company branding across all touch-points.',
      color: projectColors[3],
      createdBy: admin._id,
      members: [members[2]._id],
      status: 'completed',
    },
  ];

  const projects = await Project.create(projectsData);
  console.log(`📁 Created ${projects.length} projects`);

  // ─── Tasks ─────────────────────────────────────────────────────────────────
  const now = new Date();
  const daysFromNow = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

  const tasksData = [
    // Website Redesign
    { title: 'Design new homepage mockup',         description: 'Create Figma mockups for desktop and mobile.',    status: 'done',        priority: 'high',   deadline: daysFromNow(-5),  project: projects[0]._id, assignedTo: members[0]._id, createdBy: admin._id },
    { title: 'Set up component library',           description: 'Configure Storybook with design tokens.',          status: 'in-progress', priority: 'high',   deadline: daysFromNow(3),   project: projects[0]._id, assignedTo: members[1]._id, createdBy: admin._id },
    { title: 'Write content for About page',       description: 'Draft copy and get stakeholder approval.',         status: 'todo',        priority: 'medium', deadline: daysFromNow(7),   project: projects[0]._id, assignedTo: members[2]._id, createdBy: admin._id },
    { title: 'SEO audit and optimisation',         description: 'Run Lighthouse and fix all critical issues.',      status: 'todo',        priority: 'medium', deadline: daysFromNow(14),  project: projects[0]._id, assignedTo: members[0]._id, createdBy: admin._id },
    { title: 'Implement dark mode',                description: 'Add CSS variables and theme toggle.',              status: 'todo',        priority: 'low',    deadline: daysFromNow(20),  project: projects[0]._id, assignedTo: null,           createdBy: admin._id },
    { title: 'Performance testing',                description: 'Measure Core Web Vitals before launch.',           status: 'todo',        priority: 'high',   deadline: daysFromNow(-2),  project: projects[0]._id, assignedTo: members[1]._id, createdBy: admin._id }, // overdue

    // Mobile App v2
    { title: 'Set up React Native project',        description: 'Initialise Expo with TypeScript template.',        status: 'done',        priority: 'high',   deadline: daysFromNow(-10), project: projects[1]._id, assignedTo: members[1]._id, createdBy: admin._id },
    { title: 'Authentication screens',             description: 'Login, register, forgot password flows.',          status: 'done',        priority: 'high',   deadline: daysFromNow(-4),  project: projects[1]._id, assignedTo: members[2]._id, createdBy: admin._id },
    { title: 'Home feed component',                description: 'Infinite-scroll feed with pull-to-refresh.',       status: 'in-progress', priority: 'high',   deadline: daysFromNow(4),   project: projects[1]._id, assignedTo: members[1]._id, createdBy: admin._id },
    { title: 'Push notification service',          description: 'Integrate Expo Push Notifications.',               status: 'todo',        priority: 'medium', deadline: daysFromNow(10),  project: projects[1]._id, assignedTo: members[3]._id, createdBy: admin._id },
    { title: 'Offline mode caching',               description: 'Use AsyncStorage to cache key data.',              status: 'todo',        priority: 'low',    deadline: daysFromNow(18),  project: projects[1]._id, assignedTo: null,           createdBy: admin._id },
    { title: 'Beta TestFlight submission',         description: 'Package and submit build to Apple TestFlight.',    status: 'todo',        priority: 'high',   deadline: daysFromNow(-1),  project: projects[1]._id, assignedTo: members[2]._id, createdBy: admin._id }, // overdue

    // API Integration
    { title: 'Stripe payment gateway',             description: 'Integrate Stripe checkout and webhook handlers.',  status: 'in-progress', priority: 'high',   deadline: daysFromNow(2),   project: projects[2]._id, assignedTo: members[0]._id, createdBy: admin._id },
    { title: 'Mixpanel analytics setup',           description: 'Track user events and funnels.',                  status: 'todo',        priority: 'medium', deadline: daysFromNow(9),   project: projects[2]._id, assignedTo: members[3]._id, createdBy: admin._id },
    { title: 'Rate limiting middleware',           description: 'Add express-rate-limit to all public routes.',    status: 'done',        priority: 'high',   deadline: daysFromNow(-7),  project: projects[2]._id, assignedTo: members[0]._id, createdBy: admin._id },
    { title: 'API documentation (Swagger)',        description: 'Auto-generate OpenAPI docs from JSDoc comments.',  status: 'todo',        priority: 'low',    deadline: daysFromNow(21),  project: projects[2]._id, assignedTo: null,           createdBy: admin._id },

    // Brand Identity (completed project)
    { title: 'Logo redesign',                      description: 'Work with designer on new mark.',                  status: 'done',        priority: 'high',   deadline: daysFromNow(-20), project: projects[3]._id, assignedTo: members[2]._id, createdBy: admin._id },
    { title: 'Typography system',                  description: 'Choose and document type scale.',                  status: 'done',        priority: 'medium', deadline: daysFromNow(-15), project: projects[3]._id, assignedTo: members[2]._id, createdBy: admin._id },
    { title: 'Brand guidelines PDF',               description: 'Export final guidelines document.',                status: 'done',        priority: 'medium', deadline: daysFromNow(-8),  project: projects[3]._id, assignedTo: members[2]._id, createdBy: admin._id },
  ];

  const tasks = await Task.create(tasksData);
  console.log(`✅ Created ${tasks.length} tasks`);

  console.log('\n─────────────────────────────────────────');
  console.log('🎉  Database seeded successfully!\n');
  console.log('Demo credentials:');
  console.log('  Admin  → admin@demo.com  / admin123');
  console.log('  Member → bob@demo.com    / member123');
  console.log('  Member → carol@demo.com  / member123');
  console.log('─────────────────────────────────────────\n');
  process.exit(0);
};

// ─── ENTRY POINT ──────────────────────────────────────────────────────────────
connectDB().then(() => {
  if (process.argv[2] === '--destroy') {
    destroyData();
  } else {
    seedData();
  }
}).catch(err => {
  console.error(err);
  process.exit(1);
});
