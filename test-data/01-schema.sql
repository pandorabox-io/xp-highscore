-- minetest postgresql player backend schema (subset used by xp-highscore)

CREATE TABLE IF NOT EXISTS player (
	name VARCHAR(60) NOT NULL,
	pitch NUMERIC(15, 7) NOT NULL,
	yaw NUMERIC(15, 7) NOT NULL,
	posX NUMERIC(15, 7) NOT NULL,
	posY NUMERIC(15, 7) NOT NULL,
	posZ NUMERIC(15, 7) NOT NULL,
	hp INT NOT NULL,
	breath INT NOT NULL,
	creation_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
	modification_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
	PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS player_metadata (
	player VARCHAR(60) NOT NULL,
	attr VARCHAR(256) NOT NULL,
	value TEXT,
	PRIMARY KEY (player, attr),
	CONSTRAINT player_metadata_fkey FOREIGN KEY (player) REFERENCES player (name) ON DELETE CASCADE
);
