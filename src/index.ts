#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "ascii-art-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ASCII art for different topics
const ASCII_ART = {
    hickey: `
              **===                     
           **======+*+*##+**            
           +-==---===-::--=+=+          
        ++=---=:-:---:.:--:---==+       
        ===--::.::-:....:--::::-=       
       ++==-:..::..::::::...:::-+*      
      +=+::.:-:.::-=::::.::-:.:-=+      
      =:-::..:::=+-------=++=:::-*      
      ::.::::+##%%#**+++**##%-:.:==     
     +=:...-#@@%++=--+#*+===#=:.:=      
     -:.:-:+@@%***==+#@#=-=*#+--=       
    -:.:=+-+@@@@@%@%@@@%%#**@#-         
     -::=%@@@@@@@@*-##%*%++#@%          
      -::@@@@@%#*=-=#*-+#==*@#          
       -:.:%%%#*+=++++=+%%=*@           
        =::@###*****+*=*%++%@           
         .-@%***++##*=-+#%#%            
        -.#@%#+++*#%%#**#@%%            
       --:*@@#*++++=====*%..            
   ---=--:-%@%**+==---=*@*..-=          
:--::-=---:+%%#*++++++%@@+...--==       
:-:::-=---::=**+++++=#%#+-....--:-=     
`,
  cat: `
     /\\_/\\  
    ( o.o ) 
     > ^ <  
  `,
  dog: `
    /\\   /\\   
   (  ._. ) 
    o_(")(") 
  `,
  coffee: `
      (  )   (   )  )
       ) (   )  (  (
       ( )  (    ) )
       _____________
      <_____________> ___
      |             |/ _ \\
      |               | | |
      |               |_| |
   ___|             |\\___/
  /    \\___________/    \\
  \\_____________________/
  `,
  rocket: `
        /\\
       /  \\
      |    |
      |    |
     /|    |\\
    / |    | \\
   /  |    |  \\
  /   |____|   \\
 /              \\
/________________\\
|      ||      |
|      ||      |
|______||______|
  `,
  heart: `
    ♥♥♥♥♥♥♥  ♥♥♥♥♥♥♥
  ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
 ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
 ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
  ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
   ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
    ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
     ♥♥♥♥♥♥♥♥♥♥♥♥♥
      ♥♥♥♥♥♥♥♥♥♥♥
       ♥♥♥♥♥♥♥♥♥
        ♥♥♥♥♥♥♥
         ♥♥♥♥♥
          ♥♥♥
           ♥
  `
};

// Topic detection keywords
const TOPIC_KEYWORDS = {
  hickey: ['hickey', 'rich hickey', 'simple made easy', 'value of values', 'decomplect', 'clojure'],
  cat: ['cat', 'cats', 'kitten', 'feline', 'meow', 'purr'],
  dog: ['dog', 'dogs', 'puppy', 'canine', 'bark', 'woof'],
  coffee: ['coffee', 'espresso', 'latte', 'cappuccino', 'caffeine', 'java'],
  rocket: ['rocket', 'space', 'launch', 'spacecraft', 'astronaut', 'NASA'],
  heart: ['love', 'heart', 'romantic', 'valentine', 'affection', 'care']
};

// Function to detect topics in text
function detectTopic(text: string): string | null {
  const lowerText = text.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return topic;
      }
    }
  }
  
  return null;
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "ascii_art_detector",
        description: "Detects topics in conversation and returns ASCII art if a matching topic is found",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "The text to analyze for topics",
            },
          },
          required: ["text"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "ascii_art_detector") {
    if (!args || typeof args.text !== "string") {
      throw new Error("Missing or invalid 'text' parameter");
    }
    
    const text = args.text;
    const detectedTopic = detectTopic(text);
    
    if (detectedTopic && ASCII_ART[detectedTopic as keyof typeof ASCII_ART]) {
      return {
        content: [
          {
            type: "text",
            text: `Topic detected: ${detectedTopic}\\n\\n${ASCII_ART[detectedTopic as keyof typeof ASCII_ART]}`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: "No matching topic detected in the text.",
          },
        ],
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ASCII Art MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
