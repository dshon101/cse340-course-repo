import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

// handle when a user clicks "Volunteer for this project"
const processVolunteerSignup = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'You have signed up to volunteer for this project!');
    } catch (error) {
        console.error('Error signing up as volunteer:', error);
        req.flash('error', 'Something went wrong. Please try again.');
    }

    res.redirect(`/project/${projectId}`);
};

// handle when a user clicks "Remove me as a volunteer"
const processVolunteerRemoval = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have been removed as a volunteer for this project.');
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'Something went wrong. Please try again.');
    }

    // if they came from the dashboard send them back there, otherwise back to the project
    const from = req.query.from;
    if (from === 'dashboard') {
        return res.redirect('/dashboard');
    }
    res.redirect(`/project/${projectId}`);
};

export { processVolunteerSignup, processVolunteerRemoval };