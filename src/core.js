const path = require('path');
const fs = require('fs');
const helpers = require('./helpers.js');
const inquirer = require('inquirer');
const Table = require('cli-table');

module.exports = {
	addRecipe(recipeName) {
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

			if (!fs.existsSync('recipes')) {
				fs.mkdirSync('recipes');
			}

			fs.writeFile(`./recipes/${recipeName}.json`, recipe, (err) => {
				if (err) {
					console.info('Could not save file... :(');
				};

				console.info(`${recipeName} has been saved!`);
			})
		});
	},

	deleteRecipe(recipeName) {
		fs.unlink(`./recipes/${recipeName}.json`, (err) => {
    		if (err) {
        		console.info(`${recipeName} could not be deleted!`);
    		} else {
    			console.info(`Deleted ${recipeName}!`);
    		}
		});
	},

	makeRecipe(recipeName, options) {
		// get recipe file
		let recipeFile = fs.readFileSync(`./recipes/${recipeName}.json`);

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
			flavorMl = (parseInt(parsedRecipe.flavors[key].percentage) * parseInt(options.size)) / 100;
			table.push([parsedRecipe.flavors[key].flavor, flavorMl]);
		};

		console.log(table.toString()); 
	}
}