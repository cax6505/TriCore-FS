# SaveSpace

[Live Demo](https://tricore-fs.vercel.app/)

SaveSpace is an educational web app for understanding file systems through interactive simulation and smart file management.  
It combines a modern landing experience with a full visualization workspace, Finder-style interface, and an intelligent file organizer - all built to teach core OS concepts hands-on.

## Features

- **File System Simulator** — visual disk block mapping with multiple allocation strategies
- **Smart File Organizer** — automated file classification and folder organization
- **Allocation Strategy Comparison** — live behavior differences across Contiguous, Linked, Indexed, FAT, and Unix-style methods
- **Disk Visualization** — fragmentation visibility, inode metadata, and disk usage insights
- **Interactive Guides** — concept explanation pages for both the simulator and the organizer
- **npm Package** — standalone `smart-folder-organiser` package for CLI file organization

## Route Map

| Route | Purpose |
|---|---|
| `/` | Product landing page |
| `/visualization` | Main file system simulator workspace |
| `/organiser` | Smart file organizer interface |
| `/guide` | Visualization learning guide |
| `/organiser-guide` | Organizer concepts & OS guide |
| `/npm-package` | Smart Folder Organiser npm package docs |

## Simulator Concepts

The visualization module models:

- `Inode`: file metadata and block pointers
- `Directory`: name → inode mapping
- `Disk`: block array + free bitmap
- Allocation strategy behavior and trade-offs

### Supported Allocation Strategies

| Strategy | How it stores blocks | Access pattern | Fragmentation profile |
|---|---|---|---|
| Contiguous | Adjacent blocks | Fast sequential/random | External fragmentation risk |
| Linked | Chained scattered blocks | Sequential-friendly | No external fragmentation |
| Indexed | Index block + data blocks | Fast direct access | Index overhead |
| FAT | File Allocation Table entries | Table-based lookup | Centralized metadata |
| Unix-style | Direct + indirect pointers | Scales to larger files | Balanced practical approach |

## Project Structure

```txt
src/
  App.tsx                        # Route setup
  pages/
    LandingPage.tsx              # Landing page
    Index.tsx                    # /visualization page
    Organiser.tsx                # /organiser page
    Guide.tsx                    # /guide page
    OrganiserGuide.tsx           # /organiser-guide page
    NpmPackage.tsx               # /npm-package page
    FinderInterface.tsx          # Finder-style file browser (inactive)
    Theory.tsx                   # Theory page (inactive)
    Roadmap.tsx                  # Roadmap page (inactive)
  hooks/
    useFileSystem.ts             # Simulator state/actions
  lib/
    filesystem.ts                # Core FS simulation logic
  types/
    filesystem.ts                # FS data model/types
  components/
    landing/                     # Landing page sections
    FileList.tsx
    FileGrid.tsx
    FileInspector.tsx
    DiskBlockVisual.tsx
    DirectoryTree.tsx
    AllocationStrategySelector.tsx
    InodePointerVisualization.tsx
    PathVisualizer.tsx
    ...                          # Other simulator UI parts
```

## Local Development

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+

### Setup

```bash
git clone https://github.com/nandu-99/TriCoreFS.git
cd TriCoreFS
npm install
npm run dev
```

Open the app at `http://localhost:8080`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production bundle |
| `npm run build:dev` | Build development bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI / shadcn-style components
- Framer Motion
- Spline 3D
- Vitest

## Notes for Contributors

- Visualization state persists to `localStorage` (key: `visual-fs-state`).
- If behavior looks stale during local testing, clear browser local storage and reload.
- Routes `/finder`, `/theory`, and `/roadmap` exist as page files but are currently inactive (commented out in the router).

## License

MIT
