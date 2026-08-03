# Estrutura de Xogún

Documento de referencia da arquitectura completa da aplicación.

---

## Stack tecnolóxico

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Row Level Security)
- **Despregue**: Vercel (frontend estático + funcións serverless en `/api`)
- **Edición**: GitHub web editor / GitHub Desktop (sen terminal local)

---

## Estrutura de carpetas

```
xogun/
├── api/                          → Funcións serverless de Vercel (CommonJS)
│   ├── admin-create-user.js
│   ├── admin-update-user.js
│   ├── admin-delete-user.js
│   └── bgg-import.js             → Proxy á API de BoardGameGeek
│
├── public/
│   ├── favicon.png
│   └── brand/                    → Logo, favicon, recursos de marca (ver README.md interno)
│
├── src/
│   ├── App.jsx                   → Router principal + modo mantemento
│   ├── index.css                 → Estilos globais (Tailwind + tema)
│   │
│   ├── contexts/                 → Estado global compartido
│   │   ├── AuthContext.jsx           (usuario, perfil, sesión)
│   │   ├── AppConfigContext.jsx      (configuración da app, cargada de app_config)
│   │   ├── ThemeContext.jsx          (tema claro/escuro/pixel, cor de acento)
│   │   ├── GameSessionContext.jsx    (xogo + xogadores + plantilla activos)
│   │   └── MusicPlayerContext.jsx    (reprodutor YouTube persistente)
│   │
│   ├── hooks/                    → Lóxica de datos (un hook por dominio)
│   │   ├── useGames.js               (catálogo, xogos pendentes)
│   │   ├── useCollection.js          (colección persoal, estados, visibilidade)
│   │   ├── useGameLists.js           (listas personalizadas)
│   │   ├── useGameRating.js          (puntuación media da comunidade)
│   │   ├── useCatalogMeta.js         (categorías/mecánicas)
│   │   ├── useFriendships.js         (amizades)
│   │   ├── useMatches.js             (historial de partidas)
│   │   ├── useStats.js               (estatísticas derivadas)
│   │   ├── useToolPresets.js         (presets de ferramentas + plantillas de marcador)
│   │   ├── usePlaylists.js           (playlists multi-fonte)
│   │   ├── useNotifications.js       (notificacións internas)
│   │   ├── useChallenges.js          (retos entre amigos)
│   │   ├── useSessionCalendar.js     (calendario de sesións + RSVP)
│   │   ├── useCharacterSheets.js     (follas de personaxe de rol)
│   │   └── useActivityLog.js         (rexistro de moderación — só admin)
│   │
│   ├── lib/                      → Utilidades sen estado
│   │   ├── achievements.js           (definición de logros)
│   │   ├── scoreTemplates.js         (presets de estrutura de marcador)
│   │   ├── characterTemplates.js     (plantillas de folla de personaxe)
│   │   ├── feltPreference.js         (cor de tapete compartida)
│   │   ├── soundEffects.js           (efectos de son sintéticos)
│   │   └── exportMatches.js          (exportación a CSV)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx            (nav principal, responsive)
│   │   │   └── NotificationBell.jsx
│   │   ├── shared/                   (compoñentes reutilizables entre páxinas)
│   │   │   ├── GameCard.jsx / GameListRow.jsx
│   │   │   ├── GameFilters.jsx
│   │   │   ├── ImagePreview.jsx
│   │   │   ├── FullscreenButton.jsx
│   │   │   └── Logo.jsx
│   │   ├── collection/
│   │   │   ├── GameForm.jsx          (crear/editar xogo, importación BGG)
│   │   │   ├── GameDetail.jsx        (ficha completa, puntuacións, vídeos)
│   │   │   ├── BggImport.jsx
│   │   │   └── GameListsPanel.jsx
│   │   └── tools/                    (as 12 ferramentas de Ferramentas)
│   │       ├── SessionSetup.jsx      (configuración inicial: xogo+xogadores+plantilla)
│   │       ├── DiceWidget.jsx        (dados 3D, moeda personalizable)
│   │       ├── ScoreWidget.jsx       (marcador xenérico ou por plantilla, gardar/retomar)
│   │       ├── ScoreTemplateCreator.jsx
│   │       ├── TimerWidget.jsx
│   │       ├── TurnWidget.jsx        (mesa visual, tapete personalizable)
│   │       ├── MusicWidget.jsx
│   │       ├── SoundboardWidget.jsx
│   │       ├── ResourceBankWidget.jsx
│   │       ├── ObjectiveCounterWidget.jsx
│   │       ├── MatchNotesWidget.jsx
│   │       ├── TeamGeneratorWidget.jsx (aleatorio/equilibrado)
│   │       ├── RoleDealerWidget.jsx
│   │       ├── FirstPlayerWidget.jsx  (ruleta/carta/dedo/voz)
│   │       └── CharacterSheetWidget.jsx
│   │
│   └── pages/                    → Unha por ruta
│       ├── HomePage.jsx              → /
│       ├── LoginPage.jsx             → /login
│       ├── GamesPage.jsx             → /catalogo (catálogo + colección + listas nun só sitio)
│       ├── ToolsPage.jsx             → /ferramentas
│       ├── MatchesPage.jsx           → /partidas
│       ├── ProfilePage.jsx           → /perfil
│       ├── FriendsPage.jsx           → /amigos
│       ├── StatsPage.jsx             → /estatisticas (+ logros)
│       ├── ChallengesPage.jsx        → /retos
│       ├── CalendarPage.jsx          → /calendario
│       └── admin/                    → /admin/* (só is_admin)
│           ├── AdminLayout.jsx           (menú responsive)
│           ├── AdminUsers.jsx
│           ├── AdminCatalog.jsx
│           ├── AdminGames.jsx            (aprobación de xogos novos)
│           ├── AdminImages.jsx           (imaxes pendentes + importación masiva BGG)
│           ├── AdminSuggestions.jsx      (suxestións de edición)
│           ├── AdminPresets.jsx          (presets/plantillas pendentes)
│           ├── AdminAvatars.jsx
│           ├── AdminFeatures.jsx         (toggles de funcionalidades + mantemento)
│           ├── AdminAppearance.jsx       (logo, cores, campos visibles)
│           └── AdminActivityLog.jsx      (rexistro de moderación)
│
├── supabase-schema.sql           → Schema completo (instalación desde cero)
└── migration-*.sql               → Migracións incrementais (bases de datos existentes)
```

---

## Modelo de datos (táboas principais)

| Táboa | Propósito |
|---|---|
| `profiles` | Perfís de usuario (nome, avatar, preferencias, admin) |
| `avatars` | Avatares SVG dispoñibles (editables en Admin) |
| `friendships` | Relacións de amizade (pending/accepted) |
| `app_config` | Configuración global (chave-valor JSONB): nome, logo, cores, funcionalidades, mantemento |
| `game_categories` / `game_mechanics` | Taxonomías do catálogo |
| `games` | Catálogo de xogos (moderado) |
| `game_edit_suggestions` | Suxestións de edición pendentes |
| `user_games` | Colección persoal (estado + visibilidade por entrada + puntuación persoal) |
| `game_lists` / `game_list_items` | Listas personalizadas |
| `score_templates` | Presets de ferramentas e plantillas de estrutura de marcador |
| `matches` / `match_players` | Historial de partidas (planned/active/finished) |
| `playlists` / `playlist_tracks` | Playlists de música (YouTube/Spotify/embed) |
| `notifications` | Notificacións internas (opt-in) |
| `challenges` | Retos entre amigos |
| `session_invites` | Invitacións RSVP a partidas planificadas |
| `activity_log` | Rexistro de accións de moderación |
| `character_sheet_templates` / `characters` | Follas de personaxe de rol |

**Patrón común**: a maioría das táboas de contido xerado por usuarios seguen o mesmo fluxo de moderación — `created_by` + `approved`, con RLS que permite ao creador ver o seu propio contido pendente, e a todos ver o aprobado.

---

## Fluxo de sesión de xogo

`GameSessionContext` conecta as ferramentas entre si:

1. En **Ferramentas**, `SessionSetup` pide xogo (opcional) + xogadores + plantilla de marcador
2. Esa información queda dispoñible para todos os widgets activos: Marcador, Turnos, Banco de recursos, Obxectivos, Equipos, Roles, Xogador inicial
3. Sen sesión activa, cada ferramenta funciona en modo independente con nomes locais

---

## Convencións de código

- Interface en galego
- `.jsx` para compoñentes React, `.js` para hooks/lib sen JSX
- Funcións de `/api` en CommonJS por incompatibilidade con Vercel
- Cores/tema: variables CSS + paleta configurable dende Admin
- SVGs de logo/avatares usan `fill="currentColor"`
