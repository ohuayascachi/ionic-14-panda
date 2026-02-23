# Instructions to Run the Project Locally

The project has been refactored to use **Angular 18 Standalone Components** and **Signals**, and updated to **Ionic 8**.

## 1. Clean Your Environment (Windows)
Run these commands in PowerShell or Command Prompt to ensure a clean slate:

```powershell
# PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

## 2. Install Dependencies
Install dependencies using the legacy peer deps flag to handle older libraries:

```bash
npm install --legacy-peer-deps
```

## 3. Run the Application
Start the development server:

```bash
npm start
# or
ionic serve
```

## Changes Made
1.  **Modern Angular Architecture**:
    *   Migrated from `NgModule` to **Standalone Components**.
    *   Removed `AppModule`, `ProductsModule`, `ItemProductModule`, `LogInModule`.
    *   Bootstrapping is now done in `main.ts` using `bootstrapApplication`.
    *   Routing is defined in `src/app/app.routes.ts`.

2.  **State Management**:
    *   Refactored `AuthService` to use **Signals** (`currentUser`, `isLoggedIn`).
    *   Updated `LogInComponent` to use Signals for UI state.

3.  **Authentication Fixes**:
    *   Added handling for "jwt expired" errors. The app will now automatically logout and redirect to login if the session expires.
    *   Fixed login flow to correctly handle `Storage` initialization.

4.  **Visual Updates**:
    *   Changed the primary color to **Green** (`#2dd36f`) as requested.

## Troubleshooting
*   **Cache Issues**: If you see old styles or errors, try clearing the browser cache or running `npm start` again.
*   **"Invalid base URL" in Console**: You might see warnings about base URL or icons in the console. These are often related to the development environment and shouldn't affect core functionality.
*   **Backend Connection**: Ensure your backend server is running on `http://localhost:2001` (or update `src/environments/environment.ts`). The app handles connection errors gracefully but features will be limited.
