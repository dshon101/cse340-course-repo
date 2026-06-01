import { getUpcomingProjects, getProjectDetails, createProject } from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const title = 'Upcoming Service Projects';
    const metaDesc = 'Explore upcoming service projects near you.';
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        res.render('projects', { title, metaDesc, projects });
    } catch (error) {
        console.error('Error loading projects:', error);
        res.status(500).render('error', { message: 'Could not load projects.' });
    }
};

const showProjectDetailsPage = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await getProjectDetails(id);
        const categories = await getCategoriesByProject(id);
        res.render('project', { title: project.title, metaDesc: project.description, project, categories });
    } catch (error) {
        console.error('Error loading project details:', error);
        res.status(500).render('error', { message: 'Could not load project.' });
    }
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';
    res.render('new-project', { title, organizations });
};

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;
    const newProjectId = await createProject(title, description, location, date, organizationId);
    req.flash('success', 'New service project created successfully!');
    res.redirect(`/project/${newProjectId}`);
};

export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation };