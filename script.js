//Esta funcion se usa para asegurarse que el JS se usara luego de que todo el codigo HTML se haya cargado
document.addEventListener("DOMContentLoaded", function () {

    // Definimos el boton de busqueda
    const searchButton = document.getElementById("searchButton");
    // DEfinimos el boton del popup de error
    const popupAcceptButton = document.getElementById('popup-accept-button');
    // Definimos el input que recibe el nombre del pokemon
    const searchInput = document.getElementById("searchInput");
    // texto e icono para ir al home
    const homeLink = document.getElementById('home-link');
    const homeText = document.getElementById('home-text');
    const homeContainer = document.getElementById('container-home')

    // Declaramos el container que se encargara de mostrar el contenido dinamico, se declara desde aca para que sea accesible desde cualquier funcion
    const containerDinamico = document.getElementById("container-dinamico");

    //Funcion encargada de inicar la consulta principal y pintar en el containerDinamico el nombre, habilidades y estadisticas del pokemon, ademas
    //iniciara el consumo con la funcion getPokemonDescription para obtener la descripcion del pokemon y la cadena de evolucion
    async function showPokemonDetails(pokemonName) {
        if (pokemonName) {
            try {
                //se realiza el consumo de la API principal
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                const pokemonData = response.data;

                // Crea un nuevo elemento div con la clase "container-pokemon".
                containerDinamico.classList.remove('container-pokebola')
                containerDinamico.classList.add('container-pokemon');

                // Se elimina el contenido del elemento.
                containerDinamico.innerHTML = '';

                //Extraemos el nombre de la respuesta del API y lo ponemos en Mayuscula para que se vea mejor en el front
                const nombre = pokemonData.name.toUpperCase();
                //Extraemos el id de la respuesta del API, el cual sera usado para averiguar la descripcion y la cadena de evolucion
                const idPokemon = pokemonData.id;
                // Accede a la propiedad 'sprites' en la respuesta del API para luego extraer la imagen del pokemon,
                //en la exploracion encontre que la imagen mas bonita estaba en el objeto other y use de official-artwork la front_default
                //las demas tenian muy mala calidad
                const sprites = pokemonData.sprites;
                const imageUrl = sprites.other['official-artwork'].front_default;
                //Extraigo las habilidades del pokemon
                const habilidades = pokemonData.abilities;
                //Extraigo los stats dek pokemon, y uso la funcion reduce para poder extraer la informacion en un objeto
                const stats = pokemonData.stats.reduce((result, stat) => {
                    result[stat.stat.name] = stat.base_stat;
                    return result;
                }, {});
                
                //Con el id uso la funcion getPokemonDescription para poder extraer la descripcion del pokemon, encontre que hay tantas
                //descripciones como versiones de juegos asi que solo tome la prmer descripcion que encontrara
                let descripcionPokemon = await getPokemonDescription(idPokemon);
                const descripcionPokemonLimpio = descripcionPokemon['flavorText'].replace(/[^\w\s]/g, '');

                //Con el id uso la funcion getEvolutions para obtener la cade que me indicara en orden las evoluciones que tiene el pokemon
                let pokemonEvolutions = await getEvolutions(descripcionPokemon['evolutionChain'])
                
                //depuracion necesaria para ir entendiendo y saber como manejar los datos que recibia 
                console.log(idPokemon);
                console.log(descripcionPokemonLimpio['flavorText']);
                console.log(`Esta es la url de la cadena de evolucion ya consumida ${descripcionPokemon['evolutionChain']}`)
                console.log(pokemonEvolutions)
                console.log(pokemonEvolutions.length)

                //NOMBRE
                // Crear un nuevo elemento para mostrar el nombre.
                const nombrePokemonElement = document.createElement('div');
                nombrePokemonElement.classList.add('pokemon-name'); // Aplica la clase CSS
                nombrePokemonElement.textContent = nombre;
                // Agrego el elemento del nombre al contenedor dinámico.
                containerDinamico.appendChild(nombrePokemonElement);

                //IMAGEN
                // Crea una imagen para colocar en el nuevo contenedor.
                const pokemonImage = document.createElement('img');
                pokemonImage.src = imageUrl; // Asegúrate de que imageUrl contenga la URL de la imagen del Pokémon.
                pokemonImage.alt = 'Imagen del Pokémon';
                // Agrego la imagen al nuevo contenedor.
                containerDinamico.appendChild(pokemonImage); 

                //DESCRIPCION
                const descripcionPokemonElement = document.createElement('div');
                descripcionPokemonElement.classList.add('stats'); // Aplica la clase CSS
                const descriptionList = document.createElement('p');
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
                const pokemonHabilities = document.createElement('div');
                pokemonHabilities.classList.add('habilidades')
                const habilititiesList = document.createElement('p');
                habilititiesList.innerHTML = `<strong>Abilities: </strong>${habilidadesTexto}`
                pokemonHabilities.appendChild(habilititiesList)
                // Agrego las habilidades al contenedor dinámico
                containerDinamico.appendChild(pokemonHabilities)

                //STATS
                const pokemonStatsList = document.createElement('div');
                pokemonStatsList.classList.add('stats');
                // Crear un elemento para mostrar los stats
                const pokemonStatsShow = document.createElement('p');
                let statsText = '';
                // Iterar a través de los stats y agregarlos al texto
                for (const statName in stats) {
                    if (stats.hasOwnProperty(statName)) {
                        statsText += `${statName}: ${stats[statName]} __ `;
                    }
                }
                // Elimina la coma final y establece el contenido HTML
                pokemonStatsShow.innerHTML = statsText.slice(0, -3);
                pokemonStatsList.appendChild(pokemonStatsShow)
                // Agrego los stats al contenedor dinámico
                containerDinamico.appendChild(pokemonStatsList)

                //depuracion necesaria para ir entendiendo y saber como manejar los datos que recibia 
                console.log(stats);
                console.log(`nombre: ${nombre}`)
                console.log(`habilidades: ${habilidadesTexto}`)

                //BOTONES PARA LAS EVOLUCIONES
                //Primero evaluo si el pokemon tiene evolucion, validando si el arreglo de cadena de evoluciones tiene mas de un elemento
                if (pokemonEvolutions.length > 1){
                    // Filtra los nombres de las evoluciones que no coincidan con el nombre actual
                    let evolucionesIzquierda = pokemonEvolutions.filter(evolutionName => evolutionName !== nombre);

                    // Obtén el índice del nombre actual en el arreglo (si existe)
                    const currentIndex = pokemonEvolutions.indexOf(nombre.toLowerCase());
                    console.log(`el pokemon ${nombre} esta en la posicion ${currentIndex}`)

                    // Divido las evoluciones en dos grupos: las que están a la izquierda y las que están a la derecha
                    evolucionesIzquierda = pokemonEvolutions.slice(0, currentIndex);
                    const evolucionesDerecha = pokemonEvolutions.slice(currentIndex + 1);

                    // Crear un elemento contenedor para los botones de evolución.
                    const evolutionButtonsContainer = document.createElement('div');
                    evolutionButtonsContainer.classList.add('evolution-buttons');
                    
                    //depuracion necesaria para ir entendiendo y saber como manejar los datos que recibia
                    console.log(evolucionesIzquierda)
                    console.log(evolucionesDerecha)

                    // Agregar un boton con el nombre del pokemon a la izquierda del pokemon actual en la cadena de evoluciones
                    if (evolucionesIzquierda.length > 0) {
                        const evolutionFromButton = document.createElement('button');
                        evolutionFromButton.textContent = `Evolucionó de ${evolucionesIzquierda[evolucionesIzquierda.length - 1]}`;
                        evolutionFromButton.classList.add('evolution-button');
                        //Agrego el boton evoluciono de 
                        evolutionButtonsContainer.appendChild(evolutionFromButton);
                    }

                    // Agrega boton "Evoluciona a" si hay un elemento a la derecha del pokemon actual en la cadena de evolucion
                    if (evolucionesDerecha.length > 0) {
                        const evolutionToButton = document.createElement('button');
                        evolutionToButton.textContent = `Evoluciona a ${evolucionesDerecha[0]}`;
                        evolutionToButton.classList.add('evolution-button');
                        //Agrego el boton evoluciona a 
                        evolutionButtonsContainer.appendChild(evolutionToButton);
                    }

                    // Agregar el contenedor de botones de evolución al contenedor de Pokémon.
                    containerDinamico.appendChild(evolutionButtonsContainer);
                    
                    //Hago visible el boton home y su texto para ir a index
                    homeLink.style.display = 'flex';
                    homeLink.style.alignItems = 'center'
                    homeText.style.display = 'block';
                    homeContainer.style.display = 'flex';
                    homeContainer.style.alignItems = 'center';
                    homeContainer.style.flexDirection = 'column';
                    homeContainer.style.textAlign = 'center';

                }
        } catch (error) {
            // Manejo de errores
            console.error("Error al buscar el Pokémon:", error);

            // Mostrar el mensaje emergente
            const popup = document.getElementById('popup');
            const popupText = document.getElementById('popup-text');
            popupText.textContent = 'Error al buscar el Pokémon. Valida el nombre o intenta de nuevo mas tarde.';
            popup.style.display = 'flex';
            popup.style.justifyContent = 'space-between'

            const popupAcceptButton = document.getElementById('popup-accept');
            popupAcceptButton.addEventListener('click', function() {
                popup.style.display = 'none';
            });
            
        }
    }}

    async function getPokemonDescription(id_pokemon){
        try{
            //Consumo el API de species para obtener descripcion y url de cadena de evolucion
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id_pokemon}`);
            
            //depuracion necesaria para ir entendiendo y saber como manejar los datos que recibia 
            console.log(`La petición a la API se completó correctamente con status: ${response.status}`);
            console.log(response.data['flavor_text_entries'][0]['flavor_text']);
            console.log(`URL de la cadena de evolución: ${response.data['evolution_chain']['url']}`);
            
            //Extraigo los datos de interes
            const data = {
                flavorText: response.data['flavor_text_entries'][0]['flavor_text'],
                evolutionChain: response.data['evolution_chain']['url']
            };
            
            //Los retorno de la funcion
            return data;

        } catch(error){

            //Mostrar error de campo vacio
            console.error(`fallo la petición a la api con error: ${error.message}`);

            // Mostrar el mensaje emergente
            const popup = document.getElementById('popup');
            const popupText = document.getElementById('popup-text');
            popupText.textContent = 'Se ha producido un error interno del servidor, intentar mas tarde.';
            popup.style.display = 'flex';
            popup.style.justifyContent = 'space-between'

            const popupAcceptButton = document.getElementById('popup-accept');
            popupAcceptButton.addEventListener('click', function() {
                popup.style.display = 'none';
            });
        }    
    }

    async function getEvolutions(evolutionChainUrl) {
        try {
            //Consumo el API de de cadena de evolucion
            const response = await axios.get(evolutionChainUrl);

            //depuracion necesaria para ir entendiendo y saber como manejar los datos que recibia 
            console.log(`La petición a la cadena de evolución se completó correctamente con status: ${response.status}`);
            
            //Extraer el arreglo con la cadena de evolucion
            const chainData = response.data.chain;
            const evolutions = [];
            
            //Funcion para extraer los nombres de los pokemons en orden de evolucion
            function extractEvolutions(chain) {
                if (chain.species && chain.species.name) {
                    evolutions.push(chain.species.name);
                }
                if (chain.evolves_to && chain.evolves_to.length > 0) {
                    chain.evolves_to.forEach(subchain => {
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
            const popup = document.getElementById('popup');
            const popupText = document.getElementById('popup-text');
            popupText.textContent = 'Se ha producido un error interno del servidor, intentar mas tarde.';
            popup.style.display = 'flex';
            popup.style.justifyContent = 'space-between'

            const popupAcceptButton = document.getElementById('popup-accept');
            popupAcceptButton.addEventListener('click', function() {
                popup.style.display = 'none';
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
        } else {
            //Mostrar error de campo vacio
            console.error("Campo vacio");

            // Mostrar el mensaje emergente
            const popup = document.getElementById('popup');
            const popupText = document.getElementById('popup-text');
            popupText.textContent = 'Ingrese un nombre de Pokémon valido.';
            popup.style.display = 'flex';
            popup.style.justifyContent = 'space-between'

            const popupAcceptButton = document.getElementById('popup-accept');
            popupAcceptButton.addEventListener('click', function() {
                popup.style.display = 'none';
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
        }
    });

})