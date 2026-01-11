# Development Setup Guide

## Project Structure

The Leadify project is organized into three main directories:

### 1. `client/` - Frontend Application
Contains the Next.js frontend application with all UI components and pages.

**Key Directories:**
- `src/app/` - Next.js App Router pages
- `src/components/` - React components organized by feature:
  - `common/` - Shared components (NavigationSidebar, Toast, UploadModal)
  - `dashboard/` - Dashboard-specific components
  - `mail-management/` - Mail management components
  - `suppressed/` - Suppressed emails components
- `src/styles/` - Global CSS files
- `public/` - Static assets (images, icons)

**Path Aliases:**
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/styles/*` → `./src/styles/*`
- `@/shared/*` → `../shared/*`

### 2. `server/` - Backend API (Placeholder)
Placeholder structure for future backend development.

### 3. `shared/` - Shared Code
Code shared between frontend and backend:
- `types/` - TypeScript interfaces and types
- `constants/` - Application constants

## Running the Application

### Frontend

```bash
cd client
npm install
npm run dev
```

### Building for Production

```bash
cd client
npm run build
npm start
```

## Adding New Features

### Creating a New Page
1. Add page file in `client/src/app/[page-name]/page.tsx`
2. Import necessary components from `@/components/`
3. Add navigation link in `NavigationSidebar.tsx`

### Creating a New Component
1. Determine the feature area (common, dashboard, mail-management, etc.)
2. Create component in appropriate directory
3. Export from the component file
4. Import using path alias: `@/components/[feature]/[ComponentName]`

### Adding Shared Types
1. Add interface/type to `shared/types/index.ts`
2. Import in frontend: `import type { TypeName } from '@/shared/types'`

## Troubleshooting

### Import Errors
- Ensure path aliases are correctly configured in `client/tsconfig.json`
- Check that component files are in the correct feature directory
- Verify imports use `@/` prefix for absolute paths

### Build Errors
- Run `npm run build` to check for TypeScript errors
- Check console for specific error messages
- Ensure all imports resolve correctly

## Git Workflow

The project uses feature branches for development:

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push to remote
git push origin feature/your-feature-name
```

## Next Steps

- Implement backend API in `server/` directory
- Add database integration
- Implement email sending functionality
- Add authentication and user management
