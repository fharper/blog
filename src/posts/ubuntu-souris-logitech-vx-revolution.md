---
title: "Ubuntu - Souris Logitech VX Revolution"
date: "2008-06-07"
image: "ubuntu-logo-290x300.png"
slug: "ubuntu-souris-logitech-vx-revolution"
---

Ce billet a été initialement rédigé sur le défunt blogue À la base 2

![Ubuntu](images/ubuntu-logo-290x300.png "Ubuntu")Venons-en au coeur du billet. Je suis revenu sous Linux il y a peu de temps, alors quand j'ai un peu de temps pour relaxer, j'essaie d'améliorer mon expérience. J'ai donc voulu rendre fonctionnels les multiples boutons de [ma souris](https://www.logitech.com/index.cfm/mice_pointers/mice/devices/165&cl=ca,fr "Site web de la souris Logitech VX Revolution"). [Ubuntu](https://www.ubuntu-fr.org/ "Site web de Ubuntu") a plusieurs tutoriels très bien faits, mais celui concernant ma [Logitech VX Revolution](https://doc.ubuntu-fr.org/souris_logitech_vx_revolution "Tutoriel de Ubuntu sur la Logictech VX Revolution") me semble un peu éparpillé. Je ne sais pas si c'est moi qui n'a pas bien compris, car il est vrai que j'étais habitué aux tutoriels de [Gentoo](https://www.gentoo.org/ "Site web de Gentoo") (ayant été sous Gentoo pendant 3-4 ans avant).

Bref, voici les étapes que j'ai dû faire pour réussir le tout.

On doit tout d'abord aller prendre en note le chemin de notre souris en tapant le code suivant :

```
find /dev/input/by-id/ -name "*event-mouse"
```

Cela devrait vous retourner quelque chose du genre :

```
/dev/input/by-id/usb-0d3d_USBPS2-event-mouse
/dev/input/by-id/usb-Logitech_USB_Receiver-event-mouse
```

À ce point, prenez en note celle qui contient le mot "Logitech" dedans.

Pour pouvoir gérer les touches et leurs associés des actions, vous allez avoir besoin de deux logiciels, soit [XBindKeys](https://hocwp.free.fr/xbindkeys/xbindkeys.fr.html "Site web de XBindKeys") pour associer un bouton a une action et Xvkbd](_le site web précédament référencé n'existe plus_) pour associer des touches ou combinaison de touches a une action. Pour ce faire, tapez cette commande :

```
sudo apt-get install xserver-xorg-input-evdev xbindkeys xvkbd
```

Vous allez devoir modifier les configurations de Xorg, alors pour des questions de sécurités, faites une sauvegarde de votre fichier xorg.conf:

```
sudo cp /etc/X11/xorg.conf /etc/X11/xorg.conf.backup
```

Ensuite, éditons ce fichier :

```
sudo gedit /etc/X11/xorg.conf
```

C'est un peu à partir d'ici que je trouve qu'ils se sont compliqué la vie. Dans mon cas, la partie de ma souris dans mon xorg.conf ressemblait à ça :

```
Section "InputDevice"

Identifier      "Configured Mouse"


Driver          "mouse"


Option          "CorePointer"


EndSection
```

Modifiez la ligne "Driver" et remplacée la par ça :

```
Driver          "evdev"
```

Ensuite, à la suite de la ligne "Option", ajoutez ce code :

```
Option          "Device" "/dev/input/by-id/usb-Logitech_USB_Receiver-event-mouse"

Option          "Protocol" "ExplorerPS/2"


Option          "Emulate3Buttons" "false"


Option          "Buttons" "11"


Option          "ButtonMapping" "1 2 3 9 8 6 7 13 14"


Option          "ZAxisMapping" "4 5"
```

Où vous remplacez le "/dev/input/by-id/usb-Logitech\_USB\_Receiver-event-mouse" par celui que vous avez trouvé plutôt.

Ce qui vous donnera pour votre souris, quelque chose de semblable :

```
Section "InputDevice"

Identifier      "Configured Mouse"


Driver          "evdev"


Option          "CorePointer"


Option          "Device" "/dev/input/by-id/usb-Logitech_USB_Receiver-event-mouse"


Option          "Protocol" "ExplorerPS/2"


Option          "Emulate3Buttons" "false"


Option          "Buttons" "11"


Option          "ButtonMapping" "1 2 3 9 8 6 7 13 14"


Option          "ZAxisMapping" "4 5"


EndSection
```

Il ne vous reste plus qu'à ajouter une ligne dans la section "ServerLayout":

```
InputDevice     "Configured mouse" "SendCoreEvents"
```

Ce qui me donnait dans mon cas, un "ServerLayout" comme suit :

```
Section "ServerLayout"

Identifier      "Default Layout"


Screen          "Default Screen"


InputDevice     "Synaptics Touchpad"


InputDevice     "Configured mouse" "SendCoreEvents"


EndSection
```

Bien sûr, vous pouvez modifier le nom donné par défaut "Configured Mouse" comme vous voulez (exemple: "Logitech VX Revolution"), mais vous devez vous assurer que vous utilisé le même nom dans les deux sections.

Rendu à ce point, sauvegardez votre fichier de configuration et redémarrez GDM (ou KDM si vous utilisez KDE):

```
sudo /etc/init.d/gdm restart
```

Si tout va bien, X va repartir et votre souris fonctionnera encore. Dans le cas contraire, remettez votre configuration initiale et tentez de trouver pourquoi!

Maintenant que votre souris fonctionne, voyons voir comment assigner des actions à vos touches.

Il vous suffit de créer un fichier .xbindkeysrc dans votre home :

```
gedit .xbindkeysrc
```

Puis ajoutez les actions ici. Voici ce que donne mon fichier de configuration :

```
# molette vers la droite -> rien encore
#
#m:0x0 + b:6

# molette vers la gauche -> rien encore
#
#m:0x0 + b:7

# zoom + -> augmentez le volume de 5%
"aumix -v +10"

m:0x0 + b:13

# zoom - -> diminuez le volume de 5%
"aumix -v -10"

m:0x0 + b:14

# Bouton latéral bas -> page suivante dans firefox
"/usr/bin/xvkbd -xsendevent -text "[Alt_L][Left]""

m:0x0 + b:8

# Bouton latéral haut -> page précédente dans firefox
"/usr/bin/xvkbd -xsendevent -text "[Alt_L][Right]""

m:0x0 + b:9

# bouton loupe -> Ouvrir firefox
"firefox"

m:0xO + c:99
```

Donc, la syntaxe est de mettre la commande en premier et ensuite mettre le bouton utilisé. Une fois configurez, lancez XBindKeys:

```
xbindkeys
```

Comme vous voulez que ça fonctionne chaque fois que vous vous connectez a votre compte sous Gnome, ajoutez cette application dans "Système -> Préférences -> Sessions" sous l'onglet "Programmes au démarrage".

Voilà!

Dans mon cas, j'utilisais Ubuntu 8.04 (Hardy Heron) pour faire ces modifications. En espérant que cela vous a aidé (même si c'est simplement pour clarifier le tutoriel sur Ubuntu), mais dans tous les cas, ça me fait une trace si je dois réinstaller Ubuntu éventuellement.

_Source de l'image: The Consumer's Corner (le site précédamment référencé n'existe plus)_
