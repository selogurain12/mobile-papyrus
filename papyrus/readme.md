# Papyrus

Projet de fin d'année de Mastère - Suite applicative avec API et Mobile.

## Architecture

- **API** (`apps/api/`) - Backend NestJS (sur le repo: https://github.com/selogurain12/Papyrus)
- **Webui** (`papyrus/webui`)- React Native

## Stack Technique

- **Backend** : NestJS + TypeScript + Express
- **Qualité** : ESLint + Prettier

## Installation

```bash
git clone <repository-url>
cd papyrus
corepack enable
pnpm install
```

## Lancement

```bash
pnpx expo start
```
ou
```bash
pnpx run start
```

## Structure

Repo Papyrus:
```
apps/
├── apii/          # Backend NestJS
└── webui_desktop/    # App Electron
packages/         # Code partagé
```

Repo Papyrus Mobile:
```
webui/            # App Mobile
packages/         # Code partagé
```
