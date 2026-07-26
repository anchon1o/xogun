-- ============================================================
-- XOGÚN — Datos de colección de Antonio (BGG export)
-- 310 xogos propios + 110 en lista de desexos
-- EXECUTAR DESPOIS de supabase-schema.sql e de crear o usuario admin
-- ============================================================

-- Paso 1: Inserir todos os xogos no catálogo global
INSERT INTO games (bgg_id, name, min_players, max_players, min_duration, max_duration, year_published, complexity, bgg_rating, approved)
VALUES
  (230498, 'Deckscape: The Fate of London', 1, 6, 60, 60, 2018, 1.97, 5.99, true),
  (298619, '15 Days', 1, 4, 20, 20, 2020, 1.8, 5.99, true),
  (174988, '4 en Letras', 1, 16, 5, 15, 2014, 1.14, 5.67, true),
  (400205, '5 Towers', 2, 5, 15, 30, 2023, 1.23, 6.43, true),
  (227018, '7 pecados', 2, 6, 20, 30, 2017, 1.11, 5.72, true),
  (316377, '7 Wonders (Second Edition)', 3, 7, 30, 30, 2020, 2.27, 7.6, true),
  (154560, 'Adventure Time Card Wars: BMO vs. Lady Rainicorn', 2, 2, 30, 30, 2014, 1.8, 5.89, true),
  (314088, 'Agropolis', 1, 4, 15, 20, 2021, 1.76, 6.85, true),
  (359402, 'Ahoy', 2, 4, 45, 75, 2022, 2.91, 6.88, true),
  (256442, 'Airship City', 3, 4, 75, 120, 2018, 3.18, 6.31, true),
  (344958, 'Alakablast', 2, 5, 15, 35, 2022, 1.4, 5.74, true),
  (254639, 'Alakazum!: Witches and Traditions', 2, 5, 20, 40, 2018, 2.0, 6.35, true),
  (360879, 'Amygdala', 2, 4, 60, 90, 2023, 2.83, 6.15, true),
  (298705, 'Animal Rescue', 1, 5, 15, 20, 2020, 1.0, 5.94, true),
  (295948, 'Aqualin', 2, 2, 20, 20, 2020, 1.52, 6.55, true),
  (359871, 'Arcs', 2, 4, 60, 120, 2024, 3.44, 7.8, true),
  (419279, 'Arcs: Leaders & Lore Pack', 2, 4, 60, 120, 2024, 3.26, 7.61, true),
  (257766, '¡Arre Unicornio!', 2, 8, 20, 40, 2018, 1.75, 5.73, true),
  (341935, 'Art Robbery', 2, 5, 20, 20, 2021, 1.21, 6.4, true),
  (395375, 'Art Society', 2, 4, 30, 60, 2023, 1.87, 7.06, true),
  (369270, 'Astra', 2, 5, 40, 90, 2022, 2.12, 6.25, true),
  (383459, 'Aurum', 3, 4, 30, 45, 2023, 2.05, 6.43, true),
  (230802, 'Azul', 2, 4, 30, 45, 2017, 1.77, 7.65, true),
  (299571, 'Bandida', 1, 4, 15, 15, 2020, 1.44, 6.17, true),
  (191925, 'Bandido', 1, 4, 10, 15, 2016, 1.13, 6.27, true),
  (30933, 'BANG! The Bullet!', 3, 8, 20, 40, 2007, 1.85, 6.72, true),
  (362874, 'Barrakuda', 2, 4, 20, 20, 2022, 1.0, 5.77, true),
  (439547, 'The Battle of the Divas', 2, 2, 45, 45, 2025, 2.73, 6.53, true),
  (447766, 'The Battle of the Divas: Palco Reale', 2, 2, 30, 40, 2025, NULL, NULL, true),
  (211534, 'Bears vs Babies', 2, 5, 15, 20, 2017, 1.24, 5.35, true),
  (232252, 'Bears vs Babies: Exclusive Backer Card', 2, 6, 15, 20, 2017, 2.0, 5.8, true),
  (211926, 'Bears vs Babies: NSFW Expansion Pack', 2, 5, 15, 20, 2017, 1.0, 5.69, true),
  (225526, 'Big Bang 13.7', 1, 4, 30, 45, 2018, 1.75, 6.16, true),
  (378890, 'The Binding of Isaac: Four Souls – Ultimate Collector''s Edition', 1, 4, 30, 60, 2023, 2.77, 6.84, true),
  (240980, 'Blood on the Clocktower', 6, 21, 30, 120, 2022, 3.02, 8.03, true),
  (288424, 'Blue Banana', 2, 5, 20, NULL, 2019, 1.5, 6.13, true),
  (413246, 'Bomb Busters', 2, 5, 30, 30, 2024, 2.0, 7.84, true),
  (322677, 'BomBarDum', 2, 6, NULL, NULL, 2020, 1.5, NULL, true),
  (202831, 'Boss Monster: Crash Landing', 2, 6, 20, NULL, 2016, 2.0, 6.29, true),
  (131835, 'Boss Monster: The Dungeon Building Card Game', 2, 4, 30, 30, 2013, 1.85, 6.17, true),
  (133772, 'Boss Monster: Tools of Hero-Kind', 2, 4, 20, 20, 2013, 1.76, 6.41, true),
  (248376, 'Buurn', 3, 5, 30, 40, 2022, 2.0, 6.42, true),
  (284936, 'Café', 1, 4, 20, 45, 2020, 2.05, 6.83, true),
  (214396, 'Campy Creatures', 2, 5, 20, 30, 2017, 1.57, 6.65, true),
  (230914, 'Carcassonne Big Box 6', 2, 6, 35, 35, 2017, 1.95, 7.6, true),
  (302840, 'Carcata', 2, 4, 20, 40, 2020, 1.44, 5.93, true),
  (50381, 'Cards Against Humanity', 4, 30, 30, 30, 2014, 1.17, 5.62, true),
  (290367, 'Caretos', 2, 4, 45, 60, 2020, 2.07, 6.32, true),
  (345972, 'Cat in the Box: Deluxe Edition', 2, 5, 20, 40, 2022, 2.05, 7.28, true),
  (191710, 'Catan: Big Box', 3, 6, 75, 75, 2016, 2.1, 6.71, true),
  (16727, 'Play on Wordz', 1, 4, 30, 30, 1984, 1.5, 5.74, true),
  (312490, 'Los Cazapedidos', 2, 4, 10, 30, 2020, 2.0, NULL, true),
  (269257, 'Chartae', 2, 2, 10, 10, 2019, 1.33, 6.11, true),
  (97093, 'Cherokee', 2, 4, 30, 30, 2011, 1.83, 5.74, true),
  (280203, 'Chicken Chicken', 2, 8, 20, 20, 2019, 1.21, 6.09, true),
  (205398, 'Citadels', 2, 8, 30, 60, 2016, 2.05, 7.09, true),
  (233961, 'Claim', 2, 2, 25, 25, 2017, 1.65, 6.68, true),
  (249763, 'Claim 2', 2, 2, 25, 25, 2018, 1.6, 6.55, true),
  (1294, 'Clue', 2, 6, 45, 45, 1989, 1.64, 5.63, true),
  (224037, 'Codenames: Duet', 2, 2, 15, 30, 2017, 1.36, 7.32, true),
  (314503, 'Codex Naturalis', 1, 4, 20, 30, 2021, 1.76, 6.96, true),
  (158899, 'Colt Express', 2, 6, 40, 40, 2014, 1.83, 7.03, true),
  (402024, 'Conservas', 1, 1, 25, 40, 2024, 2.16, 6.88, true),
  (243697, 'Cooks & Crooks', 2, 4, 20, 40, 2019, 1.4, 6.12, true),
  (306656, 'Coup + Reforma', 2, 10, 15, 15, 2016, 1.33, 6.22, true),
  (359348, 'Crack It', 2, 5, 10, 30, 2022, 1.5, 6.48, true),
  (319579, 'Crash Octopus', 1, 5, 20, 30, 2021, 1.38, 6.46, true),
  (284083, 'The Crew: The Quest for Planet Nine', 2, 5, 20, 20, 2019, 1.97, 7.68, true),
  (300753, 'Cross Clues', 2, 6, 5, 10, 2020, 1.09, 6.89, true),
  (246784, 'Cryptid', 3, 5, 30, 50, 2018, 2.25, 7.29, true),
  (298069, 'Cubitos', 2, 4, 30, 60, 2021, 2.17, 7.18, true),
  (437581, 'La Cuenta', 3, 8, 5, 15, 2025, 1.14, 6.73, true),
  (329002, 'CULTivate', 2, 5, 20, 50, 2021, 1.54, 6.28, true),
  (326908, 'The Curse of the Maldita Diamond', 2, 6, 20, 20, 2021, 1.36, 6.49, true),
  (265381, 'DANY', 3, 8, 20, 30, 2019, 1.21, 6.27, true),
  (378293, 'Daruma', 2, 5, 20, 40, 2023, 1.17, 6.22, true),
  (169654, 'Deep Sea Adventure', 2, 6, 30, 30, 2014, 1.18, 6.78, true),
  (402206, 'Dioses!', 2, 6, 10, 20, 2023, 1.17, 6.57, true),
  (39856, 'Dixit', 3, 6, 30, 30, 2008, 1.19, 7.12, true),
  (145325, 'Dixit: Origins', 3, 6, 30, 30, 2014, 1.27, 7.2, true),
  (156189, 'Dixit: Daydreams', 3, 6, 30, 30, 2014, 1.22, 7.09, true),
  (92828, 'Dixit: Odyssey', 3, 12, 30, 30, 2011, 1.16, 7.26, true),
  (243698, 'Djinn', 2, 4, 40, 40, 2018, 1.5, 5.9, true),
  (63268, 'Spot it!', 2, 8, 15, 15, 2012, 1.04, 6.44, true),
  (172540, 'Dragoon', 2, 4, 30, 60, 2016, 1.92, 6.38, true),
  (221544, 'Dragoon: The Rogue and Barbarian Expansion', 2, 6, 30, 90, 2018, 2.0, 6.52, true),
  (329714, 'Dreadful Circus', 4, 8, 45, 45, 2021, 2.24, 6.11, true),
  (357028, 'Dungeon Fighter: Second Edition', 1, 6, 45, 60, 2021, 1.74, 6.83, true),
  (307963, 'Durian', 2, 7, 20, 20, 2020, 1.12, 6.5, true),
  (342900, 'Earthborne Rangers', 1, 4, 60, 240, 2023, 3.47, 7.54, true),
  (299946, 'Eiyo', 1, 2, 20, 20, 2020, 1.95, 6.16, true),
  (204817, 'Henchmania', 2, 5, 45, 60, 2017, 2.11, 6.34, true),
  (172225, 'Exploding Kittens', 2, 5, 15, 15, 2015, 1.08, 5.98, true),
  (312667, 'Exploding Kittens: Barking Kittens', 2, 5, 15, 15, 2020, 1.14, 6.34, true),
  (204053, 'Exploding Kittens: Imploding Kittens', 2, 6, 15, NULL, 2016, 1.1, 6.7, true),
  (172242, 'Exploding Kittens: NSFW Edition', 2, 5, 10, 20, 2015, 1.08, 6.1, true),
  (346205, 'Explorers of the Woodlands', 1, 4, 45, 60, 2023, 2.17, 6.15, true),
  (300993, '¡Extinción!', 2, 6, 15, 15, 2020, 1.35, 6.45, true),
  (256381, 'Fado: Duetos e Desgarradas', 2, 4, 20, 30, 2018, 1.75, 6.32, true),
  (294233, 'Fafnir', 2, 4, 20, 20, 2019, 1.64, 5.96, true),
  (334829, 'Fall of the Mountain King', 1, 5, 60, 90, 2022, 3.5, 6.58, true),
  (271601, 'Feed the Kraken', 5, 11, 45, 90, 2022, 2.18, 7.44, true),
  (269072, 'Feelinks Revelations', 2, 8, 30, 30, 2019, 1.0, 5.63, true),
  (281194, 'Flick of Faith', 2, 4, 15, 40, 2019, 1.2, 6.93, true),
  (352418, 'Fliptown', 1, 4, 30, 45, 2023, 2.39, 7.25, true),
  (309110, 'Food Chain Island', 1, 1, 15, 15, 2020, 1.28, 6.84, true),
  (65244, 'Forbidden Island', 2, 4, 30, 30, 2010, 1.74, 6.7, true),
  (235251, 'Forest', 2, 5, 15, 15, 2017, 1.0, 5.42, true),
  (296912, 'Fort', 2, 4, 20, 40, 2020, 2.45, 6.9, true),
  (313093, 'Four Humours', 1, 6, 45, 60, 2022, 2.17, 6.24, true),
  (339214, 'Fruit Fight', 2, 5, 20, 20, 2021, 1.02, 6.7, true),
  (318084, 'Furnace', 2, 4, 30, 60, 2020, 2.32, 7.23, true),
  (321539, 'A Game of Cat & Mouth', 2, 2, 10, 10, 2020, 1.0, 6.23, true),
  (167892, 'Gang Up!', 3, 5, 30, 60, 2015, 1.4, 5.61, true),
  (30539, 'Get Bit!', 2, 7, 10, 20, 2007, 1.12, 6.05, true),
  (83195, 'Ghost Blitz', 2, 8, 20, 20, 2010, 1.13, 6.57, true),
  (12692, 'Gloom', 2, 5, 60, 60, 2018, 1.63, 6.23, true),
  (275044, 'Glow', 2, 4, 45, 45, 2021, 2.08, 6.62, true),
  (303734, 'Golems', 1, 2, 20, 20, 2020, 1.75, 5.82, true),
  (270293, 'Gorinto', 1, 4, 30, 60, 2021, 1.97, 6.62, true),
  (235252, 'GoTown', 2, 4, 20, 20, 2017, 1.31, 5.75, true),
  (237704, 'Grande y Peludo', 4, 8, 30, 30, 2017, 1.0, 5.64, true),
  (173018, 'Grimslingers', 1, 6, 15, 90, 2015, 2.74, 5.94, true),
  (337195, 'Growing Season', 1, 4, 20, 35, 2021, 1.91, 6.66, true),
  (98778, 'Hanabi', 2, 5, 25, 25, 2019, 1.69, 6.97, true),
  (356909, 'Hand-to-Hand Wombat', 3, 6, 15, 15, 2022, 1.12, 5.95, true),
  (366013, 'Heat: Pedal to the Metal', 1, 6, 30, 60, 2022, 2.2, 7.89, true),
  (252892, 'Here Comes the Dog', 2, 4, 30, 45, 2018, 1.0, 5.53, true),
  (420737, 'Hex Effects', 2, 8, 10, 30, 2025, 1.33, 6.3, true),
  (320718, 'Hidden Leaders', 2, 6, 20, 40, 2022, 1.82, 6.45, true),
  (234105, 'Hippo', 2, 4, 15, 20, 2017, 1.0, 5.84, true),
  (154597, 'Hive Pocket', 2, 2, 20, 20, 2012, 2.2, 7.52, true),
  (302520, 'Hues and Cues', 3, 10, 30, 30, 2020, 1.06, 6.29, true),
  (239621, 'Human Era', 4, 10, 30, 30, 2018, 2.0, 5.64, true),
  (339906, 'The Hunger', 2, 6, 60, 60, 2021, 2.34, 6.7, true),
  (306482, 'I C E', 1, 5, 90, 120, 2023, 2.83, 6.5, true),
  (62319, 'El Intruso', 2, 6, 60, 60, 1991, NULL, NULL, true),
  (230667, 'Itchy Feet: The Travel Game', 2, 6, 8, 45, 2017, 1.0, 6.1, true),
  (314530, 'Iwari: Deluxe Edition', 1, 6, 45, 45, 2020, 2.43, 6.86, true),
  (54043, 'Jaipur', 2, 2, 30, 30, 2009, 1.46, 7.42, true),
  (295541, 'Joking Hazard: Trial by Trolley Promo Pack', 3, 10, 30, 90, 2020, NULL, 6.03, true),
  (254640, 'Just One', 3, 7, 20, 60, 2018, 1.03, 7.52, true),
  (545, 'Kaleidos', 2, 12, 60, 60, 1994, 1.23, 6.27, true),
  (84732, 'Kariba', 2, 4, 15, 15, 2010, 1.06, 6.65, true),
  (244584, 'Kartel', 2, 6, 15, 15, 2018, 1.22, 5.85, true),
  (374595, 'Kelp: Shark vs Octopus', 2, 2, 40, 60, 2024, 2.46, 7.06, true),
  (387964, 'KHARMA!', 2, 8, 20, 30, 2023, NULL, NULL, true),
  (204602, 'Kill The Unicorns', 3, 6, 25, 45, 2019, 1.77, 6.27, true),
  (241692, 'Kill the Unicorns: The Underground Awakens', 3, 6, 25, 45, 2019, 1.0, 6.5, true),
  (348072, 'Kinoko', 2, 4, 20, NULL, 2022, 1.17, 6.0, true),
  (277458, 'Kluster', 1, 4, 10, 20, 2018, 1.04, 6.36, true),
  (348450, 'Lacrimosa', 1, 4, 90, 90, 2022, 3.16, 7.26, true),
  (370235, 'Left Right Dilemma', 3, 6, 30, 30, 2022, 1.0, 5.75, true),
  (192814, 'Lobo: 10° Aniversário', 2, 4, 30, NULL, 2015, 1.33, 6.02, true),
  (316412, 'The LOOP', 1, 4, 60, 60, 2020, 2.79, 7.35, true),
  (282700, 'LOOP: Life of Ordinary People', 1, 6, 15, 90, 2021, 2.57, 6.12, true),
  (257056, 'Lovelace & Babbage', 2, 4, 15, 30, 2019, 2.33, 6.21, true),
  (358690, 'Mantis', 2, 6, 10, 10, 2022, 1.04, 6.34, true),
  (298047, 'Marvel United', 1, 4, 40, 40, 2020, 1.84, 7.35, true),
  (303600, 'Marvel United: Enter the Spider-Verse', 1, 4, 30, 45, 2021, 2.2, 7.09, true),
  (302670, 'Marvel United: Guardians of the Galaxy Remix', 1, 4, 30, 45, 2021, 2.07, 7.0, true),
  (321731, 'Marvel United: Kickstarter Promos Box', 1, 4, 40, 40, 2021, 2.27, 7.47, true),
  (303602, 'Marvel United: Return of the Sinister Six', 1, 4, 30, 45, 2021, 2.43, 7.43, true),
  (302669, 'Marvel United: Rise of the Black Panther', 1, 4, 30, 45, 2021, 2.14, 6.96, true),
  (302668, 'Marvel United: Tales of Asgard', 1, 4, 30, 45, 2021, 2.19, 6.92, true),
  (303599, 'Marvel United: The Infinity Gauntlet', 1, 4, 30, 45, 2021, 2.43, 7.16, true),
  (204498, 'Match Madness', 1, 4, 10, 20, 2016, 1.07, 5.93, true),
  (235513, '¡MÍA!', 1, 6, 10, 20, 2018, 1.33, 6.07, true),
  (244992, 'The Mind', 2, 4, 20, 20, 2018, 1.07, 6.65, true),
  (311715, 'Mini Rogue', 1, 2, 30, 45, 2020, 2.02, 6.88, true),
  (207290, 'Mission Impractical', 3, 5, 30, NULL, 2016, 1.5, 6.11, true),
  (342764, 'Moku Tower', 2, 6, 20, 30, 2022, 1.0, 6.25, true),
  (421020, 'Monster Motel', 3, 6, 10, 10, 2024, 2.0, NULL, true),
  (220632, 'Monster Slaughter', 2, 5, 45, 60, 2018, 2.14, 6.66, true),
  (280131, 'Moon Base', 2, 2, 30, 60, 2019, 2.25, 6.21, true),
  (267945, 'Mr. Face', 3, 6, 20, 20, 2018, 1.0, 5.79, true),
  (1927, 'Munchkin', 3, 6, 60, 120, 2016, 1.82, 5.78, true),
  (3943, 'Munchkin 2: Unnatural Axe', 3, 6, 90, 90, 2002, 1.8, 6.25, true),
  (6866, 'Mus', 4, 4, 10, 10, 1745, 2.31, 6.98, true),
  (236143, 'Museum Rush', 2, 4, 20, 60, 2018, 2.2, 6.04, true),
  (257939, 'Museum Rush: Egyptian Exhibit', 1, 4, 20, 60, 2018, NULL, NULL, true),
  (264284, 'Museum Rush: The Big Heist', 1, 6, 30, 60, 2018, NULL, NULL, true),
  (915, 'Mystery of the Abbey', 3, 6, 60, 90, 1995, 2.2, 6.41, true),
  (275215, 'Namiji', 2, 5, 30, 45, 2022, 1.74, 6.63, true),
  (418460, 'Navia', 2, 4, 20, 30, 2024, 1.0, NULL, true),
  (231040, 'Nitro', 2, 6, 30, 50, 2017, 1.0, 5.68, true),
  (12942, 'No Thanks!', 3, 7, 20, 20, 2004, 1.13, 7.02, true),
  (91430, 'None of a Kind', 2, 6, 20, 20, 2011, 1.25, 5.83, true),
  (270445, 'Omerta', 3, 5, 20, NULL, 2019, 1.33, 6.4, true),
  (315071, 'OMNIA', 2, 4, 10, 20, 2020, 2.0, 6.09, true),
  (160477, 'Onitama', 2, 2, 15, 20, 2014, 1.66, 7.23, true),
  (322696, 'An Otter Won', 2, 2, 5, 15, 2020, 1.43, 6.27, true),
  (1515, 'Upwords', 2, 4, 90, 90, 1994, 1.67, 5.7, true),
  (293537, 'El Palomar', 2, 4, 15, 20, 2019, NULL, NULL, true),
  (299573, 'Papageno', 2, 5, 15, NULL, 2020, 1.0, 6.0, true),
  (291962, 'Paper Dungeons: A Dungeon Scrawler Game', 1, 8, 30, 30, 2020, 2.12, 6.76, true),
  (386102, 'Parkade', 3, 13, 5, 15, 2023, 1.0, 5.41, true),
  (114283, 'Party & Co Familiar', 3, 20, 60, 60, 1996, NULL, NULL, true),
  (415128, 'Piri Piri Summoners', 2, 4, 30, 30, 2024, NULL, 6.07, true),
  (181120, 'Pocket Invaders', 2, 4, 10, 20, 2016, 2.11, 6.08, true),
  (1383, 'Pool Party', 2, 6, 10, 10, 1999, 1.0, 5.97, true),
  (327062, 'Popcorn Dice', 2, 6, 10, 20, 2021, 1.0, 5.82, true),
  (181960, 'Portal of Heroes', 2, 5, 45, 45, 2015, 1.76, 6.43, true),
  (69676, 'Questions de Merde', 2, 24, 20, 20, 2009, 1.0, 4.89, true),
  (319031, 'Project L: Kickstarter Edition', 1, 5, 20, 40, 2020, 1.62, 6.94, true),
  (405538, 'Rafter Five', 1, 6, 20, 20, 2023, 1.06, 6.25, true),
  (281637, 'Raid', 2, 4, 15, 30, 2021, 2.0, NULL, true),
  (306882, 'Railroad Ink Challenge: Shining Yellow Edition', 1, 4, 15, 30, 2021, 2.0, 6.93, true),
  (314401, 'Rapa Nui', 2, 4, 45, 45, 2020, 2.5, 6.19, true),
  (387780, 'Rats of Wistar', 1, 4, 90, 90, 2023, 3.42, 7.08, true),
  (371922, 'Rauha', 2, 5, 45, 45, 2023, 2.31, 6.51, true),
  (237728, 'Ravine', 3, 6, 15, 20, 2017, 1.14, 6.08, true),
  (264344, 'Ravine: The Spirits Expansion', 5, 9, 15, 20, 2018, 1.75, 6.06, true),
  (301085, 'Rebis', 1, 4, 20, 20, 2020, 1.75, 5.78, true),
  (227224, 'The Red Cathedral', 1, 4, 80, 80, 2020, 2.82, 7.5, true),
  (41114, 'The Resistance', 5, 10, 30, 30, 2012, 1.59, 7.12, true),
  (232666, 'Robin Hood and the Merry Men', 1, 5, 60, 90, 2018, 3.63, 6.33, true),
  (304668, 'Robot Quest Arena', 2, 4, 30, 60, 2023, 2.15, 7.0, true),
  (37728, 'Rock the Beat', 4, 12, 30, 30, 2008, 1.06, 6.01, true),
  (278824, 'Rollecate', 1, 4, 10, 15, 2019, 1.54, 5.92, true),
  (237182, 'Root', 2, 4, 60, 90, 2019, 3.84, 7.97, true),
  (22245, 'Royal Visit', 2, 2, 20, 30, 2006, 1.66, 6.44, true),
  (344427, 'Run, Ghost, Run!', 2, 4, 30, 45, 2021, 1.4, 6.03, true),
  (406322, 'Saboteur: 20th Anniversary Edition', 2, 12, 30, 30, 2024, 1.88, 6.76, true),
  (2381, 'Scattergories', 2, 6, 30, 30, 1988, 1.36, 6.2, true),
  (291453, 'SCOUT', 2, 5, 20, 20, 2019, 1.39, 7.68, true),
  (256705, 'Seasons of Rice', 2, 2, 20, 20, 2019, 1.65, 6.33, true),
  (188834, 'Secret Hitler', 5, 10, 45, 45, 2016, 1.74, 7.37, true),
  (287258, 'Secret Night at Davis Manor', 4, 8, 60, 120, 2019, 2.67, 6.42, true),
  (285183, 'Secret Operation', 4, 10, 15, 25, 2019, 1.0, 6.02, true),
  (200847, 'Secrets', 4, 8, 15, 35, 2017, 1.5, 6.2, true),
  (211364, 'Seize the Bean', 1, 4, 45, 90, 2021, 2.89, 6.79, true),
  (265996, 'Seize the Bean: 5-6 Player Expansion', 5, 6, NULL, NULL, 2021, 3.0, 6.44, true),
  (360692, 'Septima', 1, 4, 50, 100, 2023, 3.66, 6.95, true),
  (1198, 'SET', 1, 20, 30, 30, 2015, 1.65, 6.4, true),
  (432062, 'The Shadow Theater: The Legend of the Monkey King', 2, 2, 20, 20, 2025, 1.54, 6.12, true),
  (313262, 'Shamans', 3, 5, 30, 60, 2021, 2.0, 6.5, true),
  (255165, 'SHIBUYA', 2, 4, 30, 40, 2017, 2.25, 6.03, true),
  (306142, 'Shitty Friends', 3, 22, 20, 40, 2019, 1.0, 5.36, true),
  (230765, 'Side Effects', 2, 8, 10, 30, 2017, 1.12, 6.25, true),
  (303553, 'Skulls of Sedlec', 2, 3, 20, 20, 2020, 1.24, 6.97, true),
  (204135, 'Skyjo', 2, 8, 15, 45, 2015, 1.05, 6.46, true),
  (241590, 'Smart10', 2, 8, 20, 120, 2017, 1.17, 7.08, true),
  (303733, 'Space Lunch', 1, 2, 20, 20, 2020, 1.26, 5.87, true),
  (184491, 'Spaceteam', 3, 6, 5, 5, 2015, 1.07, 6.27, true),
  (191679, 'Spaceteam: Triangulum Expansion', 6, 9, 5, NULL, 2016, 1.0, 6.21, true),
  (238090, 'Speakeasy Blues', 2, 4, 45, 45, 2018, 3.0, 6.25, true),
  (286363, 'SPELL', 2, 2, 15, 25, 2020, 2.3, 6.55, true),
  (299169, 'Spicy', 2, 6, 15, 20, 2020, 1.3, 6.94, true),
  (162886, 'Spirit Island', 1, 4, 90, 120, 2017, 4.07, 8.24, true),
  (432417, 'Splash!', 3, 5, 15, 30, 2025, 1.0, NULL, true),
  (359878, 'Splito', 3, 8, 15, 20, 2022, 1.32, 6.34, true),
  (251658, 'Sprawlopolis', 1, 4, 15, 20, 2018, 1.8, 7.11, true),
  (123570, 'Strike', 2, 5, 15, 15, 2012, 1.02, 6.75, true),
  (415524, 'Super Boss Monster', 1, 4, 30, 30, 2025, 2.33, 6.52, true),
  (2653, 'Survive: Escape from Atlantis!', 2, 4, 45, 60, 1982, 1.69, 7.21, true),
  (192291, 'Sushi Go Party!', 2, 8, 20, 20, 2016, 1.33, 7.29, true),
  (406321, 'Take 5: 30th Anniversary Edition', 1, 10, 45, 45, 2024, 1.56, 6.74, true),
  (285712, 'Tan-tan Caravan', 2, 4, 30, 30, 2019, 1.8, 5.81, true),
  (1038, 'Tantrix', 1, 6, 30, 30, 1991, 2.22, 6.13, true),
  (308416, 'Tapeworm', 2, 4, 15, 30, 2020, 1.05, 6.03, true),
  (369084, 'Tatsu', 2, 4, 20, 30, 2022, 1.92, 6.4, true),
  (247694, 'TEAM3 PINK', 3, 6, 30, 30, 2019, 1.33, 6.41, true),
  (335609, 'TEN', 1, 5, 15, 30, 2021, 1.44, 6.7, true),
  (344258, 'That Time You Killed Me', 2, 2, 15, 30, 2021, 2.33, 6.89, true),
  (406663, 'That''s Not a Hat: Pop Culture', 3, 8, 15, 15, 2024, 1.27, 6.55, true),
  (295293, 'The Thing: The Boardgame', 1, 8, 60, 90, 2022, 2.96, 7.12, true),
  (274533, 'Throw Throw Burrito', 2, 6, 15, 15, 2019, 1.1, 6.06, true),
  (288010, 'Throw Throw Burrito: Kickstarter Edition', 2, 6, 15, 15, 2019, 1.0, 6.25, true),
  (342070, 'Thunder Road: Vendetta', 2, 4, 45, 75, 2023, 1.95, 7.61, true),
  (295192, 'Tinderblox', 2, 6, 3, 15, 2020, 1.0, 6.46, true),
  (201921, 'Tiny Epic Quest', 1, 4, 30, 60, 2017, 2.69, 6.76, true),
  (244536, 'Tiny Epic Zombies', 1, 5, 30, 45, 2018, 2.5, 6.71, true),
  (186375, 'Tokaido: Deluxe Edition', 2, 5, 45, 45, 2015, 1.67, 7.0, true),
  (261901, 'Tokyo Highway', 2, 4, 30, 30, 2018, 1.46, 6.46, true),
  (300905, 'Top Ten', 4, 9, 30, 30, 2020, 1.07, 7.06, true),
  (312859, 'Townsfolk Tussle', 1, 5, 40, 200, 2022, 2.59, 7.06, true),
  (295540, 'Trial by Trolley: Derailed Bonus Pack', 3, 13, 30, 90, 2020, 1.0, 6.0, true),
  (299815, 'Trial by Trolley: Derailed Edition', 3, 13, 15, 15, 2020, 1.14, 6.09, true),
  (295539, 'Trial by Trolley: Kickstarter Expansion', 3, 13, 30, 90, 2020, 1.0, 6.0, true),
  (300848, 'Trial by Trolley: Thank You Exclusive Pack', 3, 13, 30, 90, 2020, 1.0, 5.67, true),
  (242325, 'Tricks and the Phantom', 2, 4, 10, 20, 2017, 2.0, 6.1, true),
  (352515, 'Trio', 3, 6, 15, 15, 2021, 1.07, 7.21, true),
  (386728, 'TrisTristisTigris', 2, 6, 20, 20, 2023, 1.0, 6.24, true),
  (2952, 'Trivial Pursuit: Genus Edition', 2, 24, 90, 90, 1985, 1.64, 5.25, true),
  (61135, 'Trixo', 2, 4, 15, 15, 2008, 1.0, 5.28, true),
  (255907, 'Trogdor!!: The Board Game', 1, 6, 30, 60, 2019, 1.89, 6.4, true),
  (356123, 'Turing Machine', 1, 4, 20, 20, 2022, 2.53, 7.39, true),
  (257614, 'Tussie Mussie', 2, 4, 20, 30, 2019, 1.15, 6.67, true),
  (385529, 'The Vale of Eternity', 2, 4, 30, 45, 2023, 2.15, 7.37, true),
  (315695, 'Veiled Fate', 2, 8, 60, 90, 2022, 2.23, 6.97, true),
  (361380, 'Veiled Fate: Kickstarter Exclusive Age and City Cards', 2, 8, 60, 90, 2022, NULL, 6.7, true),
  (418871, 'Veiled Fate: Renewal Die', 2, 9, 60, 90, 2025, NULL, 6.82, true),
  (418481, 'Veiled Fate: Tribunal', 2, 9, 60, 120, 2025, 3.0, 7.13, true),
  (241724, 'Villagers', 1, 5, 30, 60, 2019, 2.22, 6.9, true),
  (351540, 'Walkie Talkie', 2, 8, 1, 4, 2022, 1.08, 5.71, true),
  (177702, 'Warehouse 51', 3, 5, 30, 45, 2015, 1.8, 5.92, true),
  (262543, 'Wavelength', 2, 12, 30, 45, 2019, 1.11, 7.08, true),
  (168680, 'The Werewolves of Miller''s Hollow: The Pact', 9, 47, 40, 40, 2014, 2.08, 6.64, true),
  (298371, 'Wild Space', 1, 5, 15, 40, 2020, 2.09, 6.79, true),
  (266192, 'Wingspan', 1, 5, 40, 70, 2019, 2.48, 7.92, true),
  (260334, 'Winston', 2, 6, 15, 25, 2018, 1.0, 5.61, true),
  (354729, 'Wonder Woods', 2, 5, 20, 25, 2022, 1.19, 6.26, true),
  (227935, 'Wonderland''s War', 2, 5, 45, 125, 2022, 3.04, 7.76, true),
  (400366, 'Wondrous Creatures', 1, 4, 40, 80, 2024, 3.02, 7.68, true),
  (269146, 'Yōkai', 2, 4, 15, 35, 2019, 1.56, 6.21, true),
  (371981, 'Yokai Sketch', 2, 2, 20, 20, 2023, 1.21, 6.22, true),
  (246759, 'You''ve Got Crabs', 4, 10, 15, 20, 2018, 1.15, 5.78, true),
  (247572, 'You''ve Got Crabs: Imitation Crab Expansion Kit', 4, 10, 15, 20, 2018, 1.0, 5.91, true),
  (424219, 'Zenith', 2, 4, 25, 35, 2025, 2.33, 7.46, true),
  (447707, '3 Witches', 3, 3, 20, 20, 2025, 2.0, 6.44, true),
  (173346, '7 Wonders Duel', 2, 2, 30, 30, 2015, 2.23, 8.02, true),
  (215065, '75 Gnom'' Street', 2, 4, 30, 30, 2016, 1.83, 5.65, true),
  (429861, 'Ace of Spades', 1, 2, 40, 45, 2025, 2.17, 6.79, true),
  (22545, 'Age of Empires III: The Age of Discovery', 2, 5, 90, 120, 2007, 3.12, 7.3, true),
  (277670, 'Among Cultists: A Social Deduction Thriller', 4, 8, 45, 90, 2023, 2.43, 6.42, true),
  (338093, 'Ancient Knowledge', 2, 4, 75, 75, 2023, 2.7, 6.79, true),
  (369395, 'Art Gallery', 2, 6, 45, 75, 2023, 2.0, 6.25, true),
  (302388, 'Back to the Future: Back in Time', 2, 4, 50, 50, 2020, 2.42, 6.81, true),
  (393114, 'Barbecubes', 2, 6, 3, 15, 2025, 1.04, 6.33, true),
  (379300, 'Block Party', 2, 6, 15, 20, 2023, 1.0, 6.12, true),
  (437384, 'Bohemians', 1, 4, 45, 60, 2025, 2.18, 6.16, true),
  (332386, 'Brew', 2, 4, 45, 90, 2021, 2.45, 6.73, true),
  (295947, 'Cascadia', 1, 4, 30, 45, 2021, 1.84, 7.81, true),
  (416851, 'Castle Combo', 2, 5, 10, 25, 2024, 1.73, 7.51, true),
  (195137, 'Catacombs (Third Edition)', 2, 5, 60, 90, 2015, 2.4, 7.01, true),
  (359895, 'Chicken vs Hotdog', 2, 10, 15, 60, 2022, 1.0, 5.71, true),
  (220700, 'Cobra Paw', 2, 6, 5, 15, 2017, 1.0, 6.0, true),
  (178900, 'Codenames', 2, 8, 15, 15, 2015, 1.25, 7.47, true),
  (269595, 'Copenhagen', 2, 4, 20, 40, 2019, 1.68, 6.67, true),
  (362020, 'Cosmoctopus', 1, 4, 60, 90, 2023, 2.25, 6.73, true),
  (454148, 'Counterpoint', 3, 5, 15, 15, 2026, 2.5, NULL, true),
  (429863, 'Covenant', 1, 4, 100, 100, 2025, 3.71, 7.05, true),
  (521, 'Crokinole', 2, 4, 30, 30, 1876, 1.23, 7.94, true),
  (245476, 'CuBirds', 2, 5, 20, 20, 2018, 1.31, 6.74, true),
  (344554, 'Décorum', 2, 4, 30, 45, 2022, 2.02, 6.92, true),
  (381117, 'Doggerland', 1, 4, 30, 120, 2023, 3.31, 6.85, true),
  (215311, 'Downforce', 2, 6, 20, 40, 2017, 1.73, 7.12, true),
  (447243, 'Duel for Cardia', 2, 2, 15, 15, 2025, 1.77, 7.14, true),
  (97207, 'Dungeon Petz', 2, 4, 90, 90, 2011, 3.63, 7.25, true),
  (343847, 'Dustbiters', 2, 2, 10, 15, 2021, 1.5, 6.62, true),
  (715, 'Escape from Colditz', 2, 6, 180, 180, 1973, 2.22, 6.41, true),
  (142379, 'Escape Plan', 1, 5, 60, 120, 2019, 3.68, 7.19, true),
  (365653, 'Eter', 2, 2, 10, 30, 2022, 1.38, 6.14, true),
  (424981, 'Eternal Decks', 1, 4, 30, 40, 2025, 2.79, 7.56, true),
  (199792, 'Everdell', 1, 4, 40, 80, 2018, 2.83, 7.89, true),
  (135779, 'A Fake Artist Goes to New York', 5, 10, 20, 20, 2011, 1.1, 6.95, true),
  (192834, 'Fight for Olympus', 2, 2, 30, 30, 2016, 2.1, 6.3, true),
  (192701, 'Final Touch', 2, 4, 15, 15, 2016, 1.08, 5.79, true),
  (352574, 'Fit to Print', 1, 6, 15, 30, 2023, 2.12, 6.96, true),
  (420087, 'Flip 7', 3, 18, 20, 20, 2024, 1.04, 7.11, true),
  (330881, 'The Flood', 1, 4, 60, 120, 2023, 3.17, 5.61, true),
  (256478, 'Flotsam Fight', 2, 6, 30, 30, 2018, 1.2, 6.12, true),
  (368432, 'The Fox Experiment', 1, 4, 60, 60, 2023, 2.58, 6.94, true),
  (273065, 'Genius Square', 1, 2, 5, 30, 2018, 1.0, 6.22, true),
  (286215, 'Geometric Art', 3, 5, 10, 30, 2019, 1.75, 6.15, true),
  (291457, 'Gloomhaven: Jaws of the Lion', 1, 4, 30, 120, 2020, 3.64, 8.22, true),
  (188, 'Go', 2, 2, 30, 180, -2200, 3.92, 7.48, true),
  (330036, 'Great Plains', 2, 2, 20, 20, 2021, 1.69, 6.6, true),
  (200853, 'Habitats', 1, 5, 30, 50, 2016, 2.04, 6.93, true),
  (228234, 'HATSUDEN', 2, 2, 15, 30, 2017, 1.22, 5.96, true),
  (366910, 'Hellton Palace', 2, 2, 30, 45, 2022, 2.75, 5.89, true),
  (265402, 'In the Hall of the Mountain King', 2, 5, 90, 90, 2019, 2.86, 7.19, true),
  (281259, 'The Isle of Cats', 1, 4, 60, 90, 2019, 2.36, 7.49, true),
  (28023, 'Jamaica', 2, 6, 30, 60, 2007, 1.66, 6.97, true),
  (193042, 'Junk Art', 2, 6, 30, 30, 2016, 1.19, 7.12, true),
  (284378, 'Kanban EV', 1, 4, 60, 180, 2020, 4.29, 8.1, true),
  (183251, 'Karuba', 2, 4, 30, 40, 2015, 1.43, 7.01, true),
  (406231, 'Kikai', 2, 2, 60, 60, 2023, 3.33, 6.55, true),
  (349082, 'Kingscraft', 2, 4, 45, 60, 2023, 2.08, 6.12, true),
  (320280, 'Lapsus', 2, 8, 15, 20, 2021, 1.0, 6.47, true),
  (59959, 'Letters from Whitechapel', 2, 6, 90, 90, 2011, 2.64, 7.2, true),
  (352890, 'Minotaur', 1, 4, 45, 45, 2023, 2.12, 6.09, true),
  (118, 'Modern Art', 3, 5, 45, 45, 1992, 2.28, 7.42, true),
  (410919, 'Monster Dates', 3, 6, 15, 15, 2023, 1.0, NULL, true),
  (235902, 'Natives', 2, 4, 20, 40, 2017, 1.85, 6.21, true),
  (393175, 'Nocturne', 1, 4, 30, 45, 2024, 2.21, 6.4, true),
  (231733, 'Obsession', 1, 4, 30, 90, 2018, 3.11, 7.89, true),
  (192275, 'Olympians War', 2, 6, 15, 30, 2016, 1.4, 5.7, true),
  (147949, 'One Night Ultimate Werewolf', 3, 10, 10, 10, 2014, 1.38, 6.94, true),
  (452304, 'Orchestra', 2, 4, 90, 180, 2026, 3.0, NULL, true),
  (429405, 'Orloj: The Prague Astronomical Clock', 1, 4, 60, 120, 2025, 3.65, 7.25, true),
  (313807, 'Oros', 1, 4, 60, 120, 2023, 3.33, 6.67, true),
  (73365, 'Papayoo', 3, 8, 30, 30, 2010, 1.06, 5.87, true),
  (198953, 'Pax Renaissance', 2, 4, 60, 120, 2019, 4.47, 7.35, true),
  (347865, 'Peak', 2, 2, 15, 25, 2021, 1.5, 6.53, true),
  (309728, 'Pessoa', 1, 4, 45, 75, 2022, 2.64, 6.49, true),
  (295788, 'Plakks', 2, 4, 5, 20, 2019, 1.0, 6.28, true),
  (258779, 'Planet Unknown', 1, 6, 60, 80, 2022, 2.25, 7.59, true),
  (333280, 'Plata', 2, 6, 30, 40, 2021, 1.33, 6.29, true),
  (402106, 'Power Vacuum', 1, 5, 30, 45, 2024, 2.0, 6.31, true),
  (624, 'Quoridor', 2, 4, 15, 15, 1997, 1.82, 6.5, true),
  (332772, 'Revive', 1, 4, 90, 120, 2022, 3.46, 7.84, true),
  (402679, 'Rock Hard: 1977', 2, 5, 45, 90, 2024, 2.48, 7.05, true),
  (406454, 'En Route', 1, 4, 20, 40, 2025, 2.17, 6.51, true),
  (194655, 'Santorini', 2, 4, 20, 20, 2016, 1.72, 7.26, true),
  (169786, 'Scythe', 1, 5, 115, 115, 2016, 3.45, 8.02, true),
  (272380, 'SHŌBU', 2, 2, 15, 30, 2019, 1.86, 6.96, true),
  (92415, 'Skull', 3, 6, 15, 45, 2011, 1.12, 7.09, true),
  (150145, 'Skull King', 2, 8, 30, 30, 2013, 1.73, 7.38, true),
  (373106, 'Sky Team', 2, 2, 20, 20, 2023, 2.04, 8.0, true),
  (338960, 'Slay the Spire: The Board Game', 1, 4, 30, 150, 2024, 2.9, 8.34, true),
  (255984, 'Sleeping Gods', 1, 4, 60, 1200, 2021, 3.26, 7.88, true),
  (375459, 'Speakeasy', 1, 4, 50, 180, 2025, 4.43, 7.87, true),
  (391834, 'SpellBook', 1, 4, 45, 45, 2023, 2.05, 6.21, true),
  (346773, 'The Stifling Dark', 2, 5, 60, 120, 2024, 3.12, 6.55, true),
  (286096, 'Tapestry', 1, 5, 90, 120, 2019, 2.97, 7.33, true),
  (375651, 'That''s Not a Hat', 3, 8, 15, 15, 2023, 1.05, 6.78, true),
  (255668, 'Trickerion: Collector''s Edition', 1, 4, 60, 180, 2019, 4.48, 8.01, true),
  (134352, 'Two Rooms and a Boom', 6, 30, 7, 20, 2013, 1.48, 6.76, true),
  (425276, 'Unmatched Adventures: Teenage Mutant Ninja Turtles', 1, 4, 20, 40, 2025, 2.36, 7.38, true),
  (448419, 'Vampire Lords', 1, 4, 60, 120, 2027, 2.91, 6.94, true),
  (194690, 'Viral', 1, 5, 60, 90, 2017, 2.59, 6.62, true),
  (237179, 'Weather Machine', 2, 4, 60, 150, 2022, 4.56, 7.25, true),
  (424975, 'Wilmot''s Warehouse', 2, 6, 30, 30, 2024, 1.17, 6.89, true),
  (331106, 'The Witcher: Old World', 1, 5, 90, 150, 2023, 2.88, 7.53, true),
  (353411, 'Wreckland Run', 1, 1, 30, 45, 2022, 2.6, 6.48, true),
  (263097, 'Yeti in the House', 2, 10, 15, 45, 2018, 1.0, 6.01, true),
  (6830, 'Zendo', 2, 6, 15, 60, 2001, 2.52, 6.85, true),
  (249289, 'Zogen', 2, 6, 20, 20, 2018, 1.67, 5.6, true)
ON CONFLICT (bgg_id) DO UPDATE SET
  name = EXCLUDED.name,
  min_players = EXCLUDED.min_players,
  max_players = EXCLUDED.max_players,
  min_duration = EXCLUDED.min_duration,
  max_duration = EXCLUDED.max_duration,
  year_published = EXCLUDED.year_published,
  complexity = EXCLUDED.complexity,
  bgg_rating = EXCLUDED.bgg_rating;

-- ============================================================
-- Paso 2: Engadir á colección de Antonio
-- SUBSTITÚE 'TU_USER_ID' polo UUID do teu usuario en Supabase
-- Authentication → Users → copia o UUID
-- ============================================================

DO $$
DECLARE uid UUID := 'TU_USER_ID';
BEGIN

-- Xogos propios
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 230498
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 298619
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 5, 0 FROM games WHERE bgg_id = 174988
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 400205
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 227018
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 316377
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 154560
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 314088
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 359402
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 256442
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 344958
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 254639
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 360879
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 298705
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 295948
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 359871
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 419279
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 257766
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 341935
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 395375
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 369270
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 383459
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 230802
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 299571
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 6, 0 FROM games WHERE bgg_id = 191925
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 30933
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 362874
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 439547
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 447766
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 6, 0 FROM games WHERE bgg_id = 211534
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 232252
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 211926
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 225526
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 378890
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 240980
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 288424
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 413246
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 322677
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 202831
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 131835
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 133772
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 248376
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 284936
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 214396
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 230914
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 302840
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 50381
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 290367
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 345972
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 8, 0 FROM games WHERE bgg_id = 191710
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 8, 0 FROM games WHERE bgg_id = 16727
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 312490
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 269257
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 97093
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 280203
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 205398
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 233961
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 249763
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 8, 0 FROM games WHERE bgg_id = 1294
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 224037
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 314503
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 158899
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 402024
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 243697
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 306656
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 359348
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 319579
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 284083
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 300753
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 246784
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 298069
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 437581
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 329002
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 326908
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 265381
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 378293
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 169654
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 402206
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 9, 0 FROM games WHERE bgg_id = 39856
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 8, 0 FROM games WHERE bgg_id = 145325
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 8, 0 FROM games WHERE bgg_id = 156189
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 9, 0 FROM games WHERE bgg_id = 92828
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 243698
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 63268
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 172540
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 221544
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 329714
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 357028
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 307963
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 342900
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 299946
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 204817
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 8, 0 FROM games WHERE bgg_id = 172225
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 312667
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 204053
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 8, 0 FROM games WHERE bgg_id = 172242
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 346205
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 300993
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 256381
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 294233
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 334829
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 271601
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 269072
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 281194
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 352418
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 309110
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 65244
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 6, 0 FROM games WHERE bgg_id = 235251
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 296912
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 313093
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 339214
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 318084
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 321539
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 167892
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 5, 0 FROM games WHERE bgg_id = 30539
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 83195
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 12692
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 275044
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 303734
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 270293
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 235252
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 6, 0 FROM games WHERE bgg_id = 237704
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 173018
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 337195
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 8, 0 FROM games WHERE bgg_id = 98778
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 356909
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 366013
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 252892
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 420737
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 320718
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 234105
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 9, 0 FROM games WHERE bgg_id = 154597
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 302520
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 239621
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 339906
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 306482
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 5, 0 FROM games WHERE bgg_id = 62319
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 230667
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 314530
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 8, 0 FROM games WHERE bgg_id = 54043
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 6, 0 FROM games WHERE bgg_id = 295541
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 254640
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 6, 0 FROM games WHERE bgg_id = 545
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 84732
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 244584
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 374595
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 387964
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 204602
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 241692
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 348072
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 277458
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 348450
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 370235
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 192814
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 316412
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 282700
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 257056
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 358690
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 298047
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 303600
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 302670
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 321731
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 303602
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 302669
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 302668
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 303599
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 204498
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 235513
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 244992
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 311715
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 207290
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 342764
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 421020
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 220632
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 280131
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 267945
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 1927
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 3943
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 6866
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 236143
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 257939
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 264284
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 915
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 275215
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 418460
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 231040
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 12942
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 91430
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 270445
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 315071
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 160477
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 322696
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 1515
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 293537
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 299573
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 291962
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 386102
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 114283
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 415128
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 181120
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 1383
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 327062
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 181960
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 69676
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 319031
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 405538
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 281637
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 306882
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 314401
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 387780
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 371922
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 9, 0 FROM games WHERE bgg_id = 237728
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 9, 0 FROM games WHERE bgg_id = 264344
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 301085
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 227224
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 8, 0 FROM games WHERE bgg_id = 41114
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 232666
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 304668
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 37728
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 278824
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 237182
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 22245
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 344427
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 406322
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 8, 0 FROM games WHERE bgg_id = 2381
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 291453
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 256705
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 188834
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 287258
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 285183
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 200847
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 211364
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 265996
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 360692
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 9, 0 FROM games WHERE bgg_id = 1198
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 432062
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 313262
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 255165
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 306142
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 8, 0 FROM games WHERE bgg_id = 230765
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 303553
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 204135
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 241590
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 303733
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 184491
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 191679
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 238090
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 286363
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 299169
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 162886
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 432417
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 359878
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 251658
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 123570
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 415524
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 2653
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 192291
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 406321
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 285712
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 1038
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 308416
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 369084
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 247694
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 335609
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 344258
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 406663
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 295293
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 274533
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 288010
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 342070
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 295192
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 201921
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 244536
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 186375
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 7, 0 FROM games WHERE bgg_id = 261901
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 300905
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 312859
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 6, 0 FROM games WHERE bgg_id = 295540
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 6, 0 FROM games WHERE bgg_id = 299815
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 6, 0 FROM games WHERE bgg_id = 295539
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 6, 0 FROM games WHERE bgg_id = 300848
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 242325
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 352515
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 386728
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', 8, 0 FROM games WHERE bgg_id = 2952
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 61135
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 255907
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 356123
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 257614
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 385529
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 315695
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 361380
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 418871
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 418481
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 241724
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 351540
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 177702
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 262543
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 168680
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 298371
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 266192
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 260334
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 354729
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 227935
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 400366
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 269146
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 371981
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 246759
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 247572
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, personal_rating, times_played)
  SELECT uid, id, 'owned', NULL, 0 FROM games WHERE bgg_id = 424219
  ON CONFLICT (user_id, game_id) DO NOTHING;

-- Lista de desexos
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 447707
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 173346
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 215065
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 429861
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 22545
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 277670
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 338093
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 369395
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 302388
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 393114
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 379300
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 437384
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 332386
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 295947
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 416851
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 195137
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 359895
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 220700
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 178900
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 269595
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 362020
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 454148
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 429863
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 521
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 245476
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 344554
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 381117
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 215311
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 447243
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 97207
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 343847
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 715
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 142379
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 365653
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 424981
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 199792
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 135779
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 192834
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 192701
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 352574
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 420087
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 330881
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 256478
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 368432
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 273065
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 286215
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 291457
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 188
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 330036
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 200853
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 228234
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 366910
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 265402
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 281259
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 28023
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 193042
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 284378
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 183251
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 406231
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 349082
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 320280
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 59959
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 352890
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 118
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 410919
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 235902
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 393175
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 231733
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 192275
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 147949
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 452304
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 429405
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 313807
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 73365
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 198953
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 347865
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 309728
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 295788
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 258779
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 333280
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 402106
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 624
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 332772
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 402679
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 406454
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 194655
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 169786
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 272380
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 92415
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 150145
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 373106
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 338960
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 255984
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 375459
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 391834
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 346773
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 286096
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 375651
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 255668
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 134352
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 425276
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 448419
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 194690
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 237179
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 424975
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 331106
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 353411
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 263097
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 6830
  ON CONFLICT (user_id, game_id) DO NOTHING;
  INSERT INTO user_games (user_id, game_id, status, times_played)
  SELECT uid, id, 'wishlist', 0 FROM games WHERE bgg_id = 249289
  ON CONFLICT (user_id, game_id) DO NOTHING;

END $$;