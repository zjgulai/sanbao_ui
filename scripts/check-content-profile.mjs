import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = relativePath => readFileSync(resolve(root, relativePath), 'utf8');
const fail = message => {
  console.error(`check-content-profile: ${message}`);
  process.exit(1);
};
const expect = (condition, message) => {
  if (!condition) fail(message);
};
const block = (source, start, end) => {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  return from >= 0 && to >= 0 ? source.slice(from, to) : '';
};

const profile = read('src/content/presentation-profile.ts');
const productProfile = block(profile, 'export const sanbaoProductContentProfile', 'export const qoderResearchContentProfile');
const researchProfile = block(profile, 'export const qoderResearchContentProfile', 'export function getPresentationContentProfile');
expect(productProfile, 'SanBao product profile is missing.');
expect(researchProfile, 'Qoder research profile is missing.');

for (const banned of ['Qoder', 'QDR.', 'QB', '不止于编程']) {
  expect(!productProfile.includes(banned), `product profile must not contain ${banned}.`);
}
expect(productProfile.includes('本地演示'), 'product profile must retain its local-demo boundary.');
expect(productProfile.includes('不授予真实权限'), 'product profile must retain its permission boundary.');
expect(researchProfile.includes('Qoder'), 'research profile must retain Qoder semantics.');
expect(researchProfile.includes('不止于编程'), 'research profile must retain the observed Qoder home label.');

const app = read('src/app.tsx');
const reviewShell = read('src/components/ReviewShell.tsx');
expect(app.includes("type PresentationMode = 'catalog' | 'product' | 'research';"), 'app must define catalog, product, and research presentation modes.');
expect(app.includes("return mode === 'product' || mode === 'research' ? mode : 'catalog';"), 'the root route must default to the complete catalog.');
expect(app.includes("getPresentationMode() === 'catalog' || localStorage.getItem('sanbao-prototype-directory') !== 'closed'"), 'the complete catalog must open its directory on first load.');
expect(app.includes("'SanBao · 完整原型目录'"), 'the complete catalog must have its own document title.');
expect(reviewShell.includes('完整原型目录'), 'review shell must render a SanBao complete-catalog label.');
expect(reviewShell.includes('isDirectoryMode'), 'review shell must preserve the directory for catalog and research modes.');
expect(reviewShell.includes('isPublicPagesArtifact'), 'public Pages research mode must avoid unpublished evidence links.');

const productPages = read('src/pages/ProductPages.tsx');
const controls = read('src/components/Controls.tsx');
const session = read('src/pages/SessionPage.tsx');
for (const [name, source] of [['ProductPages', productPages], ['Controls', controls], ['SessionPage', session]]) {
  expect(source.includes('getPresentationContentProfile') || source.includes('contentProfile'), `${name} must select the shared content profile.`);
}
expect(productPages.includes('SanbaoProductSidebar') && productPages.includes('SanbaoProductHome') && productPages.includes('SanbaoProductAutomationPage'), 'product surfaces must use dedicated SanBao components.');
expect(productPages.includes('QoderResearchSidebar') && productPages.includes('QoderResearchHomePage'), 'research sidebar and home must remain separate.');
expect(controls.includes('SanbaoProductComposer') && controls.includes('QoderResearchComposer'), 'composer must keep product and research variants separate.');
expect(session.includes('SanbaoProductSessionPage') && session.includes('QoderResearchSessionPage'), 'session must keep product and research variants separate.');
expect(session.includes('<strong>Qoder</strong>'), 'research session must retain the Qoder assistant label.');

const productSession = block(session, 'function SanbaoProductSessionPage', 'function PreviewPane');
for (const banned of ['Qoder', 'QDR.', 'QB', 'demo.html', '写入文件']) {
  expect(!productSession.includes(banned), `product session must not expose ${banned}.`);
}
expect(productSession.includes('copy.boundary'), 'product session must render the local-demo boundary.');

console.log('check-content-profile: product/research profile contract passed');
