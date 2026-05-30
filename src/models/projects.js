import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC;
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;
    try {
        const result = await db.query(query, [number_of_projects]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching upcoming projects:', error);
        throw error;
    }
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    try {
        const result = await db.query(query, [id]);
        return result.rows[0]; // returns just ONE object, not an array
    } catch (error) {
        console.error('Error fetching project details:', error);
        throw error;
    }
};

const getProjectsByOrganization = async (organization_id) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.organization_id = $1
        ORDER BY p.project_date ASC;
    `;
    try {
        const result = await db.query(query, [organization_id]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching projects by organization:', error);
        throw error;
    }
};

export { getAllProjects, getUpcomingProjects, getProjectDetails, getProjectsByOrganization };