import { connection } from '@cumulus/db';

import * as path from 'path';
export type Command = 'latest';

export interface HandlerEvent {
  command?: Command,
  env?: NodeJS.ProcessEnv
}

export const handler = async (event: HandlerEvent): Promise<void> => {
  let knex;
  try {
    const env = event?.env ?? process.env;
    env.migrationDir = path.join(__dirname, 'migrations');
    knex = await connection.knex(env);
    const command = event?.command ?? 'latest';

    switch (command) {
      case 'latest':
        await knex.migrate.latest();
        break;
      default:
        throw new Error(`Invalid command: ${command}`);
    }
  } finally {
    if (knex) {
      await knex.destroy();
    }
  }
};