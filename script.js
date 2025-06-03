import { pokemons } from "./pokemonManager.js";
export const pokemonHtml = document.querySelector('.pokemons');

pokemonHtml.addEventListener('click', async (e) => {
    const pokemon = e.target.closest('li');

    if(pokemon){
        const getPoke = await pokemons.getPokemon();
        pokemons.setPokemons(getPoke);
        const foundPokemon = pokemons.findActivePokemon(pokemon);
        pokemons.getActivePokemon(foundPokemon);
    }
});
