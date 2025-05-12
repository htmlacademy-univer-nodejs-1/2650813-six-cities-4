#!/usr/bin/env node

import { Command } from 'commander';
import { showHelp } from './cli-commands/help.command.js';
import { printAppVersion } from './cli-commands/version.command.js';
import { importOffers } from './cli-commands/import.command.js';
import { generateOffers, saveOffersToFile } from './cli-commands/generate.command.js';

const cli = new Command();

cli
  .name('six-cities')
  .description('Command line utility for the Six Cities project')
  .version(printAppVersion(), '--version', 'display application version');

cli
  .command('help')
  .description('Show available commands and usage info')
  .action(showHelp);

cli
  .command('import <file>')
  .description('Load rental data from a TSV file')
  .action(async (file) => {
    await importOffers(file);
  });

cli
  .command('generate <amount> <source> <destination>')
  .description('Create mock data and export to TSV format')
  .action(async (amount, source, destination) => {
    console.log(`Preparing to create ${amount} offers based on API: ${source}`);
    try {
      const offers = await generateOffers(Number(amount), source);
      saveOffersToFile(offers, destination);
      console.log(`Data generation complete. Results saved to: ${destination}`);
    } catch (err) {
      console.error('Failed to generate mock data:', err);
    }
  });

if (process.argv.length <= 2) {
  showHelp();
}

cli.parse(process.argv);
