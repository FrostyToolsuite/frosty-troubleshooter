// Command metadata

export const PING_COMMAND = {
  name: 'ping',
  description: 'Test the bot status',
  dm_permission: false
};

export const TEMPLATE_COMMAND = {
  name: 'template',
  description: 'PLACEHOLDER, Fill in a template easier',
  dm_permission: false
};

export const CHAT_COMMAND = {
  name: 'chat',
  description: 'Ask AI',
  dm_permission: false,
  options: [
    {
      name: "prompt",
      description: "The message you want to send to the AI.",
      type: 3, // 3 = String
      required: true,
    },
  ],
};

export const IDK_COMMAND = {
  name: 'idk',
  description: 'test',
  dm_permission: false
};

export const CommandList = [PING_COMMAND, TEMPLATE_COMMAND, CHAT_COMMAND, IDK_COMMAND];