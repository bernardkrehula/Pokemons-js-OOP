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
                const pokeImg = await response.json();
                pokemon.img = pokeImg.sprites.front_default;
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
            console.log(data)
            const limitedPokemons = data.pokemon.slice(0, 20).map(p => p.pokemon);
            const pokesDetails = await Promise.all(limitedPokemons.map(async poke => {
                const res = await fetch(poke.url);
                return await res.json();
            }));
            this.activePokemon = pokesDetails;
            this.displayFilteredPokemons(pokesDetails);
        } catch (error) {
            console.log(error);
        }
    }
    getSearchedPokemon(pokemonInput){
        const foundPokemon = this.pokemons.find(pokemon => pokemon.name === pokemonInput);
        pokemonsHtml.innerHTML = '';
        this.displayPokemon(foundPokemon);
    }

    displayFilteredPokemons = (pokemonsArray) => {
        pokemonsHtml.innerHTML = '';
        pokemonsArray.forEach(pokemon => this.displayPokemon(pokemon));
    }

    setPokemons(pokeList) {
        this.pokemons = pokeList;
    }

    filterPokemonsOnSearch(value) {
        this.activePokemon = this.allPokemons.filter(pokemon =>
            pokemon.name.toLowerCase().includes(value.toLowerCase())
        );
    }

    iterateThroughSearchedPokemons() {
        pokemonsHtml.innerHTML = '';
        this.activePokemon.forEach(pokemon => this.displayPokemon(pokemon));
    }

    findActivePokemon(pokeElement) {
        return this.allPokemons.find(pokemon => pokemon.name === pokeElement.id);
    }

    getActivePokemon = async (foundPokemon) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${foundPokemon.name}`);
            this.activePokemon = await response.json();
            return this.activePokemon;
        } catch (error) {
            console.log(error);
        }
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

    displayActivePokemon = async (pokemon) => {
        await this.getActivePokemon(pokemon);
        const ability = this.activePokemon.abilities.map(a => a.ability.name);
        const html = `
            <div class="type">
                <h3 style="text-transform: uppercase;">${pokemon.name}</h3>
                <h3>Height: ${this.activePokemon.height}</h3>
                <h3>Abilities: ${ability.join(', ')}</h3>
                <h3>Weight: ${this.activePokemon.weight}</h3>
            </div>
        `;
        showPokemonModal(html);
    }

    displayPokemon(pokemon) {
        const html = `
            <li class="pokemon" id="${pokemon.url}">
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
}

export const pokemons = new PokemonsManager();
