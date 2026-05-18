# bibliocine
README à compléter

## Bibliocine (dev mobile)

Ce dépôt contient le backend et l'application mobile/web pour Bibliocine — une application de gestion personnelle de livres et films (suivi, états de lecture/visionnage, listes d'amis, etc.). Ce README explique comment installer, lancer et contribuer au projet en environnement de développement.

**État**: code source (backend: `bibliocine/api`, mobile/web UI: `bibliocine/webui`) — destiné au développement.

**Langues / outils**: TypeScript, NestJS (backend), Expo / React Native (mobile), pnpm, PostgreSQL, Docker.

**Table des matières**
- Présentation
- Structure du dépôt
- Installation
- Lancer en développement

## Présentation

Bibliocine est un projet personnel pour gérer et suivre la lecture de livres et le visionnage de films. Le repository regroupe le backend (API) et le client mobile/web (Expo / React Native).

## Structure du dépôt

- `bibliocine/` : code principal (workspace pnpm)
	- `api/` : backend NestJS (API, migrations, config)
	- `webui/` : application mobile/web (Expo / React Native)
	- `docker-compose.yaml` : services utiles (ex: base PostgreSQL)
	- `readme.md` : ce fichier

## Installation

1. Cloner le dépôt :

```powershell
git clone <repo_url>
cd <repo_folder>/bibliocine
```

2. Installer les dépendances (workspace pnpm) :

```powershell
pnpm install
```

3. Démarrer les services nécessaires (PostgreSQL) :

```powershell
docker-compose up -d
```

> Remarque : le fichier `docker-compose.yaml` se trouve dans `bibliocine/` et contient la configuration pour la base de données.

## Lancer en développement
- Démarrer l'UI (Expo) :

```powershell
pnpm --filter webui run start
# ou pour Android
pnpm --filter webui run android
```

Utilisez les commandes Expo fournies pour lancer sur simulateur, appareil ou web.
