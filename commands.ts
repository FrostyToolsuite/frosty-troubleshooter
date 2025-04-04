// Command metadata

export const PING_COMMAND = {
  name: "ping",
  description: "Test the bot status",
  dm_permission: false,
};

export const TEMPLATE_COMMAND = {
  name: "template",
  description: "Fill in a template easier",
  dm_permission: false,
};

export const CHAT_COMMAND = {
  name: "chat",
  description: "Test command to chat with AI",
  dm_permission: false,
  options: [
    {
      name: "prompt",
      description: "The message you want to send to the AI.",
      type: 3,
      required: true,
    },
  ],
};

export const CommandList = [PING_COMMAND, TEMPLATE_COMMAND, CHAT_COMMAND];
