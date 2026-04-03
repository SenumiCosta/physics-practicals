CREATE DATABASE physicslab;

\c physicslab;

CREATE TABLE simulations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    original_filename VARCHAR(255) NOT NULL,
    extracted_text TEXT NOT NULL,
    ai_extracted_metadata JSONB,
    generated_html TEXT NOT NULL,
    physics_domain VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_simulations_domain ON simulations(physics_domain);
CREATE INDEX idx_simulations_created ON simulations(created_at DESC);
