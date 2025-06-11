import { pokemonsHtml, showPokemonModal } from "./script.js";

export class PokemonsManager {
    constructor() {
        this.pokemons = null;
        this.activePokemon = [];
        this.allPokemons = [];
    }

    getPokemon = async () => {
        try {
            const data = await this.fetchPokemon('?limit=40');
            this.setPokemons(data.results);
            this.pokemons = await Promise.all(this.pokemons.map(async pokemon => {
                const pokeData = await this.fetchPokemon(pokemon.name);
                pokemon.img = pokeData.sprites.front_default;
                pokemon.id = pokeData.id;
                return pokemon;
            }));
            return this.pokemons;
        } catch (error) {
            console.log(error);
        }
    }
    fetchPokemon = async(pokemon) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        return response.json();
    }
    getPokemonsByType = async (type) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
            const data = await response.json();
            const limitedPokemons = data.pokemon.slice(0, 20).map(p => p.pokemon);
            const pokesDetails = await Promise.all(limitedPokemons.map(async poke => {
                const res = await fetch(poke.url);
                const getPoke = await res.json();
                poke.img = getPoke.sprites.front_default;
                poke.id = getPoke.id;
                return poke;
            }));
            
            this.activePokemon = pokesDetails;
            this.iterateThroughSearchedPokemons();
        } catch (error) {
            console.log(error);
        }
    }
    getSearchedPokemon = async(pokemon) =>{
        try{ 
            const pokeData = await this.fetchPokemon(pokemon);
            pokemonsHtml.innerHTML = '';
            const searchedPoke = {
                name: pokeData.name,
                id: pokeData.id,
                img: pokeData.sprites.front_default
            };
            this.activePokemon = searchedPoke;
            this.displayPokemon(this.activePokemon);
        
        }
        catch(error){
            console.log(error)
        }
    }
    getActivePokemon = async (pokemonId) => {
            try {
                const data = await this.fetchPokemon(pokemonId);
                const pokemon = {
                    name: data.name,
                    height: data.height,
                    abilities: data.abilities,
                    weight: data.weight
                }
                this.activePokemon = pokemon;
                this.displayActivePokemon();
            } catch (error) {
                console.log(error);
            }
        }
    displayFilteredPokemons = (pokemonsArray) => {
        pokemonsHtml.innerHTML = '';
        pokemonsArray.forEach(pokemon => this.displayPokemon(pokemon));
    }

    setPokemons(pokeList) {
        this.pokemons = pokeList;
    }
    toggleAbilities(pokemon, pokemonHTML) {
        const existingAbilities = pokemonHTML.querySelector('div');
        if (existingAbilities) {
            existingAbilities.remove();
        } else {
            this.displayActivePokemon(pokemon);
        }
    }

    displayActivePokemon = async () => {
        const ability = this.activePokemon.abilities.map(a => a.ability.name);
        const html = `
            <div class="type">
                <div class="closeModal">
                  <h3 style="text-transform: uppercase;">${this.activePokemon.name}</h3>
                    <button class="closeBtn">X</button>
                </div>
                <h3>Height: ${this.activePokemon.height}</h3>
                <h3>Abilities: ${ability.join(', ')}</h3>
                <h3>Weight: ${this.activePokemon.weight}</h3>
            </div>
        `;
        showPokemonModal(html);
    }
    setActivePokemonToNull(){
        this.activePokemon = null;
    }

    displayPokemon(pokemon) {
        const html = `
            <li class="pokemon" id="${pokemon.id}">
                <img src="${pokemon.img}">
                <h2>${pokemon.name}</h2>
            </li>
        `;
        pokemonsHtml.insertAdjacentHTML('beforeend', html);
    }

    iterateThroughPokemons = async () => {
        await this.getPokemon();
        pokemonsHtml.innerHTML = '';
        this.pokemons.forEach(pokemon => this.displayPokemon(pokemon));
    }
    iterateThroughSearchedPokemons = async() =>{
        pokemonsHtml.innerHTML = '';
        this.activePokemon.forEach(pokemon => this.displayPokemon(pokemon));
    }
}

export const pokemons = new PokemonsManager();

//Pospremiti sve u jednu funkciju ovo gjde je getAcitve pokemon jer sve radi istu stvar ovo za fetch
//Pogledaj sto je debounce 
//Poziva se baza nakon kucanja u input ali nakon nekog delaya koristeci debounce
//https://github.com/niksy/throttle-debounce