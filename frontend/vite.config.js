import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { execSync } from 'child_process';

function gitVersionPlugin() {
  const virtualModuleId = 'virtual:git-version';

  return {
    name: 'git-version', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualModuleId) {
        return virtualModuleId;
      }
    },
    load(id) {
      function git(command) {
        let stdout = null;
        try {
          stdout = execSync(`git ${command}`).toString().trim();
        } catch (error) {
          console.error(error);
        }
        return stdout;
      }

      function commitInfo(ref) {
        return {
          hash: git(`rev-parse ${ref}`),
          date: git(`show -s --format=%cI ${ref}`),
          countSinceStart: parseInt(git(`rev-list --count ${ref}`)),
        };
      }

      if (id === virtualModuleId) {
        const json = JSON.stringify({
          diffShort: git('diff --shortstat HEAD'),
          lastCommit: commitInfo('HEAD'),
          branch: git('rev-parse --abbrev-ref HEAD'),
          date: new Date().toISOString(),
        });
        return `
          const version = ${json};
          export default version;
        `;
      }
    },
  };
}

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/api/v1/documents/sync': { target: 'http://127.0.0.1:8000', ws: true },
    },
  },
  plugins: [topLevelAwait(), wasm(), gitVersionPlugin()],

  // This is only necessary if you are using `SharedWorker` or `WebWorker`, as
  // documented in https://vitejs.dev/guide/features.html#import-with-constructors
  worker: {
    format: 'es',
    plugins: [topLevelAwait(), wasm()],
  },

  optimizeDeps: {
    // This is necessary because otherwise `vite dev` includes two separate
    // versions of the JS wrapper. This causes problems because the JS
    // wrapper has a module level variable to track JS side heap
    // allocations, initializing this twice causes horrible breakage
    exclude: ['@automerge/automerge-wasm'],
  },
});
