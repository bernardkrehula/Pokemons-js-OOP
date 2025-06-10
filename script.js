import { pokemons } from "./pokemonManager.js";

export const pokemonsHtml = document.querySelector('.pokemons');
const selector = document.querySelector('.selector');
const searchBar = document.querySelector('.searchBar');
const searchInput = document.querySelector('.searchBarInput');
const main = document.querySelector('.main');

searchBar.addEventListener('submit', (e) => {
        e.preventDefault();
        pokemons.getSearchedPokemon(searchInput.value)
        searchInput.value = '';
    });

pokemonsHtml.addEventListener('click', async(e) => {
    const pokemonId = e.target.closest('li').id;
    const pokemonElement = e.target.closest('li');
    if (pokemonId) {
        await pokemons.getActivePokemon(pokemonId);
        pokemons.toggleAbilities(pokemonId, pokemonElement);
    }
});
main.addEventListener('click', (e) => {
    const closeModal = e.target.closest('button');

    if(closeModal){
        closePokemonModal();
        pokemons.setActivePokemonToNull();
    }
})

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

function closePokemonModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('pokeContent').style.display = 'none';
}

pokemons.getPokemon();
pokemons.iterateThroughPokemons();
