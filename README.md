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
pi@raspidev ~ $ <strong>wget https://github.com/onlinux/Zibase-log/archive/master.zip</strong>
</pre>

Assurez-vous que tous les modules nodeJs sont bien installés, sous Windows ou Linux tapez:
<pre>
eric@I7:~/Zibase-log-master$ npm install
</pre>
S'il manquait des modules, ceux-ci vont être téléchargés et installés.

Renseignez le fichier config.js

Maintenant, il suffit de lancer le script.

Pour le lancer sous Linux ou Windows , tapez:
<pre>
eric@I7:~/Zibase-log-master$ npm start
</pre>
<img src="http://onlinux.free.fr/pub/zibase-log-windows.JPG" alt="snapshot windows" />

