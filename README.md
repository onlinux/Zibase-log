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

Sous Linux, téléchargez le fichier facilement avec wget
<pre style="font-size:12px;">
pi@raspidev ~ $ <strong>wget https://github.com/onlinux/Zibase-log/archive/dev.zip</strong>
</pre>

Une fois node et npm installés, décompressez le fichier <a href="https://github.com/onlinux/Zibase-log/archive/master.zip">master.zip</a> du projet dans un répertoire (ex: Zibase-log-master), vous obtenez:


<pre style="font-size:12px;">
pi@raspidev ~ $ cd <strong>Zibase-log-master</strong>
pi@raspidev ~/Zibase-log-master $ <strong>ll</strong>
total 16
-rw-r--r-- 1 pi pi 2328 sept. 11 19:21 app.js
-rw-r--r-- 1 pi pi  299 sept. 11 19:21 package.json
-rw-r--r-- 1 pi pi 5955 sept. 11 19:21 README.md
pi@raspidev ~/Zibase-log-master $ 

</pre>

<em>Il faut maintenant renseigner le script avec l'adresse IP de votre zibase</em>, pour cela
éditez le fichier package.json et entrez l'adresse de votre zibase ( pour moi c'est 192.168.0.100)
<pre style="font-size:12px;">

pi@raspidev ~/Zibase-log-master $ cat package.json 
{
  "name": "zibase-log",
  "version": "0.0.2",
  "private": true,
  "scripts": {
  },
  "dependencies": {
    "moment": "2.8.3"
  },
  "author": "onlinux",
  "date": "20140911"
}
pi@raspidev ~/Zibase-log-master $
</pre>
<h1>Lancement du script</h1>

Assurez-vous que tous les modules nodeJs sont bien installés, sous Windows ou Linux tapez:

<pre style="font-size:12px;">
eric@I7:~/Zibase-log-master$ <strong>npm install</strong>
</pre>
S'il manquait des modules, ceux-ci vont être téléchargés et installés.

Maintenant, il suffit de lancer le script.

Pour le lancer sous Linux , tapez:

<pre style="font-size:12px;">
eric@I7:~/Zibase-log-master$ <strong>npm start</strong>
</pre>

Sous Windows, tapez:
<pre style="font-size:12px;">
E:\node\udp\<strong>npm run wstart</strong>
</pre>


