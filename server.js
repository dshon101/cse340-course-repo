import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

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
    const metaDesc = 'Meet our partner organizations driving environmental, educational, and community change.';
    res.render('organizations', { title, metaDesc });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    const metaDesc = 'Explore active service projects and find volunteer opportunities that match your passion.';
    res.render('projects', { title, metaDesc });
});

app.get('/categories', async (req, res) => {
    const title = 'Service Project Categories';
    const metaDesc = 'Browse service opportunities by category: environmental, educational, community service, and health and wellness.';
    res.render('categories', { title, metaDesc });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
