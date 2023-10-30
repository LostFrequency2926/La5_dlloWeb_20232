//Esta funcion se usa para asegurarse que el JS se usara luego de que todo el codigo HTML se haya cargado
document.addEventListener("DOMContentLoaded", function () {
  // Definimos el boton de busqueda
  const searchButton = document.getElementById("searchButton");
  // DEfinimos el boton del popup de error
  const popupAcceptButton = document.getElementById("popup-accept-button");
  // Definimos el input que recibe el nombre del pokemon
  const searchInput = document.getElementById("searchInput");
  // texto e icono para ir al home
  const homeLink = document.getElementById("home-link");
  const homeText = document.getElementById("home-text");
  const homeContainer = document.getElementById("container-home");

  // Declaramos el container que se encargara de mostrar el contenido dinamico, se declara desde aca para que sea accesible desde cualquier funcion
  const containerDinamico = document.getElementById("container-dinamico");

  //Grupo de Pokemones actuales
  let incrementoPokemon = 1;

  let pokemonNamesGroup;
  // referencia al elemento .images
  const imagesContainer = document.querySelector(".images");
  // referencia al boton de siguiente y anterior
  const nextButton = document.getElementById("nextButton");
  const prevButton = document.getElementById("prevButton");
  prevButton.style.display = "none";

  nextPokemonGroup();

  async function nextPokemonGroup() {
    //VAlida la presencia del boton anterior
    if (incrementoPokemon > 1) {
      prevButton.style.display = "flex";
    }

    pokemonNamesGroup = [];
    let pokemonImgsGroup = [];
    const maxPokemonId = 1017; // El ID máximo actual de Pokémon encontrado a la fecha 28102023 es 1017 se amplía a 1022 para poder mostrar el último Pokémon

    // Verifica si hemos alcanzado el último Pokémon antes de borrar los elementos existentes
    console.log(
      "valor de incremento al dar click en siguiente " + incrementoPokemon
    );

    for (var i = 1; i < 6; i++) {
      console.log("valor de incremento al entrar al for " + incrementoPokemon);
      if (incrementoPokemon > maxPokemonId) {
        console.log("Se han agotado los Pokémon disponibles.");
        incrementoPokemon = 1013; // Reinicia el incremento al máximo
        nextButton.style.display = "none"; // Oculta el botón "Siguiente"
        nextPokemonGroup();
        break; // Sal del método si se han agotado los Pokémon disponibles
      }

      let pokemonData;

      try {
        // Extraemos el nombre de los 5 Pokémon del grupo actual
        pokemonData = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${incrementoPokemon}`
        );
        // Almacenamos esos nombres en un array
        pokemonNamesGroup.push(pokemonData.data.name);
      } catch (error) {
        console.log(error);
      }

      try {
        // Extraigo la URL con la imagen de cada Pokémon
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemonData.data.name}`
        );
        const imageUrl =
          response.data.sprites.other["official-artwork"].front_default;

        // Almaceno las URLs de las imágenes en un array
        pokemonImgsGroup.push(imageUrl);
      } catch (error) {
        console.log(error);
      }

      // Avanzo al siguiente Pokémon
      incrementoPokemon = incrementoPokemon + 1;
      console.log(incrementoPokemon);
    }

    console.log(pokemonNamesGroup);
    console.log(pokemonImgsGroup);

    // Verifica si hemos alcanzado el último Pokémon
    if (incrementoPokemon - 1 <= maxPokemonId) {
      console.log(pokemonNamesGroup);
      console.log(pokemonImgsGroup);

      // Agregar dinámicamente elementos img al DOM
      imagesContainer.innerHTML = "";
      pokemonImgsGroup.forEach((src, index) => {
        const imageElement = document.createElement("img");
        imageElement.id = `Imagen${index + 1}`;
        imageElement.src = src;
        imageElement.alt = `Imagen ${index + 1}`;

        // Agregar un controlador de eventos de clic a la imagen
        imageElement.addEventListener("click", () => {
          // Llama a una función cuando se hace clic en la imagen
          handleImageClick(index);
        });

        imagesContainer.appendChild(imageElement);
      });

      // Función que se llama cuando se hace clic en una imagen
      function handleImageClick(index) {
        // Aquí puedes realizar acciones basadas en el índice de la imagen
        console.log(`Se hizo clic en la imagen ${index + 1}`);
        console.log(pokemonNamesGroup[index]);
        showPokemonDetails(pokemonNamesGroup[index]);
      }
    }

    // Verifica si hemos alcanzado el último Pokémon después de agregar las imágenes
    if (incrementoPokemon > maxPokemonId) {
      nextButton.style.display = "none"; // Oculta el botón "Siguiente"
    }
  }

  async function prevPokemonGroup() {
    console.log(
      "valor de incremento porkemon al dar en previo " + incrementoPokemon
    );

    nextButton.style.display = "flex";

    if (incrementoPokemon - 10 >= 1) {
      incrementoPokemon = incrementoPokemon - 10;

      pokemonNamesGroup = [];
      let pokemonImgsGroup = [];
      const maxPokemonId = 1022; // El ID máximo actual de Pokémon encontrado a la fecha 28102023 es 1017 se amplia a 1022 para poder mostrar el ultimo pokemon

      for (var i = 1; i < 6; i++) {
        // Verifica si hemos alcanzado el último Pokémon
        if (incrementoPokemon > maxPokemonId) {
          console.log("Se han agotado los Pokémon disponibles.");
          break; // Sale del bucle si hemos alcanzado el límite
        }

        let pokemonData;

        try {
          //Extraemos el nombre de los 5 pokemones del grupo actual
          pokemonData = await axios.get(
            `https://pokeapi.co/api/v2/pokemon-species/${incrementoPokemon}`
          );
          //Almacenao esos nombres en un array
          pokemonNamesGroup.push(pokemonData.data.name);
        } catch (error) {
          console.log(error);
        }

        try {
          //Extraigo la url con la imagen de cada pokemon
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemonData.data.name}`
          );
          const imageUrl =
            response.data.sprites.other["official-artwork"].front_default;

          //Almaceno las urls de la imagenes en un array
          pokemonImgsGroup.push(imageUrl);
        } catch (error) {
          console.log(error);
        }

        //Avanzo al siguiente pokemon
        incrementoPokemon = incrementoPokemon + 1;
      }

      console.log(incrementoPokemon);
      // Verifica si hemos alcanzado el último Pokémon
      if (incrementoPokemon <= maxPokemonId) {
        console.log(pokemonNamesGroup);
        console.log(pokemonImgsGroup);

        // Agregar dinámicamente elementos img al DOM
        imagesContainer.innerHTML = "";
        pokemonImgsGroup.forEach((src, index) => {
          const imageElement = document.createElement("img");
          imageElement.id = `Imagen${index + 1}`;
          imageElement.src = src;
          imageElement.alt = `Imagen ${index + 1}`;

          // Agregar un controlador de eventos de clic a la imagen
          imageElement.addEventListener("click", () => {
            // Llama a una función cuando se hace clic en la imagen
            handleImageClick(index);
          });

          imagesContainer.appendChild(imageElement);
        });

        // Función que se llama cuando se hace clic en una imagen
        function handleImageClick(index) {
          // Aquí puedes realizar acciones basadas en el índice de la imagen
          console.log(`Se hizo clic en la imagen ${index + 1}`);
          console.log(pokemonNamesGroup[index]);
          showPokemonDetails(pokemonNamesGroup[index]);
        }

        console.log(incrementoPokemon);
      }
    } else {
      console.log("Se ha llegado al inicio de la lista de pokemons");
      incrementoPokemon = 1;
      prevButton.style.display = "none";
    }

    if (incrementoPokemon == 6) {
      console.log("valide condicion");
      incrementoPokemon = 1;
      nextPokemonGroup();
      prevButton.style.display = "none";
    }
  }

  //Funcion encargada de inicar la consulta principal y pintar en el containerDinamico el nombre, habilidades y estadisticas del pokemon, ademas
  //iniciara el consumo con la funcion getPokemonDescription para obtener la descripcion del pokemon y la cadena de evolucion
  async function showPokemonDetails(pokemonName) {
    if (pokemonName) {
      try {
        //se realiza el consumo de la API principal
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        const pokemonData = response.data;

        // Crea un nuevo elemento div con la clase "container-pokemon".
        containerDinamico.classList.remove("container-pokebola");
        containerDinamico.classList.add("container-pokemon");

        // Se elimina el contenido del elemento.
        containerDinamico.innerHTML = "";

        //Extraemos el nombre de la respuesta del API y lo ponemos en Mayuscula para que se vea mejor en el front
        const nombre = pokemonData.name.toUpperCase();
        //Extraemos el id de la respuesta del API, el cual sera usado para averiguar la descripcion y la cadena de evolucion
        const idPokemon = pokemonData.id;
        // Accede a la propiedad 'sprites' en la respuesta del API para luego extraer la imagen del pokemon,
        //en la exploracion encontre que la imagen mas bonita estaba en el objeto other y use de official-artwork la front_default
        //las demas tenian muy mala calidad
        const sprites = pokemonData.sprites;
        const imageUrl = sprites.other["official-artwork"].front_default;
        //Extraigo las habilidades del pokemon
        const habilidades = pokemonData.abilities;
        //Extraigo los stats dek pokemon, y uso la funcion reduce para poder extraer la informacion en un objeto
        const stats = pokemonData.stats.reduce((result, stat) => {
          result[stat.stat.name] = stat.base_stat;
          return result;
        }, {});
        //Extraigo el peso y alturta del pokemon
        const pokemonWeight = pokemonData.weight / 10;
        const pokemonHeight = pokemonData.height / 10;
        //Extraigo los tipos a los que pertenece el pokemon
        const typesPokemon = pokemonData.types.reduce((result, type) => {
          result[type.slot] = type.type.name;
          return result;
        }, {});

        //Con el id uso la funcion getPokemonDescription para poder extraer la descripcion del pokemon, encontre que hay tantas
        //descripciones como versiones de juegos asi que solo tome la prmer descripcion que encontrara
        let descripcionPokemon = await getPokemonDescription(idPokemon);
        //Elimino el caracter \f que estaba produciendo errores de visualizacion en el front
        const descripcionPokemonLimpio = descripcionPokemon[
          "flavorText"
        ].replace(/\f/g, "\n");
        //Tambien extraigo el 'gender_rate' para saber que sexos puede tener el pokemon segun la info oficial
        let genderPokemon = descripcionPokemon["genderRatio"];

        //Con el id uso la funcion getEvolutions para obtener la cade que me indicara en orden las evoluciones que tiene el pokemon
        let pokemonEvolutions = await getEvolutions(
          descripcionPokemon["evolutionChain"]
        );

        //depuracion necesaria para ir entendiendo y saber como manejar los datos que recibia
        console.log(idPokemon);
        console.log(descripcionPokemonLimpio["flavorText"]);
        console.log(
          `Esta es la url de la cadena de evolucion ya consumida ${descripcionPokemon["evolutionChain"]}`
        );
        console.log(pokemonEvolutions);
        console.log(pokemonEvolutions.length);
        console.log(`habilidades del pokemon ${habilidades}`);
        console.log(habilidades);
        console.log(`Peso del pokemon ${pokemonWeight}`);
        console.log(`Tipo pokemon ${typesPokemon}`);
        console.log(typesPokemon);
        console.log(`sexo pokemon front ${genderPokemon}`);
        console.log(genderPokemon);

        //NOMBRE
        // Crear un nuevo elemento para mostrar el nombre.
        const nombrePokemonElement = document.createElement("div");
        nombrePokemonElement.classList.add("pokemon-name"); // Aplica la clase CSS
        nombrePokemonElement.textContent = nombre;
        // Agrego el elemento del nombre al contenedor dinámico.
        containerDinamico.appendChild(nombrePokemonElement);

        //TIPOS
        let tiposTexto = "";
        const valoresTipos = Object.values(typesPokemon);

        for (let i = 0; i < valoresTipos.length; i++) {
          if (i > 0) {
            tiposTexto += ", ";
          }
          tiposTexto += valoresTipos[i];
        }

        // Crear un nuevo contenedor div para mostrar los detalles del Pokémon.
        const pokemonDetailsContainer = document.createElement("div");
        pokemonDetailsContainer.classList.add("pokemon-details");

        //IMAGEN
        // Creo una subcolumna para la imagen del Pokémon.
        const imageColumn = document.createElement("div");
        imageColumn.classList.add("pokemon-details-img");
        // Creo una imagen para la imagen del Pokémon.
        const pokemonImage = document.createElement("img");
        pokemonImage.src = imageUrl;
        pokemonImage.alt = "Imagen del Pokémon";
        // Agrega la imagen a la subcolumna de la imagen.
        imageColumn.appendChild(pokemonImage);

        //ALTURA, PESO, TIPO Y SEXOS
        // Crear una subcolumna para el peso y los tipos.
        const detailsColumn = document.createElement("div");
        detailsColumn.classList.add("pokemon-details-text");
        // Creo un elemento de párrafo para mostrar la altura.
        const heightText = document.createElement("p");
        heightText.textContent = `Height: ${pokemonHeight} m`;
        // Creo un elemento de párrafo para mostrar el peso.
        const weightText = document.createElement("p");
        weightText.textContent = `Weight: ${pokemonWeight} kg`;
        // Crea un elemento de párrafo para mostrar los tipos.
        const typesText = document.createElement("p");
        typesText.textContent = `Types: ${tiposTexto}`;
        // Agregar el peso y los tipos a la subcolumna de detalles.
        detailsColumn.appendChild(heightText);
        detailsColumn.appendChild(weightText);
        detailsColumn.appendChild(typesText);

        let genderIconSrc = "";
        if (genderPokemon === -1) {
          genderIconSrc = "imgs/no_gender.png"; //género indefinido.
        } else if (genderPokemon === 0) {
          genderIconSrc = "imgs/male_gender.png"; //masculino.
        } else if (genderPokemon === 8) {
          genderIconSrc = "imgs/female_gender.png"; //femenino.
        } else {
          genderIconSrc = "imgs/both_gender.png"; //ambos generos.
        }

        // Creo el elemento de imagen para mostrar el ícono de género.
        const genderIcon = document.createElement("img");
        genderIcon.src = genderIconSrc;
        genderIcon.alt = "Género del Pokémon";

        // Agregar el ícono de género al contenedor de detalles (detailsColumn).
        detailsColumn.appendChild(genderIcon);

        // Agregar las subcolumnas al contenedor de detalles.
        pokemonDetailsContainer.appendChild(imageColumn);
        pokemonDetailsContainer.appendChild(detailsColumn);
        // Agregar el contenedor de detalles al contenedor dinámico.
        containerDinamico.appendChild(pokemonDetailsContainer);
        // Determina el género del Pokémon basado en el campo "gender_rate".

        //DESCRIPCION
        const descripcionPokemonElement = document.createElement("div");
        descripcionPokemonElement.classList.add("pokemon-description"); // Aplica la clase CSS
        const descriptionList = document.createElement("p");
        descriptionList.innerHTML = `<strong>Description: </strong>${descripcionPokemonLimpio}`;
        descripcionPokemonElement.appendChild(descriptionList);
        // Agrego la descripcion al contenedor dinámico
        containerDinamico.appendChild(descripcionPokemonElement);

        //HABILIDADES
        //Formateo las habilidades para mostrarlas en el front
        let habilidadesTexto = "";
        for (let i = 0; i < habilidades.length; i++) {
          if (i > 0) {
            habilidadesTexto += ", ";
          }
          habilidadesTexto += habilidades[i].ability.name;
        }
        const pokemonHabilities = document.createElement("div");
        pokemonHabilities.classList.add("abilities");
        const habilititiesList = document.createElement("p");
        habilititiesList.innerHTML = `<strong>Abilities: </strong>${habilidadesTexto}`;
        pokemonHabilities.appendChild(habilititiesList);
        // Agrego las habilidades al contenedor dinámico
        containerDinamico.appendChild(pokemonHabilities);

        //STATS
        // Crear un elemento para mostrar los stats en forma de lista
        const containerStats = document.createElement("div");
        containerStats.classList.add("stats");
        const pokemonStatsList = document.createElement("ul");
        containerStats.appendChild(pokemonStatsList);
        // Iterar a través de los stats y agregarlos a la lista
        for (const statName in stats) {
          if (stats.hasOwnProperty(statName)) {
            const listItem = document.createElement("li");
            listItem.textContent = `${statName}: ${stats[statName]}`;
            pokemonStatsList.appendChild(listItem);
          }
        }
        // Agregar los stats al contenedor dinámico
        containerDinamico.appendChild(containerStats);

        //depuracion necesaria para ir entendiendo y saber como manejar los datos que recibia
        console.log(tiposTexto);
        console.log(stats);
        console.log(`nombre: ${nombre}`);
        console.log(`habilidades: ${habilidadesTexto}`);

        //BOTONES PARA LAS EVOLUCIONES
        //Primero evaluo si el pokemon tiene evolucion, validando si el arreglo de cadena de evoluciones tiene mas de un elemento
        if (pokemonEvolutions.length > 1) {
          // Filtra los nombres de las evoluciones que no coincidan con el nombre actual
          let evolucionesIzquierda = pokemonEvolutions.filter(
            (evolutionName) => evolutionName !== nombre
          );

          // Obtén el índice del nombre actual en el arreglo (si existe)
          const currentIndex = pokemonEvolutions.indexOf(nombre.toLowerCase());
          console.log(
            `el pokemon ${nombre} esta en la posicion ${currentIndex}`
          );

          // Divido las evoluciones en dos grupos: las que están a la izquierda y las que están a la derecha
          evolucionesIzquierda = pokemonEvolutions.slice(0, currentIndex);
          const evolucionesDerecha = pokemonEvolutions.slice(currentIndex + 1);

          // Crear un elemento contenedor para los botones de evolución.
          const evolutionButtonsContainer = document.createElement("div");
          evolutionButtonsContainer.classList.add("evolution-buttons");

          //depuracion necesaria para ir entendiendo y saber como manejar los datos que recibia
          console.log(evolucionesIzquierda);
          console.log(evolucionesDerecha);

          // Agregar un boton con el nombre del pokemon a la izquierda del pokemon actual en la cadena de evoluciones
          if (evolucionesIzquierda.length > 0) {
            const evolutionFromButton = document.createElement("button");
            evolutionFromButton.textContent = `Evolved from ${
              evolucionesIzquierda[evolucionesIzquierda.length - 1]
            }`;
            evolutionFromButton.classList.add("evolution-button");
            //Agrego el boton evoluciono de
            evolutionButtonsContainer.appendChild(evolutionFromButton);
          }

          // Agrega boton "Evoluciona a" si hay un elemento a la derecha del pokemon actual en la cadena de evolucion
          if (evolucionesDerecha.length > 0) {
            const evolutionToButton = document.createElement("button");
            evolutionToButton.textContent = `Evolves to ${evolucionesDerecha[0]}`;
            evolutionToButton.classList.add("evolution-button");
            //Agrego el boton evoluciona a
            evolutionButtonsContainer.appendChild(evolutionToButton);
          }

          // Agregar el contenedor de botones de evolución al contenedor de Pokémon.
          containerDinamico.appendChild(evolutionButtonsContainer);

          //Hago visible el boton home y su texto para ir a index
          homeLink.style.display = "flex";
          homeLink.style.alignItems = "center";
          homeText.style.display = "block";
          homeContainer.style.display = "flex";
          homeContainer.style.alignItems = "center";
          homeContainer.style.flexDirection = "column";
          homeContainer.style.textAlign = "center";
        }
      } catch (error) {
        // Manejo de errores
        console.error("Error when searching for the Pokémon:", error);

        // Mostrar el mensaje emergente
        const popup = document.getElementById("popup");
        const popupText = document.getElementById("popup-text");
        popupText.textContent =
          "Error searching for the Pokémon. Validate the name or try again later.";
        popup.style.display = "flex";
        popup.style.justifyContent = "space-between";

        const popupAcceptButton = document.getElementById("popup-accept");
        popupAcceptButton.addEventListener("click", function () {
          popup.style.display = "none";
        });
      }
    }
  }

  async function getPokemonDescription(id_pokemon) {
    try {
      // Consumo el API de species para obtener descripción y URL de cadena de evolución
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${id_pokemon}`
      );

      // Depuración necesaria para ir entendiendo y saber cómo manejar los datos que recibes
      console.log(
        `La petición a la API se completó correctamente con status: ${response.status}`
      );

      // Filtra el primer flavor text en inglés
      const flavorTextEntries = response.data["flavor_text_entries"];
      let englishFlavorText = "";
      for (const entry of flavorTextEntries) {
        if (entry.language.name === "en") {
          englishFlavorText = entry.flavor_text;
          break; // Al encontrar el primer entry en ingles, lo extraigo
        }
      }

      //depuracion necesaria para ir entendiendo y saber como manejar los datos que recibia
      console.log(`Flavor text en inglés: ${englishFlavorText}`);
      console.log(
        `URL de la cadena de evolución: ${response.data["evolution_chain"]["url"]}`
      );
      console.log(`Sexo pokemon: ${response.data["gender_rate"]}`);

      // Extraigo los datos de interés
      const data = {
        flavorText: englishFlavorText,
        evolutionChain: response.data["evolution_chain"]["url"],
        genderRatio: response.data["gender_rate"],
      };

      // Los retorno de la función
      return data;
    } catch (error) {
      //Mostrar error de campo vacio
      console.error(`fallo la petición a la api con error: ${error.message}`);

      // Mostrar el mensaje emergente
      const popup = document.getElementById("popup");
      const popupText = document.getElementById("popup-text");
      popupText.textContent =
        "An internal server error has occurred, try again later.";
      popup.style.display = "flex";
      popup.style.justifyContent = "space-between";

      const popupAcceptButton = document.getElementById("popup-accept");
      popupAcceptButton.addEventListener("click", function () {
        popup.style.display = "none";
      });
    }
  }

  async function getEvolutions(evolutionChainUrl) {
    try {
      //Consumo el API de de cadena de evolucion
      const response = await axios.get(evolutionChainUrl);

      //depuracion necesaria para ir entendiendo y saber como manejar los datos que recibia
      console.log(
        `La petición a la cadena de evolución se completó correctamente con status: ${response.status}`
      );

      //Extraer el arreglo con la cadena de evolucion
      const chainData = response.data.chain;
      const evolutions = [];

      //Funcion para extraer los nombres de los pokemons en orden de evolucion
      function extractEvolutions(chain) {
        if (chain.species && chain.species.name) {
          evolutions.push(chain.species.name);
        }
        if (chain.evolves_to && chain.evolves_to.length > 0) {
          chain.evolves_to.forEach((subchain) => {
            extractEvolutions(subchain);
          });
        }
      }

      //Ejecutamos la funcion
      extractEvolutions(chainData);

      //Retorno el arreglo con la lista ordenada de evolucion del pokemon
      return evolutions;
    } catch (error) {
      //Mostrar error de campo vacio
      console.error(`fallo la petición a la api con error: ${error.message}`);

      // Mostrar el mensaje emergente
      const popup = document.getElementById("popup");
      const popupText = document.getElementById("popup-text");
      popupText.textContent =
        "An internal server error has occurred, try again later.";
      popup.style.display = "flex";
      popup.style.justifyContent = "space-between";

      const popupAcceptButton = document.getElementById("popup-accept");
      popupAcceptButton.addEventListener("click", function () {
        popup.style.display = "none";
      });
    }
  }

  //Evento principal que desencadena todo el flujo inical
  searchButton.addEventListener("click", async function () {
    const pokemonName = searchInput.value.toLowerCase();
    //Validar si el usuario si ingreso el nombre de algun pokemon
    if (pokemonName) {
      //Funcion principal que desencadena la consulta de la APIs y seteo del container dinamico
      await showPokemonDetails(pokemonName);

      // Limpio el campo de entrada después de la búsqueda
      searchInput.value = "";
    } else {
      //Mostrar error de campo vacio
      console.error("Campo vacio");

      // Mostrar el mensaje emergente
      const popup = document.getElementById("popup");
      const popupText = document.getElementById("popup-text");
      popupText.textContent = "Enter a valid Pokémon name.";
      popup.style.display = "flex";
      popup.style.justifyContent = "space-between";

      const popupAcceptButton = document.getElementById("popup-accept");
      popupAcceptButton.addEventListener("click", function () {
        popup.style.display = "none";
      });
    }
  });

  //Listener para menjar el evento de click en los botones de evolucion para los pokemons que aplica
  containerDinamico.addEventListener("click", async function (event) {
    if (event.target.classList.contains("evolution-button")) {
      // Obtener el nombre del nuevo Pokémon desde el texto del botón
      const newPokemonName = event.target.textContent.split(" ").pop();

      // //Funcion principal que desencadena la consulta de la APIs y seteo del container dinamico
      await showPokemonDetails(newPokemonName);

      // Limpio el campo de entrada después de la búsqueda
      searchInput.value = "";
    }
  });

  // Capruto el evento de enter para que tambien accione el boton search
  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      // Si se presiona "Enter", realiza la acción del botón de búsqueda
      searchButton.click();
    }
  });

  //Avanzar en la vista de los pokemon
  nextButton.addEventListener("click", async function () {
    nextPokemonGroup();
  });

  //Retroceder en la vista de los pokemon
  prevButton.addEventListener("click", async function () {
    prevPokemonGroup();
  });
});
