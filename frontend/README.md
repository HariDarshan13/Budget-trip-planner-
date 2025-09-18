# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5d293cbc-8a0b-426f-93b2-446f18ac703f

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5d293cbc-8a0b-426f-93b2-446f18ac703f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5d293cbc-8a0b-426f-93b2-446f18ac703f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)


## Added scaffolded modules (10 pages)
Added pages under `src/pages/`:
- AuthModule, PreferencesModule, BudgetModule, TransportModule, AccommodationModule, ActivitiesModule, ItineraryGenerator, MapRouteOptimizer, ItineraryOutput, AdminPanel

Navigation updated to include routes to these pages.

## Images
Placeholder SVGs added to `public/assets/tamilnadu/`. Replace with real photos of Tamil Nadu tourist places.

## Maps & APIs
- Scaffolded `src/components/LeafletMap.tsx`. To enable:
  1. `npm install leaflet react-leaflet`
  2. Add `import 'leaflet/dist/leaflet.css';` in `src/main.tsx` or `index.css`.
  3. Use Amadeus APIs (hotels, transport) from a secure server-side component — keep API keys secret.

## How to continue
- Install additional deps: `npm i react-leaflet leaflet @types/leaflet`
- Implement server endpoints to proxy Amadeus requests and secure API keys.
- Replace placeholder images with real photographs (filenames present in public/assets/tamilnadu).

