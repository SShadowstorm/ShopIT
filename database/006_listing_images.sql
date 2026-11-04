BEGIN;

CREATE TABLE IF NOT EXISTS shopit.listing_images (
    filename text PRIMARY KEY,
    content_type text NOT NULL,
    data bytea NOT NULL
);

COMMIT;
