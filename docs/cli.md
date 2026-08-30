# Pourquoi cette structure CLI (`@kiln/cli`)

Ce document explique les choix d’architecture du package CLI — pas l’inventaire des commandes ni une feuille de route.

## Trois couches

Kiln sépare **grammaire**, **handlers** et **domaine** pour que chaque couche change pour une seule raison :

| Couche    | Responsabilité             | Pourquoi à part                                           |
| --------- | -------------------------- | --------------------------------------------------------- |
| Grammaire | déclarer argv (Commander)  | la syntaxe CLI évolue sans toucher la logique             |
| Handlers  | mapper argv → résultat CLI | Commander reste une dépendance de surface, pas au cœur    |
| Domaine   | logique métier             | testable sans subprocess, sans I/O, réutilisable hors CLI |

Sans cette séparation, une option ou un renommage de sous-commande force des edits dans la logique métier — et les tests finissent en intégration subprocess pour tout.

## `cli.ts` et `index.ts`

Le binaire (`cli.ts`) appelle `run()`. L’API (`index.ts`) exporte `createProgram()` et `run()` sans side-effect à l’import.

**Pourquoi :** les tests et l’usage programmatique doivent pouvoir assembler le programme, injecter un argv, et inspecter le code de sortie — sans lancer le process comme un vrai bin.

## `commands/` par groupe

Chaque groupe de commandes a son registre (`register*Commands`). La racine (`commands/index.ts`) ne fait qu’attacher ces groupes au programme.

**Pourquoi :** éviter un fichier monolithique ; chaque groupe porte sa grammaire Commander au même endroit.

## `bind.ts` — glue Commander → handlers

`bindAction` connecte une `.action()` Commander à un handler async. `withCwd` fournit le fragment d’options commun (`cwd`).

**Pourquoi :** Commander passe les arguments dans un ordre peu intuitif (positionnels/options, puis `command` en dernier). Centraliser ce câblage évite de répéter la même glue dans chaque action et isole cette bizarrerie à un seul module.

## `options.ts` et `result.ts`

- **`options.ts`** — ce qu’un handler reçoit (`CliCommandOptions`, `CliGlobalOptions`)
- **`result.ts`** — ce qu’un handler retourne (`CliCommandResult`) et comment le CLI l’applique (`writeCliResult`)

**Pourquoi :** entrée et sortie sont deux contrats distincts. Les options globales (`--cwd`) sont un `Partial` du même shape que les options handler — une fois résolues, elles deviennent le `cwd` requis.

## `CliCommandResult` et `writeCliResult`

Les handlers retournent `{ exitCode, stdout? }`. `writeCliResult` écrit sur stdout et pose `process.exitCode`.

**Pourquoi :**

- les handlers restent purs (pas d’I/O directe) — faciles à tester unitairement ;
- `exitOverride()` de Commander interdit `process.exit()` — le CLI doit piloter la sortie via `exitCode` ;
- un seul point applique stdout + code de sortie, donc un comportement cohérent pour toutes les commandes.

## `context.ts` — `resolveCwd`

`--cwd` est déclaré sur le programme racine. `resolveCwd(command)` lit les options globales via `optsWithGlobals()` sur le `command` d’une `.action()`.

**Pourquoi :** Commander ne propage pas les flags globaux automatiquement dans chaque sous-commande — il faut le `command` de l’action courante pour les voir. Résoudre le chemin une fois donne aux handlers un `cwd` absolu, indépendamment de l’endroit d’où la commande est enregistrée.

## Commander

Bibliothèque de parsing argv et génération d’aide. Kiln ne réinvente pas le CLI framework.

**Pourquoi :** nested subcommands, help, validation d’arguments — problème résolu et maintenu ailleurs. Kiln se concentre sur le métier.
