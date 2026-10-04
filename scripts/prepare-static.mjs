import { readdir, readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
const styleFiles = (await readdir('src/styles')).filter(x => x.endsWith('.css')).sort();
if (!styleFiles.length) throw new Error('No prototype styles found');
await writeFile('dist/styles.css', (await Promise.all(styleFiles.map(x => readFile(`src/styles/${x}`, 'utf8')))).join('\n'));
await copyFile('index.html', 'dist/index.html');
const brandFiles = ['A_StarSail_Product.svg', 'A_StarSail_Product_dark.svg', 'A_StarSail_Product_light.svg', 'A_StarSail_Product_symbol.svg', 'A_StarSail_Product_symbol_dark.svg', 'A_StarSail_Product_symbol_light.svg'];
await mkdir('dist/assets/brand', { recursive: true });
for (const file of brandFiles) {
  await copyFile(`src/assets/brand/${file}`, `dist/assets/brand/${file}`);
}
// 研究素材目录：主仓布局在 ../../docs/research/qoder；独立 worktree 布局在 docs/research/qoder。
// 两处都不存在时跳过并告警，不静默假装已复制。
const researchRoot = ['../../docs/research/qoder', 'docs/research/qoder'].find(root => existsSync(root));
if (researchRoot) {
  await mkdir('dist/research', { recursive: true });
  for (const file of ['batch21-capture.json', 'batch20-capture.md', 'batch19-capture.md', 'batch18-capture.md', 'batch17-capture.md', 'batch16-capture.md', 'batch15-capture.md', 'batch14-capture.md', 'batch13-capture.md', 'batch10-capture.md', 'batch11-capture.md', 'batch12-capture.md', 'batch09-capture.md', 'batch08-capture.md', 'batch07-capture.md', 'batch06-capture.md', 'batch05-capture.md', 'batch04-capture.md', 'batch03-capture.md', 'sanbao-prototype-design.md', 'sanbao-baseline-review.md', 'qoder-observed-states.md', 'qoder-coverage-register.csv']) {
    await copyFile(`${researchRoot}/${file}`, `dist/research/${file}`);
  }
  await mkdir('dist/research/batch21-evidence', { recursive: true });
  for (const file of ['openai-compatible.png', 'openai-api-menu.png', 'anthropic-compatible.png']) {
    await copyFile(`${researchRoot}/batch21-evidence/${file}`, `dist/research/batch21-evidence/${file}`);
  }
} else {
  console.warn('prepare-static: research source (../../docs/research/qoder or docs/research/qoder) not found; skipped dist/research copies.');
}
console.log(`Prepared static app with ${styleFiles.length} stylesheet(s).`);
