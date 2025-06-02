import { pokemonHtml } from "./script.js";

class Pokemon{
    constructor(name, height, abilities, weight, moves){
        this.name = name;
        this.height = height;
        this.abilities = abilities;
        this.weight = weight;
        this.moves = moves;
    }
    displayPokemon(pokemon){
        const html = `
        <li class='${pokemon.name}'>${pokemon.name}</li>
        `;
        pokemonHtml.insertAdjacentHTML('beforeend', html);
    }
    displayPokemonAbilities(pokemon, pokemonHTML){
        const html = `
        <div></div>
        `;
        pokemonHTML.insertAdjacentHTML('beforeend', html);
        console.log('radi')
    }
} 


class PokemonsManager {
    constructor(){
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

            const pokemons = await Promise.all(
                pokemonData.results.map(async pokemon => {
                    const response = await fetch(pokemon.url);
                    const data = await response.json();

                    return new Pokemon(
                        data.name,
                        data.height,
                        data.abilities.map(abilities => abilities.ability.name),
                        data.weight,
                        data.moves.map(moves => moves.move.name)
                    );
            })
            )
            return pokemons;
        }
        catch(error){
            console.log(error);
        }
    }
    returnPokemons = async () => {
        const pokemonsList = await this.getPokemon();
        pokemonsList.forEach(pokemon => pokemon.displayPokemon(pokemon));
    }
    setActivePokemon = async (pokemon) =>{
        const findPokemon = await this.getPokemon();
        if(pokemon) {
            const foundPokemon = findPokemon.find(pokemons => pokemons.name == pokemon.className);
            this.activePokemon = foundPokemon;
        }
    }
    getActivePokemon = async (pokemon) => {
        return this.activePokemon;
    }

//Height, abilities, weight, moves
}
export const pokemons = new PokemonsManager();
pokemons.getPokemon();
pokemons.returnPokemons(); 
