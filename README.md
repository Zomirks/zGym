# zGym

Application de suivi de poids dans un premier temps et de sport à termes.
On crée un compte, rentres ses mesures, et on peut suivre son évolution dans le temps.

## Stack

- **Next.js 16** — App Router
- **Prisma 7** — ORM, base PostgreSQL
- **better-auth** — authentification (sessions, comptes)
- **shadcn/ui + Tailwind CSS 4** — composants et styles
- **Docker** — base de données en local

## Lancer le projet

**1. Dépendances**

```bash
npm install
```

**2. Variables d'environnement**

Copie `.env.example` en `.env` et remplis les valeurs

**3. Base de données**

```bash
npm run docker:up
npx prisma migrate dev
```

**4. Lancer**

```bash
npm run dev
```

## Scripts utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run docker:up` | Démarre PostgreSQL |
| `npm run docker:down` | Arrête PostgreSQL |
| `npm run docker:logs` | Logs de la base de données |