import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import nodePolyfills from "rollup-plugin-polyfill-node";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173, // Ensure Vite runs on 5173
        strictPort: true, // Prevent it from switching ports
        host: true, // Allows external access
        allowedHosts: [
            "localhost",
            "dev-app.energizelms.com",
            "test-app.energizelms.com",
            "app.energizelms.com",
            "2bb3298d-cd51-4802-9471-370f0862c772-00-1drf3o68jzv9b.worf.replit.dev", // Add Replit's domain here
        ],
    },
    preview: {
        host: true,
        allowedHosts: [
            "localhost",
            "dev-app.energizelms.com",
            "test-app.energizelms.com",
            "app.energizelms.com",
            "2bb3298d-cd51-4802-9471-370f0862c772-00-1drf3o68jzv9b.worf.replit.dev",
        ],
    },
    build: {
        outDir: "dist",
        rollupOptions: {
            plugins: [nodePolyfills()],
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: "globalThis",
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                }),
                NodeModulesPolyfillPlugin(),
            ],
        },
    },
    resolve: {
        alias: {
            // This Rollup alias is used to make sure that the Node.js built-in modules
            // are resolved to the polyfill versions provided by the `rollup-plugin-node-polyfills` plugin.
            util: "rollup-plugin-node-polyfills/polyfills/util",
            sys: "util",
            events: "rollup-plugin-node-polyfills/polyfills/events",
            stream: "rollup-plugin-node-polyfills/polyfills/stream",
            path: "rollup-plugin-node-polyfills/polyfills/path",
            querystring: "rollup-plugin-node-polyfills/polyfills/qs",
            punycode: "rollup-plugin-node-polyfills/polyfills/punycode",
            url: "rollup-plugin-node-polyfills/polyfills/url",
            string_decoder:
                "rollup-plugin-node-polyfills/polyfills/string-decoder",
            http: "rollup-plugin-node-polyfills/polyfills/http",
            https: "rollup-plugin-node-polyfills/polyfills/http",
            os: "rollup-plugin-node-polyfills/polyfills/os",
            assert: "rollup-plugin-node-polyfills/polyfills/assert",
            constants: "rollup-plugin-node-polyfills/polyfills/constants",
            _stream_duplex:
                "rollup-plugin-node-polyfills/polyfills/readable-stream/duplex",
            _stream_passthrough:
                "rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough",
            _stream_readable:
                "rollup-plugin-node-polyfills/polyfills/readable-stream/readable",
            _stream_writable:
                "rollup-plugin-node-polyfills/polyfills/readable-stream/writable",
            _stream_transform:
                "rollup-plugin-node-polyfills/polyfills/readable-stream/transform",
            timers: "rollup-plugin-node-polyfills/polyfills/timers",
            console: "rollup-plugin-node-polyfills/polyfills/console",
            vm: "rollup-plugin-node-polyfills/polyfills/vm",
            zlib: "rollup-plugin-node-polyfills/polyfills/zlib",
            tty: "rollup-plugin-node-polyfills/polyfills/tty",
            domain: "rollup-plugin-node-polyfills/polyfills/domain",
        },
    },
});
