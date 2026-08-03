

-- DEFAULT ROLES

INSERT INTO roles (name, description)
VALUES
(
    'Admin',
    'System Administrator with full access'
),
(
    'User',
    'Regular library user'
)
ON CONFLICT (name) DO NOTHING;


-- DEFAULT BOOK CATEGORIES

INSERT INTO categories (name, description)
VALUES
(
    'Computer Science',
    'Programming, Software Engineering, AI, Databases'
),
(
    'Information Technology',
    'Networking, Cybersecurity, Cloud Computing'
),
(
    'Mathematics',
    'Algebra, Calculus, Statistics'
),
(
    'Physics',
    'Mechanics, Electricity, Thermodynamics'
),
(
    'Chemistry',
    'Organic, Inorganic and Physical Chemistry'
),
(
    'Biology',
    'Life Sciences and Biotechnology'
),
(
    'Medicine',
    'Medical and Health Sciences'
),
(
    'Engineering',
    'Civil, Mechanical, Electrical and Computer Engineering'
),
(
    'Business',
    'Management, Accounting, Marketing and Finance'
),
(
    'Economics',
    'Microeconomics and Macroeconomics'
),
(
    'Education',
    'Teaching, Curriculum and Educational Psychology'
),
(
    'Law',
    'Legal Studies and Constitutional Law'
),
(
    'Agriculture',
    'Agricultural Science and Food Technology'
),
(
    'Literature',
    'Novels, Poetry and Literary Criticism'
),
(
    'History',
    'World History and African History'
),
(
    'Political Science',
    'Government, Public Administration and International Relations'
),
(
    'Philosophy',
    'Ethics, Logic and Metaphysics'
),
(
    'Psychology',
    'Human Behaviour and Mental Health'
),
(
    'Religion',
    'Religious Studies and Theology'
),
(
    'General',
    'Miscellaneous Books'
)
ON CONFLICT (name) DO NOTHING;