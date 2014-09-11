Zibase-log
==========
Voici un petit script javascript qui permet d'afficher la log de la Zibase en temps réel.
Je l'utilise fréquemment afin de suivre l'activité de la Zibase lors de l'installation d'un nouveau scénario dans la Zibase.

<img src="http://onlinux.free.fr/pub/snapshot1.png" alt="snapshot windows" />

Le script nécessite l'installation de <a href="http://nodejs.org/download/" title="NodeJs"><img src="http://onlinux.free.fr/pub/nodejslogo.jpg" alt="nodejs logo" /><strong>NodeJs</strong></a> est disponible sous linux, Mac ou Windows.
J'ai testé le fonctionnement sous Ubuntu, Raspian ainsi que Windows7

<h1>Marche à suivre pour l'installation du script:</h1>
Avant tout, vérifiez la bonne installation de nodejs ainsi que de npm. Les commandes <em>node -v</em> et <em>npm -v</em> doivent retourner la version des applications:

Sous linux:
<pre>
pi@raspi /var/log $ node -v
v0.10.2
pi@raspi /var/log $ npm -v
1.2.15

</pre>

Sous Windows:
<a href="http://onlinux.free.fr/pub/snapshot3.png"><img src="http://onlinux.free.fr/pub/snapshot3.png" alt="snapshot3" width="1" height="1" class="alignnone size-medium wp-image-67" /><img src="http://onlinux.free.fr/pub/snapshot3.png" alt="snapshot windows" /></a>



Une fois node et npm installés, décompressez le zip du projet dans un répertoire (ex: zibase tools, pour moi ce sera udp), vous obtenez:



<pre style="font-size:12px;">
eric@I7:~/Documents$ cd udp
eric@I7:~/Documents/udp$ ll
total 16
drwxr-xr-x 2 eric eric 4096 août   9 21:07 ./
drwxr-xr-x 6 eric eric 4096 août   9 21:08 ../
-rw-rw-r-- 1 eric eric 2132 août   9 18:30 app.js
-rw-r--r-- 1 eric eric  280 août   9 19:00 package.json
eric@I7:~/Documents/udp$ 
</pre>

<em>Il faut maintenant renseigner le script avec l'adresse IP de votre zibase</em>, pour cela
éditez le fichier package.json et entrez l'adresse de votre zibase ( pour moi c'est 192.168.0.100)
<pre style="font-size:12px;">
eric@I7:~/Documents/udp$ cat package.json 
{
  "name": "zibase-log",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "wstart" : "SET IP_ZIBASE=<strong>192.168.0.100</strong> && node app.js",
    "start": "export IP_ZIBASE=<strong>192.168.0.100</strong>; node app.js"
  },
  "dependencies": {

  },
  "author": "onlinux",
   "date": "20140809"
}
</pre>
<h1>Lancement du script</h1>

Assurez-vous que tous les modules nodeJs sont bien installés, sous Windows ou Linux tapez:

<pre style="font-size:12px;">
eric@I7:~/Documents/udp$ <strong>npm install</strong>
</pre>
S'il manquait des modules, ceux-ci vont être téléchargés et installés.

Maintenant, il suffit de lancer le script.

Pour le lancer sous linux , tapez:

<pre style="font-size:12px;">
eric@I7:~/Documents/udp$ <strong>npm start</strong>
</pre>

Sous Windows, tapez:
<pre style="font-size:12px;">
E:\node\udp\<strong>npm run wstart</strong>
</pre>

vous devriez obtenir la log de la zibase en temps réel:
<pre style="font-size:12px;">
eric@I7:~/Documents/udp$ npm start

> zibase-log@0.0.1 start /home/eric/Documents/udp
> export IP_ZIBASE=192.168.0.100; node app.js

<Buffer 5a 53 49 47 00 0d 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 c0 ...>
5a534947000d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0a80072000042cc000000000000000000000000
server listening 192.168.0.114:17100
Sat Aug 09 2014 21:10:49 GMT+0200 (CEST) Zapi linked to host IP=<zip>192.168.0.114</zip> UDP Port=<zudp>17100</zudp>
Sat Aug 09 2014 21:10:51 GMT+0200 (CEST) Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2425</noise> Level=<lev>3.3</lev>/5 <dev>Temp-Hygro</dev> Ch=<ch>1</ch> T=<tem>+25.8</tem>C (+78.4F) Humidity=<hum>64</hum>%  Batt=<bat>Ok</bat>): <id>OS439207425</id>
Sat Aug 09 2014 21:10:52 GMT+0200 (CEST) Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2424</noise> Level=<lev>5.0</lev>/5 <dev>Temp-Hygro</dev> Ch=<ch>2</ch> T=<tem>+26.1</tem>C (+78.9F) Humidity=<hum>64</hum>%  Batt=<bat>Ok</bat>): <id>OS439208706</id>
^CCaught interrupt signal
<Buffer 5a 53 49 47 00 16 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 c0 ...>
Unregistering... 70
eric@I7:~/Documents/udp$ exit

</pre>

Pour suivre l'activité lors de l'installation d'un nouveau scénario , sur mon raspberry pi, je
pipe la log et grep sur une chaîne de caractère ou un numero de scénario.
On peut enregistrer l'ensemble de l'activité dans un fichier pour une analyse ultérieure.
Bon, si vous utilisez linux, vous connaissez les commandes grep, pipe| etc... tout le nécessaire pour une recherche dans une log.

<pre style="font-size:12px;">
eric@I7:~/Documents/udp$ npm start | grep radio
Sat Aug 09 2014 21:32:45 GMT+0200 (CEST) Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2445</noise> Level=<lev>5.0</lev>/5 <dev>Temp-Hygro</dev> Ch=<ch>2</ch> T=<tem>+26.1</tem>C (+78.9F) Humidity=<hum>63</hum>%  Batt=<bat>Ok</bat>): <id>OS439208706</id>
Sat Aug 09 2014 21:32:50 GMT+0200 (CEST) Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2425</noise> Level=<lev>5.0</lev>/5 <dev>Temp-Hygro</dev> Ch=<ch>1</ch> T=<tem>+26.5</tem>C (+79.7F) Humidity=<hum>64</hum>%  Batt=<bat>Ok</bat>): <id>OS439164929</id>
Sat Aug 09 2014 21:32:57 GMT+0200 (CEST) Received radio ID (<rf>433Mhz Oregon</rf> Noise=<noise>2404</noise> Level=<lev>3.5</lev>/5 <dev>Temp-Hygro</dev> Ch=<ch>1</ch> T=<tem>+25.7</tem>C (+78.2F) Humidity=<hum>64</hum>%  Batt=<bat>Ok</bat>): <id>OS439207425</id>
</pre>

Le script est très simple, il peut être conjuguer facilement à un serveur express pour accéder à l'ensemble des info Zibase ou bien créer un site comme il en existe déjà en php pour la zibase.

Voilà, en espérant que cela puisse aider quelques utilisateurs de la Zibase lors de l'installation et test d'un nouveau scénario.

