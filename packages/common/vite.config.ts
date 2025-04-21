import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      include: ['src'],
      //   rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'common',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // 将你不想打包进库的依赖放在这里
      external: [],
      output: {
        globals: {},
        // 保持目录结构
        // preserveModules: true,
        preserveModulesRoot: 'src',

        // 手动分块，将第三方依赖放到单独文件中
        manualChunks: (id) => {
          // 将 node_modules 中的代码单独打包
          if (id.includes('node_modules')) {
            // 可以根据需要返回不同的 chunk 名称
            // 例如按照包名分组
            const packageName = id.toString().split('node_modules/')[1].split('/')[0]
            return `vendor/${packageName}`
          }
        },
      },
    },
    // 确保产物清晰可读
    minify: false,
  },
})
