// vite.config.ts
import { sentryVitePlugin } from "file:///D:/Code/projets/Celestialy/celestialy-website/node_modules/.pnpm/@sentry+vite-plugin@2.21.1/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/Code/projets/Celestialy/celestialy-website/node_modules/.pnpm/vite@5.3.2_@types+node@20.14.9/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Code/projets/Celestialy/celestialy-website/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.3.2_@types+node@20.14.9__vue@3.4.31_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueDevTools from "file:///D:/Code/projets/Celestialy/celestialy-website/node_modules/.pnpm/vite-plugin-vue-devtools@7.3.5_rollup@4.18.0_vite@5.3.2_@types+node@20.14.9__vue@3.4.31_typescript@5.4.5_/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import tailwind from "file:///D:/Code/projets/Celestialy/celestialy-website/node_modules/.pnpm/tailwindcss@3.4.4/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///D:/Code/projets/Celestialy/celestialy-website/node_modules/.pnpm/autoprefixer@10.4.19_postcss@8.4.39/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_import_meta_url = "file:///D:/Code/projets/Celestialy/celestialy-website/vite.config.ts";
var vite_config_default = defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    }
  },
  plugins: [vue(), VueDevTools(), sentryVitePlugin({
    org: "celestialy-organization",
    project: "celestialy-website"
  })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  build: {
    sourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxDb2RlXFxcXHByb2pldHNcXFxcQ2VsZXN0aWFseVxcXFxjZWxlc3RpYWx5LXdlYnNpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXENvZGVcXFxccHJvamV0c1xcXFxDZWxlc3RpYWx5XFxcXGNlbGVzdGlhbHktd2Vic2l0ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovQ29kZS9wcm9qZXRzL0NlbGVzdGlhbHkvY2VsZXN0aWFseS13ZWJzaXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gXCJAc2VudHJ5L3ZpdGUtcGx1Z2luXCI7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBWdWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXHJcblxyXG5pbXBvcnQgdGFpbHdpbmQgZnJvbSBcInRhaWx3aW5kY3NzXCJcclxuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tIFwiYXV0b3ByZWZpeGVyXCJcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgY3NzOiB7XHJcbiAgICBwb3N0Y3NzOiB7XHJcbiAgICAgIHBsdWdpbnM6IFt0YWlsd2luZCgpLCBhdXRvcHJlZml4ZXIoKV0sXHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIHBsdWdpbnM6IFt2dWUoKSwgVnVlRGV2VG9vbHMoKSwgc2VudHJ5Vml0ZVBsdWdpbih7XHJcbiAgICBvcmc6IFwiY2VsZXN0aWFseS1vcmdhbml6YXRpb25cIixcclxuICAgIHByb2plY3Q6IFwiY2VsZXN0aWFseS13ZWJzaXRlXCJcclxuICB9KV0sXHJcblxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgYnVpbGQ6IHtcclxuICAgIHNvdXJjZW1hcDogdHJ1ZVxyXG4gIH1cclxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQW1VLFNBQVMsd0JBQXdCO0FBQ3BXLFNBQVMsZUFBZSxXQUFXO0FBRW5DLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGlCQUFpQjtBQUV4QixPQUFPLGNBQWM7QUFDckIsT0FBTyxrQkFBa0I7QUFSa0wsSUFBTSwyQ0FBMkM7QUFXNVAsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ1AsU0FBUyxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUVBLFNBQVMsQ0FBQyxJQUFJLEdBQUcsWUFBWSxHQUFHLGlCQUFpQjtBQUFBLElBQy9DLEtBQUs7QUFBQSxJQUNMLFNBQVM7QUFBQSxFQUNYLENBQUMsQ0FBQztBQUFBLEVBRUYsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQSxFQUVBLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxFQUNiO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
