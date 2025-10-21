
# Full Stack Development with Agentic Coding

This is a bootstrap project designed as your first step in learning full stack development with the assistance of AI-powered coding tools. This Next.js application serves as a foundation where you can experiment with building complete applications using agentic coding assistance.

## Prerequisites

### Windows Users
Install Windows Subsystem for Linux (WSL):
```powershell
wsl --install
```
After installation, restart your computer and complete WSL setup. All subsequent commands should be run in the WSL terminal.

### Mac Users
1. Install Xcode Command Line Tools:
```bash
xcode-select --install
```

2. Install Homebrew:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### All Users
1. **Install Node Version Manager (nvm):**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```
Restart your terminal, then:
```bash
nvm install --lts
nvm use --lts
```

2. **Install pnpm:**
```bash
npm install -g pnpm
```

3. **Create a GitHub account** using your personal email address at [github.com](https://github.com)

4. **Download and install Cursor IDE** from [cursor.sh](https://cursor.sh)

5. **Log into Cursor** using your GitHub account

## Getting Started

1. **Open a new terminal in Cursor:**
   - Use the top menu → Terminal → New Terminal (or click the three dots icon to the right if needed)

Then in the terminal:
2. **Install dependencies:**
```bash
pnpm install
```

3. **Start the development server:**
```bash
pnpm dev
```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

You should see the application running successfully!

## Start Building with AI

Once everything is working, find the chat window on the right side of the Cursor IDE. Try these zero-shot prompts to build applications:

- "Make a todo app"
- "Make a multiplayer poker game"
- "Build a weather dashboard"
- "Create a personal expense tracker"
- "Make a recipe sharing platform"

The AI assistant will help you build complete, functional applications from these simple prompts!

## What's Next?

This project includes a full stack setup with:
- Next.js 15 for the frontend and API routes
- PostgreSQL database with Drizzle ORM
- React Query for data fetching
- Tailwind CSS for styling
- TypeScript for type safety

Start experimenting and see what you can build!
