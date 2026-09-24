import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';

const artifactDirectory = '_site';
const brandFiles = [
  'A_StarSail_Product.svg',
  'A_StarSail_Product_dark.svg',
  'A_StarSail_Product_light.svg',
  'A_StarSail_Product_symbol.svg',
  'A_StarSail_Product_symbol_dark.svg',
  'A_StarSail_Product_symbol_light.svg',
];
const styleFiles = (await readdir('src/styles')).filter(file => file.endsWith('.css')).sort();

if (!styleFiles.length) {
  throw new Error('No prototype styles found');
}

await rm(artifactDirectory, { force: true, recursive: true });
await mkdir(`${artifactDirectory}/assets/brand`, { recursive: true });
await copyFile('index.html', `${artifactDirectory}/index.html`);
await copyFile('dist/main.js', `${artifactDirectory}/main.js`);
await copyFile('dist/main.js.map', `${artifactDirectory}/main.js.map`);
await writeFile(
  `${artifactDirectory}/styles.css`,
  (await Promise.all(styleFiles.map(file => readFile(`src/styles/${file}`, 'utf8')))).join('\n'),
);

for (const file of brandFiles) {
  await copyFile(`src/assets/brand/${file}`, `${artifactDirectory}/assets/brand/${file}`);
}

console.log(`Prepared public prototype artifact with ${styleFiles.length} stylesheet(s).`);
