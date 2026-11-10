-- Drop tables in reverse order (for development only)
DROP TABLE IF EXISTS downloads CASCADE;
DROP TABLE IF EXISTS reading_history CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS book_files CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ROLES

CREATE TABLE roles (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USERS

CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    role_id INTEGER NOT NULL,

    full_name VARCHAR(150) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password TEXT NOT NULL,

reset_token TEXT,

reset_token_expires TIMESTAMP,

profile_image_url TEXT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT
);

-- CATEGORIES

CREATE TABLE categories (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BOOKS

CREATE TABLE books (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    category_id INTEGER NOT NULL,

    created_by INTEGER NOT NULL,

    title VARCHAR(255) NOT NULL,

    author VARCHAR(150) NOT NULL,

    description TEXT,

    isbn VARCHAR(20) UNIQUE,

    publication_year INTEGER
    CHECK (
        publication_year IS NULL
        OR publication_year BETWEEN 1800 AND EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
    ),
    language VARCHAR(50) DEFAULT 'English',

    pages INTEGER NOT NULL,

    download_count INTEGER DEFAULT 0,

    is_deleted BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_book_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_book_creator
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_pages
        CHECK (pages > 0),

    CONSTRAINT chk_downloads
        CHECK (download_count >= 0)
);

-- BOOK FILES

CREATE TABLE book_files (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    book_id INTEGER NOT NULL UNIQUE,

   cover_image_url TEXT,

    file_url TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_book_files
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE
);

-- FAVORITES

CREATE TABLE favorites (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id INTEGER NOT NULL,

    book_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_favorite_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorite_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_favorite
        UNIQUE(user_id, book_id)
);

-- READING HISTORY

CREATE TABLE reading_history (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id INTEGER NOT NULL,

    book_id INTEGER NOT NULL,

    last_page INTEGER DEFAULT 1
    CHECK (last_page >= 1),

    last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_history_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_history_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_history
        UNIQUE(user_id, book_id)
);

-- DOWNLOADS

CREATE TABLE downloads (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id INTEGER NOT NULL,

    book_id INTEGER NOT NULL,

    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_download_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_download_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE
);

-- INDEXES

CREATE INDEX idx_books_title
ON books(title);

CREATE INDEX idx_books_author
ON books(author);

CREATE INDEX idx_books_category
ON books(category_id);

CREATE INDEX idx_users_email
ON users(email);