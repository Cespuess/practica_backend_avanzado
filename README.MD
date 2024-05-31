# Proyecto módulo Backend Avanzado con Node.js

## ¿ En que consiste ?

Basándonos en la [práctica del módulo de Fundamentos Backend](https://github.com/Cespuess/practica_fundamentos_backend_node.js), en la que creamos una página de compra/venta de artículos de segunda mano y su API,
hemos mejorado el proyecto implementado autenticación con JWT para la API, y con Session en el website. Además, hemos convertido el website en una aplicación multi-idioma e incorporado un microservicio que genera un thumbnail de la imagen subida al crear un anuncio.

Os proporciono el fichero con la explicación de la [práctica](./Backend_Avanzado_Práctica_Web16.pdf) para una comprensión más completa.

## Pasos a seguir para poder utilizar la aplicación

#### <u> Instalar MongoDB en vuestro dispositivo: </u>

Descargar MongoDB de su [página web](https://www.mongodb.com/try/download/community).

Después de instalar MongoDB, inicia el servidor y mantenerlo en ejecución.

#### <u> Clonar el repositorio: </u>

Copiar el siguiente comando en el directorio de vuestra elección:

```sh
git clone git@github.com:Cespuess/practica_backend_avanzado.git
```

#### <u> Crear fichero .env: </u>

1. Replicar el fichero `.env.example` y renombrarlo `.env`
2. Informar las siguientes claves:
   - `JWT_SECRET_KEY`: introducir una clave secreta cualquiera para la creación del JWT. Existen páginas web para generarlas como [randomkeygen](https://randomkeygen.com/)
   - `SECRET_SESSION` = Igual que el anterior, para firmar la cookie de session.
   - `URL_MONGODB` = Aquí debes indicar la URL de tu base de datos de MongoDB, o puedes dejarlo como está.

#### <u> Instalar dependencias: </u>

```sh
cd nodepop

npm install
```

#### <u> Inicializar la base de datos:</u>

> [!WARNING]
> El siguiente comando borra **TODA** la base de datos!!!

```sh
npm run init-db
```

Respondiendo `"si"` nos creará anuncios y usuarios para poder empezar a utilizar la aplicación.

Los usuarios creados son los siguiente:

- **email**: user@example.com **password**: 1234
- **email**: administrador@example.com **password**: 1234

## Desarrollo

Para ejecutar la aplicación en modo desarrollo utilizar:

```sh
npm run dev
```

## API

#### <u> Autenticarse en la API:</u>

- `GET /api/authenticate`

Para autenticarnos tendremos que indicar los siguiente campos en el body, con los datos de uno de los usuarios mencionados anteriormente:

1. `email`
2. `password`

```json
{
  "token": "eyJhbR5pXVCJ9.eyJ1cEwMDMyM30.atQ6E5AizFGMI"
}
```

> [!IMPORTANT]
> El token recibido tendrá que ser enviado en cada petición realizada a la API de una de las siguientes tres maneras:
>
> 1. En la cabecera **Authorization**
> 2. En el body de la solicitud con la clave **jwt**
> 3. Como parámetro en la query string **jwt=token**

El `token` solo tiene una hora de validez desde el momento de su emisión.

#### <u> Para consultar la lista completa:</u>

- `GET /api/anuncios`

```json
{
  "resultados": [
    {
      "_id": "6658c749acba22565cfacd3b",
      "nombre": "Mueble de madera",
      "venta": false,
      "precio": 949,
      "foto": "1717097445131-mueble_madera.jpg",
      "thumbFoto": "thumbnail-1717097445131-mueble_madera.jpg",
      "tags": ["lifestyle", "work"],
      "owner": "6658c749acba22565cfacd35",
      "__v": 0
    }
  ]
}
```

#### <u>Consultar con posibilidad de paginación y ordenación:</u>

- ` GET /api/anuncios?skip=2&limit=6&sort=precio`

Términos de paginación y ordenación:

- **skip**: Es la cantidad de anuncios que se ignoran al principio. Tiene que ser numérico.
- **limit**: Es la cantidad de anuncios que se mostrarán como máximo. Tiene que ser numérico.
- **sort**: Es el campo por el que se ordenarán los resultados. Los campos son: _\_id, nombre, venta, precio, foto, tags, owner y thumbFoto._

#### <u>Consultar por campos:</u>

- `GET /api/anuncios?venta=true`

Indicamos el campo con el valor que queramos buscar: _\_id, nombre, venta, precio y tags._

#### <u>Consultar por rangos de precio:</u>

- `GET /api/anuncios?precio_min=110&precio_max=600`

Si se especifica en la query el campo _precio_ junto con _precio_min_ y/o _precio_max_, se dará prioridad a la búsqueda por rango de precio. Los valores tendrán que ser de tipo numérico.

#### <u>Consultar por nombre:</u>

- `GET /api/anuncios?nombre=logi`

No hace falta especificar el nombre entero, solo escribir una parte que contenga el título del producto ya es suficiente.

#### <u>Consultar solo los campos seleccionados:</u>

- `GET /api/anuncios?fields=nombre%20-_id`

Con este ejemplo recibimos solo los nombres de los productos sin el \_id.

```json
{
  "resultados": [
    {
      "nombre": "Móvil OPPO A78"
    },
    {
      "nombre": "Móvil Iphone 13"
    }
  ]
}
```

#### <u> Consultar los tags disponibles:</u>

- `GET /api/anuncios/listatags`

Devuelve un array con los tags disponibles de los anuncios.

```json
{
  "resultado": ["work", "lifestyle", "motor", "mobile"]
}
```

#### <u>Crear un anuncio:</u>

- `POST /api/anuncios (body)`

El body de la solicitud debe enviarse como `form-data`, y la foto debe incluirse como un campo de tipo `file`.

Para crear un anuncio tendremos que enviar los campos requeridos:

1. `nombre:` tipo string.
2. `venta:` tipo booleano, **true** para indicar que se vende, **false** para indicar que se compra.
3. `precio:` tipo number.
4. `foto:`tipo string.
5. `tags:` tipo [string].

Body:

![Cración anuncio](./nodepop/public/assets/img/readme/crearAnuncio.png)

Respuesta:

```json
{
  "anuncioCreado": {
    "nombre": "Depósito Aceite",
    "venta": true,
    "precio": 235,
    "foto": "1717098611287-oil-tank.png",
    "tags": ["work", "motor"],
    "owner": "6658c749acba22565cfacd34",
    "_id": "6658d873cf030e4ee84ccfb2",
    "__v": 0
  }
}
```

#### <u>Eliminar un anuncio:</u>

- `DELETE /api/anuncios/<_id>`

Para eliminar un anuncio tendremos que indicar en la URL el \_id del anuncio a eliminar.

![Eliminación anuncio](./nodepop/public/assets/img/readme/eliminarAnuncio.png)

```json
{
  "productoEliminado": {
    "_id": "6658d873cf030e4ee84ccfb2",
    "nombre": "sdfsdffsdfsdfs",
    "venta": true,
    "precio": 1000,
    "foto": "1717098611287-oil-tank.png",
    "tags": ["motor"],
    "owner": "6658c749acba22565cfacd34",
    "__v": 0,
    "thumbFoto": "thumbnail-1717098611287-oil-tank.png"
  }
}
```

## WEBSITE

#### <u>Registrarse:</u>

Para poder tener acceso a los anuncios, tendremos que registrarnos con los datos de los usuarios creados inicialmente:

- **email**: user@example.com **password**: 1234
- **email**: administrador@example.com **password**: 1234

![Login](./nodepop/public/assets/img/readme/login.png)

#### <u>Diseño de la web:</u>

La página se divide en tres partes:

1. `Header`:
   - Nombre de la página **Nodepop**, que servirá de enlace para volver a la página principal donde se mostrarán los anuncios de todos los productos disponibles.
   - Las banderas de los idiomas en los que está disponible la página web, que servirán para cambiar el idioma cuando deseemos.
   - El enlace a a la página donde solo se mostrarán los anuncios de los cuales el usuario registrado es el propietario.
   - El botón para cerrar la sesión de usuario.
2. `Body`:

   - Parte donde se mostrará lo específico de cada página, tanto los **anuncios** como el formulario para el **Login**.

   - Los productos se muestran uno al lado de otro en el centro de la pantalla con el siguiente orden de información:

     1. La foto del producto.
     2. Nombre del producto.
     3. Si se busca o se vende.
     4. La categoría (tag).
     5. El precio.

3. `Footer`:
   - En él encontraremos un enlace a mi perfil de `LinkedIn`, os invito a visitarlo y a contactarme si estaríais interesados en colaborar o discutir posibles oportunidades profesionales.

![Diseño web](./nodepop/public/assets/img/readme/disenyo_web.png)

#### <u>Para consultar la lista completa de productos:</u>

- `GET /`

#### <u>Consultar con posibilidad de paginación y ordenación:</u>

- `GET /?skip=2&limit=6&sort=precio`

Términos de paginación y ordenación:

- **skip**: Es la cantidad de anuncios que se ignoran al principio. Tiene que ser numérico.
- **limit**: Es la cantidad de anuncios que se mostrarán como máximo. Tiene que ser numérico.
- **sort**: Es el campo por el que se ordenarán los resultados. Los campos son: _\_id, nombre, venta, precio, foto, tags, owner y thumbFoto._

#### <u>Consultar por campos:</u>

- `GET /?venta=true`

Indicamos el campo con el valor que queramos buscar: _\_id, nombre, venta, precio y tags._

#### <u>Consultar por rangos de precio:</u>

- `GET /?precio_min=110&precio_max=600`

Si se especifica en la query el campo _precio_ junto con _precio_min_ y/o _precio_max_, se dará prioridad a la búsqueda por rango de precio. Los valores tendrán que ser de tipo numérico.

#### <u>Consultar por nombre:</u>

- `GET /?nombre=logi`

No hace falta especificar el nombre entero, solo escribir una parte que contenga el título del producto ya es suficiente.

#### <u>Consultar solo los campos seleccionados:</u>

Esta opción no está disponible en la web, solo en la API.
