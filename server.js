import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Configure Express middleware
 */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));


/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    const metaDesc = 'ServeConnect connects volunteers with community organizations and service projects to create lasting impact.';
    res.render('home', { title, metaDesc });
});

app.get('/organizations', async (req, res) => {
    const title = 'Our Partner Organizations';
    const metaDesc = 'Discover the community organizations we partner with to create meaningful volunteer opportunities.';
    const organizations = await getAllOrganizations();
    res.render('organizations', { title, metaDesc, organizations });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    const metaDesc = 'Explore active service projects and find volunteer opportunities that match your passion.';
    const projects = await getAllProjects();
    console.log('Projects fetched:', projects); // verify in console, remove later
    res.render('projects', { title, metaDesc, projects });
});

app.get('/categories', async (req, res) => {
    const title = 'Service Project Categories';
    const metaDesc = 'Browse service opportunities by category: environmental, educational, community service, and health and wellness.';
    const categories = await getAllCategories();
    res.render('categories', { title, metaDesc, categories });
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});
