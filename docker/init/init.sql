CREATE DATABASE csi_db;
\ connect csi_db;
CREATE TABLE users (
  id uuid NOT NULL,
  created_at timestamptz NULL,
  updated_at timestamptz NULL,
  deleted_at timestamptz NULL,
  "name" text NULL,
  username text NULL,
  "password" text NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_users_deleted_at ON public.users USING btree (deleted_at);
INSERT INTO
  public.users (
    id,
    created_at,
    updated_at,
    deleted_at,
    "name",
    username,
    "password"
  )
VALUES
  (
    '4a91c8a0-53fb-4ef5-872d-4b64a5f668f0',
    NULL,
    NULL,
    NULL,
    'John Doe',
    'johndoe',
    '$2a$14$MU8fMm7No.zR4IIPuJPjNu58grmJoD7ET19z7hzjnPESFzcoKAEvq'
  );