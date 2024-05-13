-- CREATE DATABASE rudimentary_cms;

-- -- Table to store entity definitions
-- CREATE TABLE entities (
--     entity_id SERIAL PRIMARY KEY,
--     entity_name VARCHAR(100) NOT NULL
-- );

-- CREATE TABLE attributes (
--     attribute_id SERIAL PRIMARY KEY,
--     entity_id INT NOT NULL,
--     attribute_name VARCHAR(100) NOT NULL,
--     attribute_type VARCHAR(50) NOT NULL,
--     FOREIGN KEY (entity_id) REFERENCES entities(entity_id)
-- );

-- CREATE TABLE entity_instances (
--     instance_id SERIAL PRIMARY KEY,
--     entity_id INT NOT NULL,
--     FOREIGN KEY (entity_id) REFERENCES entities(entity_id)
-- );

-- -- Table to store attribute values for each entity instance
-- CREATE TABLE instance_attributes (
--     instance_id INT NOT NULL,
--     attribute_id INT NOT NULL,
--     attribute_value TEXT,
--     FOREIGN KEY (instance_id) REFERENCES entity_instances(instance_id),
--     FOREIGN KEY (attribute_id) REFERENCES attributes(attribute_id),
--     PRIMARY KEY (instance_id, attribute_id)
-- );