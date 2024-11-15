---
title: "Le grand ménage des 404"
date: "2009-04-15"
categories: 
  - "brainer"
  - "en"
  - "fixtxt"
  - "fiximg"
  - "fixlang"
  - "fixtags"
  - "fixurl"
slug: "le-grand-menage-des-404"
---

Ce billet a été initialement rédigé sur le défunt blogue À la base 2

![google-bot-850](images/3444412519_9b33d9fdea.png)Au tout début de ce blogue, j'ai eu la merveilleuse idée l'idée d'utiliser une extension qui créait un billet avec chaque gazouillis que je faisais sur Twitter. Le but de cette manœuvre? Avoir mes statut de [Twitter](https://twitter.com "Site de Twitter") disponible sur mon blogue et alimenter mon fil RSS un peu plus que mes peu nombreux billets. Je savais lorsque j'ai démarré ce blogue, que ça serait impossible pour l'instant d'écrire régulièrement comme je l'ai déjà fait dans un autre blogue, alors comme j'utilisais plus régulièrement Twitter, 1 + 1 faisait 2.

Bon toute personne qui connait la façon dont les moteurs de recherche fonctionnent auraient pu me dire que l'idée n'était pas très bonne si je ne voulais pas avoir du trafic peu révélant sur mon blogue, mais sur le coup je n'y avais pas pensé (je connaissais peu les rouage du SEO). Effectivement, comme Twitter me sert beaucoup plus à un niveau personnel, j'avais souvent des personnes qui atterrissaient ici avec des recherches dans Google auquel je ne désirais pas nécessairement être associé. Pas que je ne cautionne pas ce que je dis sur Twitter, au contraire, mais je ne voulais pas nécessairement que quelqu'un arrive ici en cherchant "panne STM", parce que j'ai du faire un gazouillis 1 fois par 2 semaine sur ça!

J'ai donc décidé de mettre fin à ça en effaçant tous les billets provenant de Twitter. Hé bien, ce petit ménage m'a donné plus de 2000 erreurs dans l'outil de [Google Webmaster Tools](https://www.google.com/webmasters/tools "Site de Google Webmaster Tools"). C'est bien normal, j'avais plusieurs liens qui n'existaient plus. Pour régler le tout, j'avais deux choix:

1. Entrer les liens un par un dans l'outil de suppression de Google Webmaster Tools.
2. Créer un robots.txt avec les liens qui ne doivent pas être indexer par le Google Bot.

La solution #1 était trop fastidieuse vu qu'il n'est possible que d'entrer un lien à la fois. Oui je pouvais simplement prendre les racines communces, mais de 2000 erreurs je passais à peut-être 1500 que je devais de toute manière entrer une par une. La deuxième solution était donc la meilleure. Toujours en utilisant le Google Webmaster Tools je pouvais utiliser l'option "Download all errors for this site" qui me donnait un fichier avec la liste de tous les liens causant problèmes. Bien sûr dans cette liste, il y avait beaucoup d'informations inutiles tel le type d'erreur, la date, le nombre de pages...

J'ai donc utilisé un programme comme Notepad++ (pour Windows) qui permet de faire un remplacement à l'aide d'une expression régulière. Combien de fois ais-je louangé cette invention que sont les expressions régulières... Encore une fois, cela m'a sauvé beaucoup de temps. Voici, si le format ne change pas, l'expression à utiliser:

```
,404 [0-9a-zA-Z,() /]+
```

que vous remplacé par rien (champ vide). Ensuite, pour enlever votre racine et ajouter l'instruction pour le bot, utilisez une expression de ce genre:

```
^https://votresite.com
```

que vous remplacé par

```
Disallow:
```

Il ne vous reste plus qu'à copier le contenu de ce fichier dans votre robots.txt.

Voilà! Vous aurez donc fait un ménage de géant en quelques minutes...

Depuis que j'ai ajouté ces éléments à mon robots.txt, Google enlève mes liens à coup de 100 à 200 par jour. D'ici 1 semaine, toutes les erreurs devraient avoir disparues. Rendu à ce point, je pourrais nettoyer mon fichier robots.txt!
