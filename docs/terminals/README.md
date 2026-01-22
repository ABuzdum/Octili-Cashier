# POS Terminal Documentation

This folder contains technical documentation for all supported POS terminals.

## Supported Terminals

| Terminal | Platform | Status | Documentation |
|----------|----------|--------|---------------|
| VV2S Plus | Android | Active | [View Docs](./vv2s-plus/README.md) |

## Adding a New Terminal

1. Copy the `_template` folder and rename it to the terminal model name (lowercase, hyphens)
2. Fill in all the technical specifications in the README.md
3. Add integration notes and any special considerations
4. Update this README.md table with the new terminal

## Folder Structure

```
terminals/
├── README.md                 # This file - overview of all terminals
├── _template/                # Template for adding new terminals
│   ├── README.md            # Technical specifications template
│   └── integration.md       # Integration notes template
├── vv2s-plus/               # VV2S Plus Android terminal
│   ├── README.md            # Technical specifications
│   ├── integration.md       # Integration notes
│   └── assets/              # Images, diagrams, etc.
└── [other-terminal]/        # Future terminals follow same structure
```

## Key Considerations for All Terminals

- **Touch Targets**: Minimum 48px for all interactive elements
- **Screen Orientation**: Support both landscape and portrait where applicable
- **Offline Mode**: All terminals must support offline operation
- **Print Integration**: Document printer capabilities and APIs
