import { pokemons } from "./pokemonManager.js";

export const pokemonsHtml = document.querySelector('.pokemons');
const selector = document.querySelector('.selector');
const searchBar = document.querySelector('.searchBar');
const searchInput = document.querySelector('.searchBarInput');
const main = document.querySelector('.main');

function debounce(func, delay){
    let timeoutId;

    return function(...args){
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}
function handleInput(e){
    console.log('Pretraga', e.target.value);
    pokemons.getSearchedPokemon(searchInput.value)
    searchInput.value = '';
}

const debounceHandleInput = debounce(handleInput, 1000);

searchInput.addEventListener('input', debounceHandleInput)



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
