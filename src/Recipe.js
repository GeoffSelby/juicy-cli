"use strict";

const path = require('path');
const fs = require('fs');
const helpers = require('./helpers.js');
const inquirer = require('inquirer');
const Table = require('cli-table');

class Recipe {

	constructor (recipeName) {
		this.recipeName = recipeName;
	}

	add () {
		let questions = [
			{
				type: 'input',
				name: 'flavor',
				message: 'Enter flavor...'
			},
			{
				type: 'input',
				name: 'percentage',
				message: 'Enter percentage...'
			}
		];

		inquirer.registerPrompt('recursive', require('inquirer-recursive'));

		inquirer.prompt([{
			type: 'recursive',
			message: 'Add a flavor?',
			name: 'flavors',
			prompts: questions
		}]).then(answers => {
			let recipe = JSON.stringify(answers, null, 4);

			this.saveRecipe(recipe);
		});
	}

	delete () {
		fs.unlink(`./recipes/${this.recipeName}.json`, (err) => {
    		if (err) {
        		console.info(`${this.recipeName} could not be deleted!`);
    		} else {
    			console.info(`Deleted ${this.recipeName}!`);
    		}
		});
	}

	make (options) {
		// get recipe file
		let recipeFile = fs.readFileSync(`./recipes/${this.recipeName}.json`);

		// parse recipe file
		let parsedRecipe = JSON.parse(recipeFile);

		// setup table for later output
		let table = new Table({
			head: ['Component', 'ML']
		});

		// calculate total flavor percentage
		let totalFlavorPercentage = 0;
		for(let key in parsedRecipe.flavors) {
			totalFlavorPercentage += parseInt(parsedRecipe.flavors[key].percentage);
		};

		// calculate pg percentage
		let pgPercentage = parseInt(options.pg) - totalFlavorPercentage;
		
		// calculate temp pg ml
		let pgAmount = (pgPercentage * parseInt(options.size)) / 100;

		// calculate nic ml
		let strength = helpers.round((options.strength/100) * options.size, 1);
		table.push(['Nicotine', strength]);

		// calculate final pg ml
		// assuming pg nic base
		pgAmount = pgAmount - strength;
		table.push(['PG', pgAmount]);

		// calculate total vg ml
		let vgAmount = 100 - parseInt(options.pg);
		vgAmount = (vgAmount * parseInt(options.size)) / 100;
		table.push(['VG', vgAmount]);

		// finally calculate each flavor ml
		for (let key in parsedRecipe.flavors) {
			let flavorMl = (parseInt(parsedRecipe.flavors[key].percentage) * parseInt(options.size)) / 100;
			table.push([parsedRecipe.flavors[key].flavor, flavorMl]);
		};

		console.log(table.toString()); 
	}

	saveRecipe(recipe) {
		if (!fs.existsSync('recipes')) {
			fs.mkdirSync('recipes');
		};

		fs.writeFile(`./recipes/${this.recipeName}.json`, recipe, (err) => {
			if (err) {
				console.info('Could not save file... :(');
			};

			console.info(`${this.recipeName} has been saved!`);
		});
	}
};

module.exports = Recipe;