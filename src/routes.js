import express from 'express';
import { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm } from './controllers/projects.js';
import { showOrganizationDetailsPage, showNewOrganizationForm, showEditOrganizationForm, processNewOrganizationForm, processEditOrganizationForm, organizationValidation } from './controllers/organizations.js';
import { showCategoriesPage, showCategoryDetailsPage, showNewCategoryForm, showEditCategoryForm, processNewCategoryForm, processEditCategoryForm, categoryValidation, showAssignCategoriesForm, processAssignCategoriesForm } from './controllers/categories.js';
import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard} from './controllers/users.js';

const router = express.Router();

// Organization routes
router.get('/organizations', async (req, res) => {
    const { getAllOrganizations } = await import('./models/organizations.js');
    const title = 'Our Partner Organizations';
    const metaDesc = 'Discover the community organizations we partner with to create meaningful volunteer opportunities.';
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', { title, metaDesc, organizations });
    } catch (error) {
        console.error('Error loading organizations:', error);
        res.status(500).render('error', { message: 'Could not load organizations. Please try again later.' });
    }
});
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Project routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// Category routes
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

export default router;