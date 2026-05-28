import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name ASC;
    `;
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

const getCategoryDetails = async (id) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;
    try {
        const result = await db.query(query, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching category details:', error);
        throw error;
    }
};

const getProjectsByCategory = async (category_id) => {
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
        JOIN public.project_category pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date ASC;
    `;
    try {
        const result = await db.query(query, [category_id]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching projects by category:', error);
        throw error;
    }
};

const getCategoriesByProject = async (project_id) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM public.category c
        JOIN public.project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;
    try {
        const result = await db.query(query, [project_id]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories by project:', error);
        throw error;
    }
};

export { getAllCategories, getCategoryDetails, getProjectsByCategory, getCategoriesByProject };