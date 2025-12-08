# AI-Enhanced Design Workflow

A modern, interactive web application showcasing the AI-Enhanced Design Workflow with 5 phases: Discovery, Define, Ideation, Test, and Implement.

## Features

- **Interactive Phase Cards**: Click on any phase to see detailed tools and resources
- **Dynamic Side Panel**: View detailed information about specific tools with overlay
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Next.js, React, TypeScript, and Tailwind CSS

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Utilities**: clsx

## Project Structure

```
.
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page with workflow
│   └── globals.css      # Global styles
├── components/
│   ├── PhaseCard.tsx    # Phase card component
│   ├── ExpandedView.tsx # Expanded tools view
│   └── SidePanel.tsx    # Tool details panel
├── data/
│   └── phases.ts        # Phase data configuration
└── types/
    └── index.ts         # TypeScript types
```

## Customization

To add more phases or tools, edit the `data/phases.ts` file.
