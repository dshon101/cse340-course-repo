import { getOrganizationDetails, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganization } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

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

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';
    const metaDesc = 'Add a new partner organization to ServeConnect.';
    res.render('new-organization', { title, metaDesc });
};

const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const title = 'Edit Organization';
    const metaDesc = `Edit details for ${organizationDetails.name}.`;
    res.render('edit-organization', { title, metaDesc, organizationDetails });
};

const organizationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 }).withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Organization description is required')
        .isLength({ max: 500 }).withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty().withMessage('Contact email is required')
        .isEmail().withMessage('Please provide a valid email address')
];

const processNewOrganizationForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png';

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${organizationId}`);
};

const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;

    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/edit-organization/' + organizationId);
    }

    const { name, description, contactEmail, logoFilename } = req.body;
    await updateOrganization(organizationId, name, description, contactEmail, logoFilename);
    req.flash('success', 'Organization updated successfully!');
    res.redirect(`/organization/${organizationId}`);
};

export {
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    showEditOrganizationForm,
    processNewOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};