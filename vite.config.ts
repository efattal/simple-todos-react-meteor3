import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { meteor } from 'meteor-vite/plugin';

export default defineConfig({
    plugins: [
        react(),
        meteor({
            clientEntry: "imports/entrypoint/vite.tsx",
            // This instructs Vite to not bundle react and react-dom as they will be bundled by Meteor instead.
            externalizeNpmPackages: ['react', 'react-dom'], 
            stubValidation: {
                warnOnly: true,
                // React uses conditional exports for production and development environments
                // Meteor-Vite ignores these when preparing a stub file for externalized dependencies
                // This prevents warning messages from flooding the console when running your app.
                ignoreDuplicateExportsInPackages: ['react', 'react-dom'],
            },
            meteorStubs: {
                debug: false
            },
        })
    ],
});