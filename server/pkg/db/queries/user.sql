-- name: GetUser :one
SELECT * FROM "user"
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM "user"
WHERE email = $1;

-- name: CreateUser :one
INSERT INTO "user" (name, email, avatar_url)
VALUES ($1, $2, $3)
RETURNING *;

-- name: UpdateUser :one
UPDATE "user" SET
    name = COALESCE($2, name),
    avatar_url = COALESCE($3, avatar_url),
    preferences = CASE WHEN sqlc.narg('preferences')::jsonb IS NOT NULL THEN preferences || sqlc.narg('preferences')::jsonb ELSE preferences END,
    updated_at = now()
WHERE id = $1
RETURNING *;
