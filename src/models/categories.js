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

export { getAllCategories };