import { pokemons } from "./pokemonManager.js";
export const pokemonsHtml = document.querySelector('.pokemons');
const selector = document.querySelector('.selector');

pokemonsHtml.addEventListener('click', async (e) => {
    const pokemon = e.target.closest('li');

    if(pokemon){
        const foundPokemon = pokemons.findActivePokemon(pokemon);
        pokemons.getActivePokemon(foundPokemon);
        pokemons.toggleAbilities(foundPokemon, pokemon);
    }
});

selector.addEventListener('change', (e) => {
    const option = e.target.value;
    
    pokemons.getSelectedPokemonData(option);

})

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