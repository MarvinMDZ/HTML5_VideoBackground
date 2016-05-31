# <a href="https://platform.mediamind.com"><img src="http://www.sizmek.es/eb/users/javiegido_/__logos/HTML5.png" alt="Sizmek" width="26" height="36" /></a> VideoBackground 3.0 <a href="https://platform.mediamind.com"><img src="http://www.sizmek.es/eb/users/javiegido_/__logos/logo-dark.png" alt="Sizmek" width="57" height="15" /></a>

Plantilla genérica con todo lo necesario para crear formatos tipo VideoBackground utilizando workspaces de Sizmek.

<a href="#" target="_blank"><img src="http://www.sizmek.es/eb/users/javiegido_/__Screenshots/verDemo.png" alt="Ver Demo" width="165" height="44" /></a>


## Descripción

El formato VideoBackground es sencillo de configurar y tiene diferentes posibilidades para cubrir los requisitos de todos los soportes certificados. La plantilla permite crear el formato con video o con una imagen estática.

La base del formato depende de cada soporte y plan de medios; hay soportes en los que la base es un 1x1, otros que requieren de una base de billboard o que incluso aceptan diferentes tipos de tamaños de base dependiendo de la acción. Si no te han especificado cual debe ser la base del formato, contacta con tu agencia de medios.

La plantilla consta de dos ficheros html, uno para la base del formato y otro para el skin con video.


## Configuración 

Para editar las opciones del formato, modifica los valores del fichero *setup.js* que se encuentra en el directorio "panels/kinVideo" de la plantilla.

```javascript
var setup = {
	isStatic:false,
	autoPlayVideo:true,
	autoPlayFrequency:1,
	autoExpand:false,
	autoExpandFrequency:1,
	topGap: 150,
	collapseOnVideoEnds: true,
	unmuteOnExpand: true,
	muteOnCollapse:true,
};
```
Es posible hacer que el formato se expanda realizando la llamada desde la base. Simplemente habria que realizar la siguiente llamada para que se recoja la expansion desde el panel del skin de video.

```javascript

EB._sendMessage("baseExpansionRequest", {});

```

Cuando tengas terminada la creatividad, sube la pieza a la plataforma. En este caso, el formato que debes seleccionar en la plataforma es **HTML5 EXPANDABLE BANNER**. ¿No tienes claro cómo? Puedes seguir esta pequeña guia [Subir Creatividades Sizmek](http://www.sizmek.es/wiki/subir-creatividades-html5/).

Configura tu creatividad como se indica en la imagen:

![Video Background Setup]()

Este formato necesita el siguiente JS en la configuración de la plataforma, si no sabes como hacerlo o no tienes los permisos pídeselo al equipo de Sizmek.

```
www.sizmek.es/eb/users/javiegido_/__TESTS/CustomVideoBackground2.js
```

Recuerda que si tienes cualquier duda puedes ponerte en contacto con el equipo de <a href="mailto:creativesupport-spain@sizmek.com">Soporte Creativo de Sizmek</a>

***