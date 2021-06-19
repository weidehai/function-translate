import {terser} from 'rollup-plugin-terser';

export default {
  input: "./src/parser/main.js",
  output: [
    {
      file: "./dist/funcTrans.js",
      name: "FT",
      format: "umd",
    },
    {
      file: "./dist/funcTrans.min.js",
      name: "FT",
      format: "umd",
      plugins: [terser()],
    },
  ],
};
