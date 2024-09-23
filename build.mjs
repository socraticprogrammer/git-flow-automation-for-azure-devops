import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/main.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  outfile: "./dist/out.js",
});
