# ASCII Art MCP Server

A simple Model Context Protocol (MCP) server that detects topics in conversation and displays ASCII art when specific topics are mentioned.

## Features

- Detects topics from keywords in text
- Returns ASCII art for: cat, dog, coffee, rocket, heart
- Easy to extend with new topics and ASCII art

## Setup

```bash
npm install
npm run build
```

## Usage

The server provides one tool: `ascii_art_detector`

**Input:** Text to analyze for topics
**Output:** ASCII art if a matching topic is detected

## Topics Detected

- **Rich Hickey**: rich hickey, simple made easy, value of values, decomplect, clojure
- **Cat**: cat, cats, kitten, feline, meow, purr
- **Dog**: dog, dogs, puppy, canine, bark, woof  
- **Coffee**: coffee, espresso, latte, cappuccino, caffeine, java
- **Rocket**: rocket, space, launch, spacecraft, astronaut, NASA
- **Heart**: love, heart, romantic, valentine, affection, care

## Configuration

To use with Claude Desktop, add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ascii-art": {
      "command": "node",
      "args": ["/path/to/repo/dist/index.js"]
    }
  }
}
```

## Adding New Topics

1. Add ASCII art to the `ASCII_ART` object in `src/index.ts`
2. Add keywords to the `TOPIC_KEYWORDS` object
3. Rebuild: `npm run build`
