import { getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganization } from '../models/projects.js';

const showOrganizationDetailsPage = async (req, res) => {
    const { id } = req.params;
    try {
        const organization = await getOrganizationDetails(id);
        const projects = await getProjectsByOrganization(id);
        res.render('organization', { 
            title: organization.name, 
            metaDesc: organization.description,
            organization,
            projects
        });
    } catch (error) {
        console.error('Error loading organization:', error);
        res.status(500).render('error', { message: 'Could not load organization. Please try again later.' });
    }
};

export { showOrganizationDetailsPage };
