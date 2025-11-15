import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert'
import { resolve } from 'path';

const root = resolve(__dirname, '');

export default defineConfig({
    base: "/",
    plugins: [
        mkcert()
    ],
    server: {
        host: true,
        port: 3000,
        watch: {
            usePolling: true
        }
    },
    build: {
        emptyOutDir: true,
        minify: true,
        rollupOptions: {
            input: {
                index: resolve(root, "index.html"),
                login: resolve(root, "login", "index.html"),
                register: resolve(root, "register", "index.html"),
                forgotPassword: resolve(root, "forgotPassword", "index.html"),
                resetPassword: resolve(root, "resetPassword", "index.html")
            }
        }
    }
});