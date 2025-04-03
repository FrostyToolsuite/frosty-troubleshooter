// This file is for registering all commands
// Designed to be run once by GitHub Actions on every push

import { CommandList } from './commands.ts';

enum EnvVars {
  DISCORD_APPLICATION_ID = "DISCORD_APPLICATION_ID",
  DISCORD_TOKEN = "DISCORD_TOKEN",
}

const token = Deno.env.get(EnvVars.DISCORD_TOKEN);
const applicationId = Deno.env.get(EnvVars.DISCORD_APPLICATION_ID);

if (!token) {
  throw new Error(
    'The DISCORD_TOKEN environment variable is required.'
  );
}
if (!applicationId) {
  throw new Error(
    'The DISCORD_APPLICATION_ID environment variable is required.',
  );
}

const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;

const response = await fetch(url, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bot ${token}`
  },
  method: 'PUT',
  body: JSON.stringify(CommandList),
});

if (response.ok) {
  console.log('Registered all commands');
  console.log(await response.text());
} else {
  console.error('Error registering commands');
  console.error(await response.text());
  throw new Error('Error registering commands');
}