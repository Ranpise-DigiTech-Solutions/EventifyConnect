import { createFilter } from '@rollup/pluginutils';
import Obfuscator from 'webpack-obfuscator';

export default function obfuscatorPlugin(options = {}, filterOptions = {}) {
  const filter = createFilter(filterOptions.include, filterOptions.exclude);

  return {
    name: 'vite-plugin-obfuscator',
    enforce: 'post',
    apply: 'build',
    generateBundle(_, bundle) {
      for (const file of Object.keys(bundle)) {
        if (filter(file) && bundle[file].type === 'chunk') {
          const obfuscatedCode = Obfuscator.obfuscate(bundle[file].code, options).getObfuscatedCode();
          bundle[file].code = obfuscatedCode;
        }
      }
    },
  };
}
