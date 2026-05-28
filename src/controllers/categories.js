import { getAllCategories, getCategoryDetails, getProjectsByCategory } from '../models/categories.js';

const showCategoriesPage = async (req, res) => {
    const title = 'Service Project Categories';
    const metaDesc = 'Browse service opportunities by category: environmental, educational, community service, and health and wellness.';
    try {
        const categories = await getAllCategories();
        res.render('categories', { title, metaDesc, categories });
    } catch (error) {
        console.error('Error loading categories:', error);
        res.status(500).render('error', { message: 'Could not load categories. Please try again later.' });
    }
};

const showCategoryDetailsPage = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await getCategoryDetails(id);
        const projects = await getProjectsByCategory(id);
        res.render('category', { title: category.name, metaDesc: `Service projects in the ${category.name} category.`, category, projects });
    } catch (error) {
        console.error('Error loading category details:', error);
        res.status(500).render('error', { message: 'Could not load category. Please try again later.' });
    }
};

export { showCategoriesPage, showCategoryDetailsPage };