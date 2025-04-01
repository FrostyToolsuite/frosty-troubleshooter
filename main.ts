import {
  InteractionResponseType,
  InteractionType,
  verifyKey
} from 'discord-interactions';
import {
  PING_COMMAND
} from "./commands.ts";

// Environment variables
enum EnvVars {
  DISCORD_APPLICATION_ID = "DISCORD_APPLICATION_ID",
  DISCORD_PUBLIC_KEY = "DISCORD_PUBLIC_KEY",
  DISCORD_TOKEN = "DISCORD_TOKEN",
  TOGETHER_API_KEY = "TOGETHER_API_KEY"
}

async function verifyDiscordRequest(req: Request, body: string) {

  const signature = req.headers.get("X-Signature-Ed25519");
  const timestamp = req.headers.get("X-Signature-Timestamp");
  const discordPublicKey = Deno.env.get(EnvVars.DISCORD_PUBLIC_KEY);

  if (typeof signature !== 'string' ||
    typeof timestamp !== 'string' ||
    typeof discordPublicKey !== 'string') {
    return false;
  }

  return await verifyKey(body, signature, timestamp, discordPublicKey);
}

Deno.serve(
  { port: 8080 },
  async (req: Request) => {
    const body = await req.text();
    
    if (!(await verifyDiscordRequest(req, body))) {
      return new Response("Invalid request signature", { status: 401 });
    }

    const message = JSON.parse(body);

    if (req.method === 'GET') {
      return new Response("Server Status OK", { status: 200 });
    }
    if (req.method === 'POST') {
      switch (message.type) {
        case InteractionType.PING: {
          return new Response(JSON.stringify({
            type: InteractionResponseType.PONG
          }));
        }
        case InteractionType.APPLICATION_COMMAND: {
          switch (message.data.name.toLowerCase()) {
            case PING_COMMAND.name.toLowerCase(): {
              return new Response(
                JSON.stringify({
                  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                  data: {
                    content: "Pong"
                  }
                }),
                {
                  headers: {
                    "Content-Type": "application/json; charset=utf-8"
                  }
                }
              );
            }
          }
        }
      }
    }
    return new Response("Invalid request", { status: 400 });
});
