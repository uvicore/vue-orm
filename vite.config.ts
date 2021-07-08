import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import dts from "vite-plugin-dts"


export default defineConfig({
  // resolve: {
  //   conditions: ["import", "browser", "module", "default"],
  //   extensions: [".js", ".ts", ".vue", ".json"]
  // },
  // json: {
  //   namedExports: false,
  //   stringify: true
  // },
  //esbuild: { include: ['js', 'ts'] },
  build: {
    minify: false,
    //outDir: "./dist",
    emptyOutDir: true,
    lib: {
      entry: "lib/index.ts",
      name: "auth",
      fileName: "bundle",
      //formats: ["es", "cjs", "umd", "iife"]
      formats: ["es", "umd"]
      //formats: ["es"]
      //formats: ["es", "cjs"]
    },
    rollupOptions: {
      external: [
        "vue",
        "vue-oidc-client",
        "pinia",
      ],
      output: {
        //sourcemap: "inline",
        globals: {
          "vue": "Vue",
          "vue-oidc-client": "vue-oidc-client",
          "pinia": "pinia",
        }
      },
    }
  },
  plugins: [
    vue(),
    dts({
      staticImport: true,
      insertTypesEntry: true,
      cleanVueFileName: true,
      clearPureImport: true
    })
  ]
})
