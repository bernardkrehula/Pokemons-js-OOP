import { pokemonsHtml, showPokemonModal } from "./script.js";

export class PokemonsManager {
    constructor() {
        this.pokemons = null;
        this.activePokemon = [];
        this.allPokemons = [];
    }

    getPokemon = async () => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=40`);
            const data = await response.json();
            this.setPokemons(data.results);
            return this.pokemons;
        } catch (error) {
            console.log(error);
        }
    }

    getPokemonsData = async () => {
        try {
            this.pokemons = await Promise.all(this.pokemons.map(async pokemon => {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
                const pokeData = await response.json();
                pokemon.img = pokeData.sprites.front_default;
                pokemon.id = pokeData.id;
                return pokemon;
            }));
            
            return this.pokemons;
        } catch (error) {
            console.log(error);
        }
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
            const pokeDataFetch = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
            if (!pokeDataFetch.ok) {
            throw new Error('Pokemon nije pronađen!');
            }
            
            const pokeData = await pokeDataFetch.json();
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
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
                const data = await response.json();
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
    
    //"https://pokeapi.co/api/v2/pokemon/6/" adresa za pojedinacnog pokemona
    //Prilikom prikazivanja liste pokemona zakaci id pokemona
    //Na click procitaj taj id i pozovi adresu iznad 
    //Izvuci neke podatke koje hoces stavi ih u objekat
    //I to je sad activePokemon
    //Otvori modal i prikazi activePokemon podatke 
    //Kad se klikne x da se zatvori modal
    //Stavis da je active pokemon = null
    //Prilikom kucanja u input na submit ista ova stvar iznad ali pretrazujem preko imena tj. vrijednost inputa
    //

    //Na klik prikazati content pokemona i ali na taj nacin da ga pozoves sa requestom
    //Input staviti na submit i na enter naci pokemona preko api i napraviti request samo za tog pokemona
    //Id su brojevi
    //Treba nekako dohvatiti samo sliku za pokemona ime i url tj. id
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
        await this.getPokemonsData();
        pokemonsHtml.innerHTML = '';
        this.pokemons.forEach(pokemon => this.displayPokemon(pokemon));
    }
    iterateThroughSearchedPokemons = async() =>{
        pokemonsHtml.innerHTML = '';
        this.activePokemon.forEach(pokemon => this.displayPokemon(pokemon));
    }
}

export const pokemons = new PokemonsManager();
