import { pokemons } from "./pokemonManager.js";
export const pokemonsHtml = document.querySelector('.pokemons');

pokemonsHtml.addEventListener('click', async (e) => {
    const pokemon = e.target.closest('li');

    if(pokemon){
        const foundPokemon = pokemons.findActivePokemon(pokemon);
        pokemons.getActivePokemon(foundPokemon);
        pokemons.toggleAbilities(foundPokemon, pokemon);
    }
});
