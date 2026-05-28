const showOrganizationDetailsPage = async (req, res) => {
    const { id } = req.params;
    try {
        const organization = await getOrganizationDetails(id);
        res.render('organization', { 
            title: organization.name, 
            metaDesc: organization.description,
            organization 
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Could not load organization.' });
    }
};