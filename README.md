# Honey Bloom - Boutique en ligne

Bienvenue sur Honey Bloom, une boutique en ligne développée avec React, TypeScript, Vite et Tailwind CSS.

## Fonctionnalités

- Recherche de produits
- Ajout au panier avec gestion des quantités et du stock
- Affichage dynamique des produits
- Interface moderne et responsive
- Notifications toast pour les actions utilisateur

## Technologies utilisées

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## Installation

Assure-toi d'avoir [Node.js](https://nodejs.org/) et [npm](https://www.npmjs.com/) installés.

```sh
git clone https://github.com/Safidy-Michael/honey-bloom-frontend
cd honey-bloom-frontend
npm install
```

## Lancer le projet en développement

```sh
npm run dev
```

Le projet sera accessible sur [http://localhost:5173](http://localhost:5173) (ou le port indiqué dans le terminal).

## Structure du projet

```
src/
  components/      // Composants réutilisables
  contexts/        // Contextes React (ex: panier)
  hooks/           // Hooks personnalisés
  lib/             // Fonctions utilitaires et API
  pages/           // Pages principales (ex: Shop)
  assets/          // Images et ressources
public/            // Fichiers statiques
```

## Déploiement

Pour construire le projet pour la production :

```sh
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

## Auteur

Ce projet a été conçu et développé par Safidy Michael.

---

N'hésite pas à ouvrir une issue ou à proposer une amélioration !
