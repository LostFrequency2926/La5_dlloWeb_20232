document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");

    // Declarar containerDinamico en un ámbito superior para que sea accesible en todo el script.
    const containerDinamico = document.getElementById("container-dinamico");

    async function showPokemonDetails(pokemonName) {
        if (pokemonName) {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                const pokemonData = response.data;

                // Crea un nuevo elemento div con la clase "container-pokemon".
                containerDinamico.classList.remove('container-pokebola')
                containerDinamico.classList.add('container-pokemon');

                // Elimina el contenido del elemento.
                containerDinamico.innerHTML = '';

                //Nombre
                const nombre = pokemonData.name.toUpperCase();
                const idPokemon = pokemonData.id;

                let descripcionPokemon = await getPokemonDescription(idPokemon);
                const descripcionPokemonLimpio = descripcionPokemon['flavorText'].replace(/[^\w\s]/g, '');

                let pokemonEvolutions = await getEvolutions(descripcionPokemon['evolutionChain'])

                console.log(idPokemon);
                console.log(descripcionPokemonLimpio['flavorText']);
                console.log(`Esta es la url de la cadena de evolucion ya consumida ${descripcionPokemon['evolutionChain']}`)
                console.log(pokemonEvolutions)
                console.log(pokemonEvolutions.length)

                // Crea un nuevo elemento para mostrar el nombre.
                const nombrePokemonElement = document.createElement('div');
                nombrePokemonElement.classList.add('pokemon-name'); // Aplica la clase CSS
                nombrePokemonElement.textContent = nombre;

                // Agrega el elemento del nombre al contenedor dinámico.
                containerDinamico.appendChild(nombrePokemonElement);

                                    //imagen
                // Accede a la propiedad 'sprites' en la respuesta del API.
                const sprites = pokemonData.sprites;

                // Obtiene la URL de la imagen 'front_default'.
                const imageUrl = sprites.other['official-artwork'].front_default;

                // Crea una imagen para colocar en el nuevo contenedor.
                const pokemonImage = document.createElement('img');
                pokemonImage.src = imageUrl; // Asegúrate de que imageUrl contenga la URL de la imagen del Pokémon.
                pokemonImage.alt = 'Imagen del Pokémon';

                // Agrega la imagen al nuevo contenedor.
                containerDinamico.appendChild(pokemonImage); 


                const descripcionPokemonElement = document.createElement('div');
                descripcionPokemonElement.classList.add('stats'); // Aplica la clase CSS
                const descriptionList = document.createElement('p');
                descriptionList.innerHTML = `<strong>Description: </strong>${descripcionPokemonLimpio}`;
                descripcionPokemonElement.appendChild(descriptionList);
                containerDinamico.appendChild(descripcionPokemonElement);

            
                //Habilidades
                const habilidades = pokemonData.abilities;
                let habilidadesTexto = "";
                for (let i = 0; i < habilidades.length; i++) {
                    if (i > 0) {
                        habilidadesTexto += ", "; // Agrega una coma y un espacio si no es la primera habilidad.
                    }
                    habilidadesTexto += habilidades[i].ability.name;
                }   

                
                //Extraer los stats dek pokemon
                const stats = pokemonData.stats.reduce((result, stat) => {
                    result[stat.stat.name] = stat.base_stat;
                    return result;
                }, {});

                const pokemonHabilities = document.createElement('div');
                pokemonHabilities.classList.add('habilidades')
                const habilititiesList = document.createElement('p');
                habilititiesList.innerHTML = `<strong>Habilities: </strong>${habilidadesTexto}`
                pokemonHabilities.appendChild(habilititiesList)
                containerDinamico.appendChild(pokemonHabilities)

                const pokemonStatsList = document.createElement('div');
                pokemonStatsList.classList.add('stats');
                // Crear un elemento para mostrar los stats
                const pokemonStatsShow = document.createElement('p');
                let statsText = '<strong>Stats:</strong> ';
                // Iterar a través de los stats y agregarlos al texto
                for (const statName in stats) {
                    if (stats.hasOwnProperty(statName)) {
                        statsText += `${statName}: ${stats[statName]}, `;
                    }
                }
                // Elimina la coma final y establece el contenido HTML
                pokemonStatsShow.innerHTML = statsText.slice(0, -2); // Eliminar la coma final
                pokemonStatsList.appendChild(pokemonStatsShow)
                containerDinamico.appendChild(pokemonStatsList)
                
                console.log(stats);
                console.log(`nombre: ${nombre}`)
                console.log(`habilidades: ${habilidadesTexto}`)

                //Botones para las evoluciones 

                if (pokemonEvolutions.length > 1){
                    // Filtra los nombres de las evoluciones que no coincidan con el nombre actual
                    let evolucionesIzquierda = pokemonEvolutions.filter(evolutionName => evolutionName !== nombre);

                    // Obtén el índice del nombre actual en el arreglo (si existe)
                    const currentIndex = pokemonEvolutions.indexOf(nombre.toLowerCase());
                    console.log(`el pokemon ${nombre} esta en la posicion ${currentIndex}`)

                    // Divide las evoluciones en dos grupos: las que están a la izquierda y las que están a la derecha
                    evolucionesIzquierda = pokemonEvolutions.slice(0, currentIndex);
                    const evolucionesDerecha = pokemonEvolutions.slice(currentIndex + 1);

                    // Crear un elemento contenedor para los botones de evolución.
                    const evolutionButtonsContainer = document.createElement('div');
                    evolutionButtonsContainer.classList.add('evolution-buttons');

                    console.log(evolucionesIzquierda)
                    console.log(evolucionesDerecha)

                    // Agregar botones "Evolucionó de" si hay evoluciones a la izquierda
                    if (evolucionesIzquierda.length > 0) {
                        const evolutionFromButton = document.createElement('button');
                        evolutionFromButton.textContent = `Evolucionó de ${evolucionesIzquierda[evolucionesIzquierda.length - 1]}`;
                        evolutionFromButton.classList.add('evolution-button');

                        evolutionButtonsContainer.appendChild(evolutionFromButton);
                    }

                    // Agregar botones "Evoluciona a" si hay evoluciones a la derecha
                    if (evolucionesDerecha.length > 0) {
                        const evolutionToButton = document.createElement('button');
                        evolutionToButton.textContent = `Evoluciona a ${evolucionesDerecha[0]}`;
                        evolutionToButton.classList.add('evolution-button');

                        evolutionButtonsContainer.appendChild(evolutionToButton);
                    }

                    // Agregar el contenedor de botones de evolución al contenedor de Pokémon.
                    containerDinamico.appendChild(evolutionButtonsContainer);
                }


        } catch (error) {
            console.error("Error al buscar el Pokémon:", error);
            // Manejar errores aquí
        }
    }}

    async function getPokemonDescription(id_pokemon){
        try{
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id_pokemon}`);

            console.log(`La petición a la API se completó correctamente con status: ${response.status}`);
            console.log(response.data['flavor_text_entries'][0]['flavor_text']);
            console.log(`URL de la cadena de evolución: ${response.data['evolution_chain']['url']}`);
            
            const data = {
                flavorText: response.data['flavor_text_entries'][0]['flavor_text'],
                evolutionChain: response.data['evolution_chain']['url']
            };
            
            return data;
        } catch(error){
            console.error(`fallo la petición a la api con error: ${error.message}`);
        }    
    }

    async function getEvolutions(evolutionChainUrl) {
        try {
            const response = await axios.get(evolutionChainUrl);
            console.log(`La petición a la cadena de evolución se completó correctamente con status: ${response.status}`);
            
            const chainData = response.data.chain;
            const evolutions = [];
    
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
    
            extractEvolutions(chainData);
    
            return evolutions;
        } catch (error) {
            console.error(`Fallo la petición a la cadena de evolución con error: ${error.message}`);
        }
    }
    
    searchButton.addEventListener("click", async function () {
        const pokemonName = searchInput.value.toLowerCase();
        if (pokemonName) {
            await showPokemonDetails(pokemonName);
        } else {
            alert("Ingrese un nombre de Pokémon válido.");
        }
    });

    // Agregar un manejador de eventos para los botones de evolución
    containerDinamico.addEventListener("click", async function (event) {
        if (event.target.classList.contains("evolution-button")) {
            // Obtener el nombre del nuevo Pokémon desde el texto del botón
            const newPokemonName = event.target.textContent.split(" ").pop();

            // Mostrar los detalles del nuevo Pokémon
            await showPokemonDetails(newPokemonName);
        }
    });
})
