import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

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
    const { id } = req.params; // gets the ID from the URL
    try {
        const project = await getProjectDetails(id);
        res.render('project', {title: project.title, metaDesc: project.description, project });
    } catch (error) {
        console.error('Error loading project details:', error);
        res.status(500).render('error', { message: 'Could not load project.' });
    }
};

export { showProjectsPage, showProjectDetailsPage };