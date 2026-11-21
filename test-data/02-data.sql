-- test data: players with randomized stats
-- the first 40 names are taken from world/mod_storage/skinsdb so their skins show up

CREATE TEMP TABLE seed_names (name VARCHAR(60));

INSERT INTO seed_names (name) VALUES
  ('213'),
  ('ASTRIDF'),
  ('Addison'),
  ('Adventurer'),
  ('Annilover'),
  ('Arleen2121'),
  ('Balitas55'),
  ('BelloCico'),
  ('Bo'),
  ('BuckarooBanzai'),
  ('Bustos304cnxbxu'),
  ('Buxinha'),
  ('Cingomma'),
  ('Coin_38'),
  ('Colter421'),
  ('Corburn85'),
  ('Cristian'),
  ('Dan'),
  ('DarkRoy'),
  ('Dayana'),
  ('Dominick'),
  ('Drive'),
  ('Ekin'),
  ('Engelke12'),
  ('Fayard49'),
  ('GAMEOVERHD3'),
  ('GIRLsurviver'),
  ('Gauner'),
  ('Hamiton87'),
  ('Hardridge610zzn'),
  ('Hottes59'),
  ('Ice_bonnie'),
  ('IcemanDs'),
  ('Imkerad'),
  ('J-HOPE'),
  ('Jamie_4451'),
  ('KAKUZU'),
  ('Kapsalis792'),
  ('Kawaii-Chan'),
  ('Kemner90')
;

-- additional generic players (some without a skin)
INSERT INTO seed_names (name)
SELECT 'testplayer' || i FROM generate_series(1, 60) AS i;

-- players: most active within the last month (shown in highscore), some inactive (filtered out)
INSERT INTO player (name, pitch, yaw, posX, posY, posZ, hp, breath, creation_date, modification_date)
SELECT
	name,
	0, 0,
	round((random() * 2000 - 1000)::numeric, 2),
	round((random() * 100)::numeric, 2),
	round((random() * 2000 - 1000)::numeric, 2),
	20, 11,
	NOW() - (random() * interval '730 days') - interval '40 days',
	CASE WHEN random() < 0.85
		THEN NOW() - (random() * interval '28 days')
		ELSE NOW() - interval '35 days' - (random() * interval '300 days')
	END
FROM seed_names;

-- numeric stats, xp roughly exponential-ish so ranks are spread out
INSERT INTO player_metadata (player, attr, value)
SELECT p.name, a.attr,
	CASE a.attr
		WHEN 'xp'               THEN floor(power(random(), 3) * 150000)::text
		WHEN 'digged_nodes'     THEN floor(random() * 500000)::text
		WHEN 'placed_nodes'     THEN floor(random() * 300000)::text
		WHEN 'crafted'          THEN floor(random() * 20000)::text
		WHEN 'died'             THEN floor(random() * 500)::text
		WHEN 'punch_count'      THEN floor(random() * 50000)::text
		WHEN 'inflicted_damage' THEN floor(random() * 100000)::text
		WHEN 'played_time'      THEN floor(random() * 3600 * 1000)::text
	END
FROM player p
CROSS JOIN (VALUES ('xp'), ('digged_nodes'), ('placed_nodes'), ('crafted'),
	('died'), ('punch_count'), ('inflicted_damage'), ('played_time')) AS a(attr);

-- a well known player with fixed values for predictable testing
INSERT INTO player (name, pitch, yaw, posX, posY, posZ, hp, breath, creation_date, modification_date)
VALUES ('singleplayer', 0, 0, 0, 10, 0, 20, 11, NOW() - interval '365 days', NOW() - interval '1 hour');

INSERT INTO player_metadata (player, attr, value) VALUES
	('singleplayer', 'xp', '1000000'),
	('singleplayer', 'digged_nodes', '123456'),
	('singleplayer', 'placed_nodes', '65432'),
	('singleplayer', 'crafted', '4321'),
	('singleplayer', 'died', '42'),
	('singleplayer', 'punch_count', '1337'),
	('singleplayer', 'inflicted_damage', '9001'),
	('singleplayer', 'played_time', '360000');
