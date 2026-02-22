# Instructions to Run the Project Locally

The project dependencies have been updated to resolve the blank screen issue caused by invalid version numbers in `package.json`. The project now targets **Angular 18** and **Ionic 8**.

To run this project on your local machine (WebStorm, VS Code, etc.), please follow these steps carefully:

## 1. Clean Your Environment
Before installing anything, remove existing dependency files to avoid conflicts.

Run the following commands in your terminal (inside the project folder):

```bash
# macOS / Linux
rm -rf node_modules package-lock.json

# Windows (Command Prompt)
rmdir /s /q node_modules
del package-lock.json

# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

## 2. Install Dependencies
Since some older libraries (like `ngx-star-rating`) have strict peer dependencies that haven't been updated for Angular 18, you must use the `--legacy-peer-deps` flag.

```bash
npm install --legacy-peer-deps
```

## 3. Run the Application
You can now start the development server.

```bash
npm start
# or
ionic serve
```

The application should now render correctly in your browser.

## Summary of Changes Made
1.  **`package.json`**:
    *   Replaced invalid "21.x" Angular versions with **Angular 18.x**.
    *   Updated TypeScript to **~5.4.0**.
    *   Updated `ngx-cookie-service` to a version compatible with Angular 18 (`^18.0.0`).
    *   Updated `@ionic/angular` to **^8.0.0**.
2.  **`src/main.ts`**:
    *   Removed `applicationProviders` configuration which was causing a crash.
    *   Simplified bootstrapping to standard `platformBrowserDynamic().bootstrapModule(AppModule)`.
3.  **`src/app/app.module.ts`**:
    *   Added `provideZoneChangeDetection({ eventCoalescing: true })` to providers to ensure proper change detection in Angular 18.

If you encounter any issues, please check the console logs for errors.
