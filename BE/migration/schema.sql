CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    category_name character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    is_delete boolean NOT NULL DEFAULT false,
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    is_active boolean DEFAULT true,
    sku character varying(255) NOT NULL UNIQUE,
    is_delete boolean NOT NULL DEFAULT false,
    harga integer NOT NULL DEFAULT 0,
    weight integer NOT NULL DEFAULT 0,
    width integer NOT NULL DEFAULT 0,
    length integer NOT NULL DEFAULT 0,
    image text,
    categoryId integer REFERENCES category(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email character varying(50) UNIQUE,
    password character varying(255) NOT NULL,
    name character varying(100),
    role character varying(255) NOT NULL DEFAULT 'admin'::character varying,
    is_active boolean DEFAULT true,
    is_delete boolean DEFAULT false,
    invalid_login_count integer NOT NULL DEFAULT 0,
    is_locked boolean NOT NULL DEFAULT false,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);