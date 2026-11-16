# TP 1 — Azure Functions

Application serverless locale en JavaScript (modèle Azure Functions v4) :

1. `POST /api/messages` reçoit un objet JSON ;
2. la fonction `submitMessage` publie le message dans la queue `messages` ;
3. la fonction `storeMessage` est déclenchée par la queue et écrit le message dans la table `Messages`.

## Prérequis

- Node.js 24
- Azure Functions Core Tools 4

## Installation et lancement

Dans un premier terminal :

```powershell
npm.cmd install
npm.cmd run storage
```

Dans un second terminal :

```powershell
npm.cmd start
```

## Validation

Envoyer une requête :

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:7071/api/messages `
  -ContentType 'application/json' `
  -Body '{"name":"Kylian","message":"Bonjour Azure Functions"}'
```

La réponse HTTP doit avoir le statut `202`. Les logs du runtime doivent ensuite indiquer la publication dans la queue puis l'écriture dans la table.

Les données locales d'Azurite sont placées dans `.azurite/` et ne sont pas versionnées.
