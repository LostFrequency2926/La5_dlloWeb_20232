document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");

    async function getPokemonDescription(id_pokemon){
        try{
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id_pokemon}`);
            console.log(`la petición a la api se completo correctamente con status: ${response.status}`);
            console.log(response.data['flavor_text_entries'][0]['flavor_text']);
            return await response.data['flavor_text_entries'][0]['flavor_text'];
        } catch(error){
            console.error(`fallo la petición a la api con error: ${error.message}`);
        }    
    }
    
    searchButton.addEventListener("click", async function () {
        const pokemonName = searchInput.value.toLowerCase();

            if (pokemonName) {
                try {
                    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                    const pokemonData = response.data;

                    //Cambio de clase y limpieza del container
                    // Obtén una referencia al elemento con la clase "container-pokebola".
                    const containerDinamico = document.getElementById("container-dinamico");

                    // Crea un nuevo elemento div con la clase "container-pokemon".
                    containerDinamico.classList.remove('container-pokebola')
                    containerDinamico.classList.add('container-pokemon');

                    // Elimina el contenido del elemento.
                    containerDinamico.innerHTML = '';

                    //Nombre
                    const nombre = pokemonData.name.toUpperCase();
                    const idPokemon = pokemonData.id;

                    let descripcionPokemon = await getPokemonDescription(idPokemon);
                    const descripcionPokemonLimpio = descripcionPokemon.replace(/\u200E/g, '');

                    console.log(idPokemon);
                    console.log(descripcionPokemonLimpio);

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

            } catch (error) {
                console.error("Error al buscar el Pokémon:", error);
                // Manejar errores aquí
            }
        } else {
            alert("Ingrese un nombre de Pokémon válido.");
        }
    });
});
