import { pokemons } from "./pokemonManager.js";

export const pokemonsHtml = document.querySelector('.pokemons');
const selector = document.querySelector('.selector');
const searchBar = document.querySelector('.searchBar');
const searchInput = document.querySelector('.searchBarInput');

searchBar.addEventListener('submit', (e) => {
        e.preventDefault();
/*     pokemons.filterPokemonsOnSearch(searchInput.value);
 */    
        pokemons.getSearchedPokemon(searchInput.value)
/*     pokemons.iterateThroughSearchedPokemons();
 */});

searchBar.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
        pokemons.filterPokemonsOnSearch(searchInput.value);
        pokemons.iterateThroughSearchedPokemons();
    }
});

pokemonsHtml.addEventListener('click', async (e) => {
    const pokemonElement = e.target.closest('li');
    if (pokemonElement) {
        const foundPokemon = pokemons.findActivePokemon(pokemonElement);
        await pokemons.getActivePokemon(foundPokemon);
        pokemons.toggleAbilities(foundPokemon, pokemonElement);
    }
});

selector.addEventListener('change', async (e) => {
    const selectedType = e.target.value.toLowerCase();
    await pokemons.getPokemonsByType(selectedType);
});

export function showPokemonModal(htmlContent) {
    const overlay = document.getElementById('overlay');
    const pokeContent = document.getElementById('pokeContent');
    pokeContent.innerHTML = htmlContent;
    overlay.style.display = 'block';
    pokeContent.style.display = 'block';
}

export function closePokemonModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('pokeContent').style.display = 'none';
}

document.getElementById('overlay').addEventListener('click', closePokemonModal);

pokemons.getPokemon();
pokemons.iterateThroughPokemons();
