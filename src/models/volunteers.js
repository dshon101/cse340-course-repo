import db from './db.js';

// add a user as a volunteer for a project
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteer_signup (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING signup_id;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows[0] || null;
};

// remove a user from a project they signed up for
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteer_signup
        WHERE user_id = $1 AND project_id = $2
        RETURNING signup_id;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows[0] || null;
};

// check if a specific user has already signed up for a specific project
const isVolunteer = async (userId, projectId) => {
    const query = `
        SELECT signup_id FROM volunteer_signup
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

// get all projects a user has signed up for (used on the dashboard)
const getVolunteerProjectsByUser = async (userId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name,
            vs.signed_up_at
        FROM volunteer_signup vs
        JOIN project p ON vs.project_id = p.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE vs.user_id = $1
        ORDER BY p.project_date ASC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

export { addVolunteer, removeVolunteer, isVolunteer, getVolunteerProjectsByUser };