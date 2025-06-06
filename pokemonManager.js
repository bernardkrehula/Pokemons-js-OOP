import { pokemonsHtml } from "./script.js";


class PokemonsManager {
    constructor(){
        this.pokemons = null;
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
    
        }
        catch(error){
            console.log(error);
        }
    }
    getPokemonsType = async () =>{
        try {
            const pokemonDetailsFetch = await fetch(`https://pokeapi.co/api/v2/pokemon`);
            method: 'GET'
            headers: {
                Accept: 'application/json'
            }
            const pokemonDetails = await pokemonDetailsFetch.json();

            this.activePokemon = [];

            this.activePokemon = await Promise.all(
            pokemonDetails.results.map(async result => {
                const getEachPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${result.name}`)
                 method: 'GET'
                    headers: {
                    Accept: 'application/json'
                }
                return getEachPoke.json();
            })
            )
            return this.activePokemon;
        }
        catch(error){
            console.log(error)
        }
    }
    setPokemons(pokeList){
        this.pokemons = pokeList;
    }
    findActivePokemon(pokeName){
        return this.pokemons.find(pokemon => pokemon.name === pokeName.className);
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
    filterPokemons = async (option) => {
        try {
            await this.getPokemonsType();

            await Promise.all(this.activePokemon);

            this.activePokemon = this.activePokemon.filter(pokemon => 
                pokemon.types.some(typeObj => 
                    typeObj.type.name.toLowerCase() === option.toLowerCase()
            )
        );

        pokemonsHtml.innerHTML = '';
        
        this.activePokemon.forEach(pokemon => {
            this.displayPokemon(pokemon);
        })
    } catch (error) {
        console.error('Error:', error);
    }
    }
    displayPokemon(pokemon){
        const html = `
            <li class='pokemon'>
                <img src='${pokemon.sprites.front_default}'>
                <h2>${pokemon.name}</h2>
            </li>
        `;
        pokemonsHtml.insertAdjacentHTML('beforeend', html);
    }
    iterateThroughPokemons = async () => {
        await this.getPokemon();
        await this.getPokemonsType();
        this.activePokemon.forEach(pokemon => {
            this.displayPokemon(pokemon);
        })
    }
    displayActivePokemon = async (pokemon, pokeHTML) => {
        await this.getActivePokemon(pokemon);
        const ability = this.activePokemon.abilities.map(ability => ability.ability.name);
        const html = `
            <div class='type'>
                <h3>Height: ${this.activePokemon.height}</h3>
                <h3>Abilities: ${ability}</h3>
                <h3>Weight: ${this.activePokemon.weight}</h3>
            </div>
        `;
        pokeHTML.insertAdjacentHTML('beforeend', html);
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
    //vatra, voda, trava, bug, normal,

//Height, abilities, weight
}
export const pokemons = new PokemonsManager();
pokemons.getPokemon();
pokemons.iterateThroughPokemons();
//Napravi u pokemon manager polje pokemons = []
//Napravi metodu setPokemons 
//SetPokemons koristis kad god ti zahjetv ka serveru vraca array (tj na pocetak na pocekat ti vraca array i kad sortiras za vatru vodu...)
//Klasa pokemon mi ni netreba sve u pokemons manager