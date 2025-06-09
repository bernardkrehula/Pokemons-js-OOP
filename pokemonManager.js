import { pokemonsHtml } from "./script.js";
import { showPokemonModal } from "./script.js";

class PokemonsManager {
    constructor(){
        this.pokemons = null;
        this.pokemonDetails = null;
        this.activePokemon = null;
    }
    getPokemon = async () => {
        try {        
            const pokemonDataFetch = await fetch(`https://pokeapi.co/api/v2/pokemon`);
            method: 'GET'
            headers: {
                    Accept: 'application/json'
                }
            const pokemonData = await pokemonDataFetch.json();
            
            this.setPokemons(pokemonData.results);
            return this.pokemons;
        }
        catch(error){
            console.log(error);
        }
    }
    getPokemonsData = async () =>{
        try {
            this.pokemonDetails = await Promise.all(this.pokemons.map(async pokemon => {
                    const getEachPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
                    method: 'GET'
                        headers: {
                        Accept: 'application/json'
                    }
                    return getEachPoke.json();
                }))
            return this.pokemonDetails;
        }
        catch(error){
            console.log(error)
        }
    }
    getSelectedPokemonData = async (option) =>{
       try {
            const pokes = await Promise.all(
            this.pokemons.map(async pokemon => {
                const getEachPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
                 method: 'GET'
                    headers: {
                    Accept: 'application/json'
                }
                return getEachPoke.json();
               
            })
            )
            
            this.filterPokemonsOnClick(option, pokes);
        }
        catch(error){
            console.log(error)
        }
    }
    setPokemons(pokeList){
        this.pokemons = pokeList;
    }
    filterPokemonsOnSearch(value){
        this.activePokemon = this.pokemonDetails.filter(pokemon => pokemon.name.match(value));
    }
    iterateThroughSearchedPokemons(){
        pokemonsHtml.innerHTML = '';
        this.activePokemon.forEach(pokemon => {
            this.displayPokemon(pokemon);
        })
    }
    findActivePokemon(pokeName){
        return this.pokemons.find(pokemon => pokemon.name === pokeName.id);
    }
    getActivePokemon = async (foundPokemon) => {
        const pokemonDataFetch = await fetch(`https://pokeapi.co/api/v2/pokemon/${foundPokemon.name}`);
        method: 'GET'
        headers: {
                Accept: 'application/json'
        }
        const pokemonData = await pokemonDataFetch.json();
        return this.activePokemon = pokemonData;
    }
    filterPokemonsOnClick(option, pokes)  {
        pokemonsHtml.innerHTML = '';
        pokes.forEach(poke => {
            const filteredPoke = poke.types.some(pokemon => pokemon.type.name === option.toLowerCase());
            if(filteredPoke){
                this.activePokemon = poke;
                this.displayPokemon(poke);
            }
        })
    }
    displayPokemon(pokemon){
        const html = `
            <li class='pokemon' id=${pokemon.name}>
                <img src='${pokemon.sprites.front_default}'>
                <h2>${pokemon.name}</h2>
            </li>
        `;
        pokemonsHtml.insertAdjacentHTML('beforeend', html);
    }
    iterateThroughPokemons = async () => {
        await this.getPokemon();
        await this.getPokemonsData();
        this.pokemonDetails.forEach(pokemon => {
            this.displayPokemon(pokemon);
        })
    }
    displayActivePokemon = async (pokemon) => {
       await this.getActivePokemon(pokemon);
        const ability = this.activePokemon.abilities.map(ability => ability.ability.name);
        const html = `
            <div class='type'>
                <h3 style='text-transform: uppercase;'>${pokemon.name}</h3>
                <h3>Height: ${this.activePokemon.height}</h3>
                <h3>Abilities: ${ability.join(', ')}</h3>
                <h3>Weight: ${this.activePokemon.weight}</h3>
            </div>
        `;
        showPokemonModal(html);
    }
    removeAbilities(pokemonHTML){
        const abilities = pokemonHTML.querySelector('div');
        if(abilities){
            abilities.remove();
        }
    }
    toggleAbilities(pokemon, pokemonHTML) {
        const existingAbilities = pokemonHTML.querySelector('div');
        if (existingAbilities) {
            this.removeAbilities(pokemonHTML);
        } else {
            this.displayActivePokemon(pokemon, pokemonHTML);
        }
    }

}
export const pokemons = new PokemonsManager();
pokemons.getPokemon();
pokemons.iterateThroughPokemons();