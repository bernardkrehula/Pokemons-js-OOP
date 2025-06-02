import { pokemons } from "./pokemonManager.js";
export const pokemonHtml = document.querySelector('.pokemons');

pokemonHtml.addEventListener('click', async (e) => {
    const pokemon = e.target.closest('li');

    if(pokemon){
        await pokemons.setActivePokemon(pokemon);
        const getPoke = await pokemons.getActivePokemon(pokemon);
        getPoke.displayPokemonAbilities(getPoke);
    }
});
