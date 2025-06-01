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
        <li>${pokemon.name}</li>
        `;
        pokemonHtml.insertAdjacentHTML('beforeend', html);
    }

} 


class PokemonsManager {
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
            console.log(pokemons)
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

//Height, abilities, weight, moves
}
const pokemons = new PokemonsManager();
pokemons.getPokemon();
pokemons.returnPokemons(); 
