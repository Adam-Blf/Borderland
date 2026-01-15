# Guide de Déploiement - BlackOut Hub

Ce guide explique comment mettre en ligne le Hub BlackOut avec 3 options différentes.

---

## Option A : Vercel (Recommandé)

> **Pourquoi Vercel ?** Déploiement automatique à chaque `git push`, CDN global ultra-rapide, HTTPS gratuit, et zéro configuration. C'est la solution la plus performante et la plus simple.

### Étape 1 : Connecter le repo GitHub à Vercel

1. Va sur [vercel.com](https://vercel.com) et connecte-toi avec GitHub
2. Clique sur **"Add New Project"**
3. Sélectionne le repository **Borderland** (ou le nom de ton repo)
4. Vercel détecte automatiquement Vite - vérifie ces paramètres :
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Clique sur **"Deploy"**

> Le premier déploiement prend ~1-2 minutes. Ensuite, chaque `git push` déclenche un nouveau déploiement automatique !

### Étape 2 : Configurer le domaine OVH (blackout.beloucif.com)

#### 2.1 Récupérer le domaine Vercel
1. Dans le dashboard Vercel, va dans **Settings > Domains**
2. Clique sur **"Add"** et entre : `blackout.beloucif.com`
3. Vercel affichera les instructions DNS - note l'adresse CNAME : `cname.vercel-dns.com`

#### 2.2 Configurer la Zone DNS chez OVH
1. Connecte-toi à [ovh.com/manager](https://www.ovh.com/manager)
2. Va dans **Web Cloud > Domaines > beloucif.com**
3. Clique sur l'onglet **Zone DNS**
4. Clique sur **"Ajouter une entrée"**
5. Sélectionne **CNAME**
6. Configure l'entrée :
   ```
   Sous-domaine : blackout
   Cible        : cname.vercel-dns.com.
   ```
   > **Important :** N'oublie pas le point `.` à la fin de `cname.vercel-dns.com.`
7. Clique sur **"Suivant"** puis **"Valider"**

#### 2.3 Vérification
- Attends 5-10 minutes (propagation DNS)
- Retourne sur Vercel > Settings > Domains
- Le domaine devrait passer en vert avec "Valid Configuration"
- Ton site est maintenant accessible sur `https://blackout.beloucif.com`

---

## Option B : Render

> **Pourquoi Render ?** Alternative gratuite à Vercel avec une bonne UX. Le projet inclut déjà un `render.yaml` pré-configuré.

### Étape 1 : Connecter le repo GitHub à Render

1. Va sur [render.com](https://render.com) et connecte-toi avec GitHub
2. Clique sur **"New +"** > **"Static Site"**
3. Sélectionne ton repository **Borderland**
4. Render détectera automatiquement le `render.yaml` - sinon configure manuellement :
   - **Name:** blackout-game
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. Clique sur **"Create Static Site"**

### Étape 2 : Configurer les Rewrite Rules (si nécessaire)

Le fichier `render.yaml` contient déjà les règles de rewrite pour le SPA routing :

```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

Si ça ne fonctionne pas automatiquement :
1. Va dans **Settings > Redirects/Rewrites**
2. Ajoute une règle :
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** Rewrite

### Étape 3 : Configurer le domaine personnalisé

1. Va dans **Settings > Custom Domains**
2. Clique sur **"Add Custom Domain"**
3. Entre : `blackout.beloucif.com`
4. Configure le CNAME chez OVH (même procédure qu'au-dessus) :
   ```
   Sous-domaine : blackout
   Cible        : [ton-site].onrender.com.
   ```
   > Render t'indiquera la cible exacte dans l'interface.

---

## Option C : Hébergement OVH Direct (FTP)

> **Pour qui ?** Si tu as déjà un hébergement mutualisé OVH et que tu préfères ne pas utiliser de service externe.

### Étape 1 : Générer le build de production

Ouvre un terminal dans le dossier du projet et exécute :

```bash
npm run build
```

Cela crée un dossier `dist/` contenant tous les fichiers optimisés pour la production.

### Étape 2 : Préparer l'upload FTP

Le build génère cette structure :
```
dist/
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   └── index-xxxxx.css
└── ... (autres fichiers statiques)
```

### Étape 3 : Uploader via FileZilla (ou autre client FTP)

1. **Télécharge FileZilla** si ce n'est pas fait : [filezilla-project.org](https://filezilla-project.org)

2. **Configure la connexion FTP** :
   - Hôte : `ftp.cluster0XX.hosting.ovh.net` (voir ton email OVH)
   - Identifiant : Ton identifiant FTP OVH
   - Mot de passe : Ton mot de passe FTP
   - Port : `21`

3. **Navigue vers le bon dossier** côté serveur :
   - Pour le sous-domaine `blackout.beloucif.com` : `/www/blackout/` ou `/blackout/`
   - Si c'est le domaine principal : `/www/`

4. **Upload les fichiers** :
   - Sélectionne **tout le contenu** du dossier `dist/` (pas le dossier lui-même)
   - Glisse-les vers le dossier serveur

5. **Vérifie le `.htaccess`** :
   - Le fichier `.htaccess` est dans `public/` et sera inclus dans `dist/`
   - Dans FileZilla, active "Afficher les fichiers cachés" (Serveur > Forcer l'affichage des fichiers cachés)
   - Vérifie que `.htaccess` est bien présent à la racine du site

### Contenu du .htaccess (déjà configuré)

Le fichier `.htaccess` gère le routing SPA et l'optimisation :

```apache
# Enable RewriteEngine
RewriteEngine On

# Si un fichier/dossier existe, le servir directement
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Sinon, rediriger vers index.html (SPA routing)
RewriteRule ^ index.html [QSA,L]

# Compression GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/json application/javascript
</IfModule>

# Cache des assets statiques
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Étape 4 : Configurer le sous-domaine chez OVH

Si le sous-domaine n'existe pas encore :

1. Va dans **OVH Manager > Web Cloud > Hébergements > ton-hebergement**
2. Onglet **Multisite**
3. Clique sur **"Ajouter un domaine ou sous-domaine"**
4. Entre `blackout.beloucif.com`
5. Associe-le au dossier `/blackout/` (ou celui que tu as choisi)
6. Active SSL (Let's Encrypt gratuit)

---

## Comparatif des Options

| Critère | Vercel | Render | OVH FTP |
|---------|--------|--------|---------|
| **Difficulté** | Facile | Facile | Moyen |
| **CI/CD Auto** | Oui | Oui | Non |
| **Performance** | Excellent (CDN) | Très bon | Moyen |
| **HTTPS** | Auto | Auto | Manuel/Let's Encrypt |
| **Coût** | Gratuit | Gratuit | Inclus hébergement |
| **Previews PR** | Oui | Oui | Non |

---

## Recommandation Finale

**Vercel est la meilleure option** pour ce projet :
- Déploiement automatique à chaque `git push`
- CDN global = site ultra rapide partout dans le monde
- HTTPS automatique
- Previews de chaque Pull Request
- Interface simple et claire

Configure simplement le CNAME `blackout` → `cname.vercel-dns.com` chez OVH et c'est parti !

---

## Troubleshooting

### Le site affiche une page blanche
- Vérifie que le routing SPA est bien configuré (rewrite rules ou .htaccess)
- Ouvre la console du navigateur (F12) pour voir les erreurs

### Les routes ne fonctionnent pas (404 sur refresh)
- Le `.htaccess` n'est pas actif ou mal uploadé
- Chez OVH, vérifie que le module `mod_rewrite` est activé

### Le HTTPS ne fonctionne pas
- Chez OVH : Active Let's Encrypt dans Multisite
- Vercel/Render : Attends quelques minutes, c'est automatique

### Le domaine ne pointe pas vers le site
- Attends 10-60 minutes (propagation DNS)
- Vérifie le CNAME avec : `nslookup blackout.beloucif.com`
