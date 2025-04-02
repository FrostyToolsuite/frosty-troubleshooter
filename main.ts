import {
  InteractionResponseType,
  InteractionType,
  verifyKey
} from 'discord-interactions';
import {
  PING_COMMAND,
  TEMPLATE_COMMAND,
  CHAT_COMMAND
} from "./commands.ts";

// Environment variables
enum EnvVars {
  DISCORD_APPLICATION_ID = "DISCORD_APPLICATION_ID",
  DISCORD_PUBLIC_KEY = "DISCORD_PUBLIC_KEY",
  DISCORD_TOKEN = "DISCORD_TOKEN",
  TOGETHER_API_KEY = "TOGETHER_API_KEY"
}
const userAgent = "DiscordBot (https://github.com/FrostyToolsuite/frosty-troubleshooter, 0.1.0)"

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
  { port: Number(Deno.env.get("PORT")) || 8080 },
  async (req: Request) => {
    // Response GET requests (not from Discord)
    if (req.method === 'GET') {
      return new Response("Server Status OK", { status: 200 });
    }

    // Process body
    const body = await req.text();
    
    // Verify the request is from Discord
    if (!(await verifyDiscordRequest(req, body))) {
      return new Response("Invalid request signature", { status: 401 });
    }

    // Process message
    const message = JSON.parse(body);

    // Handle POST requests
    if (req.method === 'POST') {
      switch (message.type) {
        // Response PING
        case InteractionType.PING: {
          return new Response(JSON.stringify({
            type: InteractionResponseType.PONG
          }));
        }
        // Handle APPLICATION_COMMAND
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
                    "Content-Type": "application/json; charset=utf-8",
                    "User-Agent": userAgent
                  }
                }
              );
            }
            case TEMPLATE_COMMAND.name.toLowerCase(): {
              return new Response(
                JSON.stringify({
                  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                  data: {
                    content: "This command is currently a placeholder"
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
