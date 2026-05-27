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
pnpm install
```

**2. Variables d'environnement**

Copie `.env.example` en `.env` et remplis les valeurs

**3. Base de données**

```bash
pnpm docker:up
pnpm prisma migrate dev
```

**4. Lancer**

```bash
pnpm dev
```

## Scripts utiles

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Serveur de développement |
| `pnpm build` | Build de production |
| `pnpm docker:up` | Démarre PostgreSQL |
| `pnpm docker:down` | Arrête PostgreSQL |
| `pnpm docker:logs` | Logs de la base de données |