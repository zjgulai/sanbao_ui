import { readdir, readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
const styleFiles = (await readdir('src/styles')).filter(x => x.endsWith('.css')).sort();
if (!styleFiles.length) throw new Error('No prototype styles found');
await writeFile('dist/styles.css', (await Promise.all(styleFiles.map(x => readFile(`src/styles/${x}`, 'utf8')))).join('\n'));
await copyFile('index.html', 'dist/index.html');
await mkdir('dist/research', { recursive: true });
for (const file of ['batch21-capture.json', 'batch20-capture.md', 'batch19-capture.md', 'batch18-capture.md', 'batch17-capture.md', 'batch16-capture.md', 'batch15-capture.md', 'batch14-capture.md', 'batch13-capture.md', 'batch10-capture.md', 'batch11-capture.md', 'batch12-capture.md', 'batch09-capture.md', 'batch08-capture.md', 'batch07-capture.md', 'batch06-capture.md', 'batch05-capture.md', 'batch04-capture.md', 'batch03-capture.md', 'sanbao-prototype-design.md', 'sanbao-baseline-review.md', 'qoder-observed-states.md', 'qoder-coverage-register.csv']) {
  await copyFile(`../../docs/research/qoder/${file}`, `dist/research/${file}`);
}
await mkdir('dist/research/batch21-evidence', { recursive: true });
for (const file of ['openai-compatible.png', 'openai-api-menu.png', 'anthropic-compatible.png']) {
  await copyFile(`../../docs/research/qoder/batch21-evidence/${file}`, `dist/research/batch21-evidence/${file}`);
}
console.log(`Prepared static app with ${styleFiles.length} stylesheet(s).`);
