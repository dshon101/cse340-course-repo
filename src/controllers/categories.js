import { getAllCategories, getCategoryDetails, getProjectsByCategory, getCategoriesByServiceProjectId, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

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

const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';
    const metaDesc = 'Add a new service project category to ServeConnect.';
    res.render('new-category', { title, metaDesc });
};

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryDetails(categoryId);
    const title = 'Edit Category';
    const metaDesc = `Edit details for ${category.name}.`;
    res.render('edit-category', { title, metaDesc, category });
};

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

const processNewCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    const { name } = req.body;
    const categoryId = await createCategory(name);
    req.flash('success', 'Category created successfully!');
    res.redirect(`/category/${categoryId}`);
};

const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/edit-category/' + categoryId);
    }

    const { name } = req.body;
    await updateCategory(categoryId, name);
    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${categoryId}`);
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);
    const title = 'Assign Categories to Project';
    const metaDesc = `Assign categories to ${projectDetails.title}.`;
    res.render('assign-categories', { title, metaDesc, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

export { showCategoriesPage, showCategoryDetailsPage, showNewCategoryForm, showEditCategoryForm, processNewCategoryForm, processEditCategoryForm, categoryValidation, showAssignCategoriesForm, processAssignCategoriesForm };