#!/usr/bin/env node

'use strict';

const program = require('commander');
let Juicy = require('./src/core.js');

program
    .version('0.0.1')
    .description('Command line based e-liquid recipe calculator.');

program
    .command('add <recipeName>')
    .description('Add a new recipe.')
    .action(recipeName => {
        Juicy.addRecipe(recipeName);
    });

program
	.command('delete <recipeName>')
	.description('Delete a recipe.')
	.action(recipeName => {
		Juicy.deleteRecipe(recipeName);
	});

program
	.command('make <recipeName>')
	.description('Make a recipe.')
	.option('--size <size>', 'Size of bottle in ml.')
	.option('--strength <strength>', 'Target nicotine strength')
	.option('--pg <pg>', 'Target PG percentage')
	.action((recipeName, options) => {
		Juicy.makeRecipe(recipeName, options);
	});

program.parse(process.argv);

