#!/usr/bin/env node

'use strict';

const program = require('commander');
const Recipe = require('./src/Recipe.js');

program
    .version('0.0.1')
    .description('Command line based e-liquid recipe calculator.');

program
    .command('add <recipeName>')
    .description('Add a new recipe.')
    .action(recipeName => {
    	const recipe = new Recipe(recipeName);
        recipe.add();
    });

program
	.command('delete <recipeName>')
	.description('Delete a recipe.')
	.action(recipeName => {
		const recipe = new Recipe(recipeName);
		recipe.delete();
	});

program
	.command('make <recipeName>')
	.description('Make a recipe.')
	.option('--size <size>', 'Size of bottle in ml.')
	.option('--strength <strength>', 'Target nicotine strength')
	.option('--pg <pg>', 'Target PG percentage')
	.action((recipeName, options) => {
		const recipe = new Recipe(recipeName);
		recipe.make(options);
	});

program.parse(process.argv);

