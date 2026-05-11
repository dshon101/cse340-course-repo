-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE project (
    project_id       SERIAL PRIMARY KEY,
    organization_id  INT NOT NULL,
    title            VARCHAR(200) NOT NULL,
    description      TEXT NOT NULL,
    location         VARCHAR(255) NOT NULL,
    project_date     DATE NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Service Projects
-- ========================================
INSERT INTO project (organization_id, title, description, location, project_date)
VALUES
-- BrightFuture Builders (org 1)
(1, 'Community Center Renovation',      'Renovate the east-side community center gym and common areas.',          'East Side Community Center',   '2026-06-14'),
(1, 'Habitat Home Build',               'Frame and drywall three new affordable homes with local families.',      '5th & Maple, Riverside',       '2026-07-05'),
(1, 'School Playground Installation',   'Assemble and install new playground equipment at Lincoln Elementary.',   'Lincoln Elementary School',    '2026-08-02'),
(1, 'Senior Center Accessibility Ramp', 'Build ADA-compliant ramps at the downtown senior recreation center.',   'Downtown Senior Center',       '2026-09-13'),
(1, 'Community Garden Raised Beds',     'Construct 20 raised-bed planters for the neighborhood community garden.','Riverside Community Garden',   '2026-10-04'),

-- GreenHarvest Growers (org 2)
(2, 'Spring Planting Day',              'Plant seasonal vegetables across six urban farm plots.',                 'North Urban Farm',             '2026-05-17'),
(2, 'Composting Workshop',              'Teach residents to build and maintain backyard compost bins.',           'GreenHarvest Learning Center', '2026-06-07'),
(2, 'Harvest Festival Prep',            'Harvest, sort, and package produce for the annual harvest festival.',   'West Side Farm Plots',         '2026-09-27'),
(2, 'School Garden Education Day',      'Guide elementary students through planting and caring for seedlings.',  'Franklin Elementary School',   '2026-07-19'),
(2, 'Farmers Market Volunteer Shift',   'Staff the GreenHarvest booth at the weekly downtown farmers market.',   'Downtown Farmers Market',      '2026-08-16'),

-- UnityServe Volunteers (org 3)
(3, 'Weekend Meal Distribution',        'Sort, package, and deliver meals to homebound seniors.',                'UnityServe Warehouse',         '2026-05-24'),
(3, 'Back-to-School Supply Drive',      'Collect and distribute school supplies to low-income families.',        'Westview Community Church',    '2026-08-09'),
(3, 'Park & Trail Cleanup',             'Remove litter and invasive plants from Riverside Park trail system.',   'Riverside Park',               '2026-06-21'),
(3, 'Blood Drive Coordination',         'Register donors and assist medical staff at the quarterly blood drive.','City Hospital Annex',          '2026-07-12'),
(3, 'Holiday Toy Donation Sort',        'Sort and package donated toys for distribution to children in need.',   'UnityServe Warehouse',         '2026-12-06');


-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id  SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Project-Category Junction Table
-- (many-to-many relationship)
-- ========================================
CREATE TABLE project_category (
    project_id   INT NOT NULL,
    category_id  INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_pc_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pc_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert Categories
-- ========================================
INSERT INTO category (name) VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness'),
('Construction & Infrastructure');

-- ========================================
-- Associate Projects with Categories
-- category_ids: 1=Environmental, 2=Educational,
--               3=Community Service, 4=Health and Wellness,
--               5=Construction & Infrastructure
-- ========================================
INSERT INTO project_category (project_id, category_id) VALUES
-- BrightFuture Builders projects
(1,  5),  -- Community Center Renovation       → Construction
(1,  3),  -- Community Center Renovation       → Community Service
(2,  5),  -- Habitat Home Build                → Construction
(3,  5),  -- School Playground Installation    → Construction
(3,  2),  -- School Playground Installation    → Educational
(4,  5),  -- Senior Center Accessibility Ramp  → Construction
(4,  4),  -- Senior Center Accessibility Ramp  → Health and Wellness
(5,  5),  -- Community Garden Raised Beds      → Construction
(5,  1),  -- Community Garden Raised Beds      → Environmental

-- GreenHarvest Growers projects
(6,  1),  -- Spring Planting Day               → Environmental
(6,  3),  -- Spring Planting Day               → Community Service
(7,  2),  -- Composting Workshop               → Educational
(7,  1),  -- Composting Workshop               → Environmental
(8,  3),  -- Harvest Festival Prep             → Community Service
(9,  2),  -- School Garden Education Day       → Educational
(9,  1),  -- School Garden Education Day       → Environmental
(10, 3),  -- Farmers Market Volunteer Shift    → Community Service

-- UnityServe Volunteers projects
(11, 3),  -- Weekend Meal Distribution         → Community Service
(11, 4),  -- Weekend Meal Distribution         → Health and Wellness
(12, 2),  -- Back-to-School Supply Drive       → Educational
(12, 3),  -- Back-to-School Supply Drive       → Community Service
(13, 1),  -- Park & Trail Cleanup              → Environmental
(14, 4),  -- Blood Drive Coordination          → Health and Wellness
(14, 3),  -- Blood Drive Coordination          → Community Service
(15, 3);  -- Holiday Toy Donation Sort         → Community Service