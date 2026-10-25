# Frontend du blog

Interface web d'un blog permettant de créer, consulter, modifier et supprimer des articles.

Le projet utilise Next.js, React, TypeScript et Tailwind CSS. Il communique avec une API développée avec Flask et SQLAlchemy.

## Fonctionnalités

- Afficher tous les articles
- Créer un article avec un titre, un auteur et un contenu
- Modifier un article existant
- Supprimer un article
- Afficher des messages d'erreur en cas de problème avec l'API
- Interface en français adaptée aux ordinateurs et aux appareils mobiles

## Prérequis

- Node.js
- npm
- Le backend Flask du projet

## Installation et exécution locale

1. Cloner ce dépôt.
2. Ouvrir un terminal dans le dossier du frontend.
3. Installer les dépendances :

   ```bash
   npm install
   ```

4. Créer un fichier `.env.local` à la racine du frontend et ajouter :

   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
   ```

5. Démarrer le backend Flask en suivant les instructions de son README.
6. Démarrer le frontend :

   ```bash
   npm run dev
   ```

7. Ouvrir `http://localhost:3000` dans le navigateur.

## Configuration de l'API

La variable `NEXT_PUBLIC_API_URL` définit l'adresse du backend utilisé par l'interface.

En développement local, sa valeur est :

`http://127.0.0.1:5000`

En production, cette variable doit contenir l'adresse publique du backend déployé.

## Déploiement

- **Site en ligne :** https://leesee-blog-frontend.vercel.app/
- **API backend :** https://leesee-blog-backend.onrender.com/

## Technologies utilisées

- Next.js
- React
- TypeScript
- Tailwind CSS
- API REST avec Flask
