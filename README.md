Zibase-log
==========

Voici un petit script javascript qui permet d’afficher la log de la Zibase en temps réel.
Je l’utilise fréquemment afin de suivre l’activité de la Zibase lors de l’installation d’un nouveau scénario dans la Zibase.

Le script nécessite l’installation de nodejs logoNodeJs est disponible sous linux, Mac ou Windows.
J’ai testé le fonctionnement sous Ubuntu, Raspian ainsi que Windows7

Marche à suivre pour l’installation du script:
Téléchargez le fichier udp.zip

Décompressez le fichier dans un répertoire (ex: zibase tools, pour moi ce sera udp), vous obtenez:
<pre>
eric@I7:~/Documents$ cd udp
eric@I7:~/Documents/udp$ ll
total 16
drwxr-xr-x 2 eric eric 4096 août   9 21:07 ./
drwxr-xr-x 6 eric eric 4096 août   9 21:08 ../
-rw-rw-r-- 1 eric eric 2132 août   9 18:30 app.js
-rw-r--r-- 1 eric eric  280 août   9 19:00 package.json
eric@I7:~/Documents/udp$ 
</pre>

Il faut maintenant renseigner le script avec l’adresse IP de votre zibase, pour cela
éditez le fichier package.json et entrez l’adresse de votre zibase ( pour moi c’est 192.168.0.100)

eric@I7:~/Documents/udp$ cat package.json 
{
  "name": "zibase-log",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "wstart" : "SET IP_ZIBASE=192.168.0.100 && node app.js",
    "start": "export IP_ZIBASE=192.168.0.100; node app.js"
  },
  "dependencies": {

  },
  "author": "onlinux",
   "date": "20140809"
}
Lancement du script
Maintenant, il suffit de lancer le script.

Pour le lancer sous linux , tapez:

eric@I7:~/Documents/udp$ npm start
Sous Windows, tapez:

E:\node\udp\npm run wstart
vous devriez obtenir la log de la zibase en temps réel:

eric@I7:~/Documents/udp$ npm start

> zibase-log@0.0.1 start /home/eric/Documents/udp
> export IP_ZIBASE=192.168.0.100; node app.js


5a534947000d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0a80072000042cc000000000000000000000000
server listening 192.168.0.114:17100
Sat Aug 09 2014 21:10:49 GMT+0200 (CEST) Zapi linked to host IP=192.168.0.114 UDP Port=17100
Sat Aug 09 2014 21:10:51 GMT+0200 (CEST) Received radio ID (433Mhz Oregon Noise=2425 Level=3.3/5 Temp-Hygro Ch=1 T=+25.8C (+78.4F) Humidity=64%  Batt=Ok): OS439207425
Sat Aug 09 2014 21:10:52 GMT+0200 (CEST) Received radio ID (433Mhz Oregon Noise=2424 Level=5.0/5 Temp-Hygro Ch=2 T=+26.1C (+78.9F) Humidity=64%  Batt=Ok): OS439208706
^CCaught interrupt signal

Unregistering... 70
eric@I7:~/Documents/udp$ exit

Pour suivre l’activité lors de l’installation d’un nouveau scénario , sur mon raspberry pi, je
pipe la log et grep sur une chaîne de caractère ou un numero de scénario.
On peut enregistrer l’ensemble de l’activité dans un fichier pour une analyse ultérieure.
Bon, si vous utilisez linux, vous connaissez les commandes grep, pipe| etc… tout le nécessaire pour une recherche dans une log.
