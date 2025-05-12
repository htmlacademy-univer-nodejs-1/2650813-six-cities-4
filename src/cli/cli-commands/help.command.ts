import chalk from 'chalk';

const commands = [
  { name: 'help', description: '- показывает справочную информацию' },
  { name: 'version', description: '- выводит текущую версию приложения' },
  { name: 'import <file>', description: '- загружает данные из указанного файла' },
];

export const showHelp = () => {
  console.log(chalk.green('Список команд:'));

  commands.forEach((cmd) =>
    console.log(chalk.blue(cmd.name), cmd.description)
  );
};
