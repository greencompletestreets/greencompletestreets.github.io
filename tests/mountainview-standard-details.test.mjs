#!/usr/bin/env node
// Lightweight, dependency-free content checks for the Mountain View
// Standard Details Update page. The site is plain static HTML with no
// build step and no existing test framework, so this is a standalone
// Node script (built-in modules only) rather than a framework-specific
// suite -- run with: node tests/mountainview-standard-details.test.mjs
//
// It checks the things that matter for this page staying correct as it
// gets edited over time: the route exists, required facts and sources
// are present in the markup, the drawing gallery covers the sheets it's
// supposed to, and every referenced image/document asset actually
// resolves on disk. It does NOT re-verify layout/overflow -- that was
// checked separately with a headless-Chrome DOM measurement (see the
// delivery notes), since a static grep can't measure computed layout.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const PAGE_PATH = join(REPO_ROOT, 'cities/mountainview-ca/policies/standard-details/index.html');

let failures = 0;
let passes = 0;

function check(label, condition) {
  if (condition) {
    passes++;
    console.log(`  ok  - ${label}`);
  } else {
    failures++;
    console.log(`FAIL  - ${label}`);
  }
}

console.log('Mountain View Standard Details Update -- page checks\n');

// 1. The route builds: the file exists and is non-empty static HTML.
check('page file exists at cities/mountainview-ca/policies/standard-details/index.html', existsSync(PAGE_PATH));

if (!existsSync(PAGE_PATH)) {
  console.log('\nCannot continue -- page file is missing.');
  process.exit(1);
}

const html = readFileSync(PAGE_PATH, 'utf8');

// 2. Title renders.
check('<title> contains "Mountain View Standard Details Update"', /<title>[^<]*Mountain View Standard Details Update[^<]*<\/title>/.test(html));
check('<h1> contains "Mountain View Standard Details Update"', /<h1[^>]*>Mountain View Standard Details Update<\/h1>/.test(html));

// 3. Breadcrumb (now inside the dark hero) shows Mountain View -> Policies.
check('breadcrumb contains "Mountain View" link', /<a href="\.\.\/\.\.\/index\.html">Mountain View<\/a>/.test(html));
check('breadcrumb contains a "Policies" link', /<a href="\.\.\/">Policies<\/a>/.test(html));
check('breadcrumb current-page marker is "Standard Details Update"', /aria-current="page">Standard Details Update</.test(html));

// 4. Required facts appear.
check('"CIP 27-27" (or "27-27") appears', html.includes('27-27'));
check('"$54,000" funding figure appears', html.includes('$54,000'));
check('"Conveyance Tax" appears', html.includes('Conveyance Tax'));
check('"early 2028" / "Early 2028" appears', /early 2028/i.test(html));
check('"Q2 2027" appears', html.includes('Q2 2027'));
check('"Q2 2027" is described as expected, not confirmed (near "expected" and "not a confirmed" wording)', /Q2 2027[^.]*expected/.test(html) || /expected review period, not a confirmed hearing date/.test(html));
check('"Parks & Recreation Commission" (or "Parks and Recreation Commission") appears', /Parks (&amp;|and) Recreation Commission/.test(html));
check('"Bicycle/Pedestrian Advisory Committee" appears (peer body, spelled out)', html.includes('Bicycle/Pedestrian Advisory Committee'));
check('"B/PAC" appears (compact form used in hero/metadata)', html.includes('B/PAC'));
check('bare "BPAC" (no slash) no longer used', !html.includes('BPAC'));
check('"Council Transportation Committee" appears', html.includes('Council Transportation Committee'));
check('"CTC" appears (compact form)', html.includes('>CTC<'));
check('the three review bodies are grouped as peers (sd-flow__peers)', html.includes('sd-flow__peers'));
check('the "shown as peers / no chronological order" meta-commentary has been removed', !html.includes('the City doesn&#8217;t establish a chronological order'));
check('Municipal Code section sign "27.58" appears', html.includes('27.58'));
check('the exact verbatim staff quote appears', html.includes('Staff&#8217;s past practice for updating standard details has been to revise and publish details as needed'));
check('no "Mayor Ramos" or invented response boxes', !/Mayor Ramos|I agree/.test(html));

// 4b. Question 6 is explicitly identified as the primary source behind
//     "How the review will work", with its own distinct citation and
//     link -- not a generic "staff response, April 2026" attribution.
check('"Question 6" appears', html.includes('Question 6'));
check('"Objective Design Standards" appears', html.includes('Objective Design Standards'));
check('"April 14, 2026" appears', html.includes('April 14, 2026'));
check('quote attribution cites Question 6 by name (not the old generic attribution)', html.includes('Council Questions, Question 6, April 14, 2026'));
check('generic "staff response, April 2026" attribution no longer used', !html.includes('City of Mountain View staff response, April 2026'));
check('"View Question 6 and staff response" link text present', html.includes('View Question 6 and staff response'));
check('Question 6 links to the official Council Questions attachment (a7f8d019 GUID)', /View Question 6 and staff response<\/a>/.test(html) && html.includes('mountainview.legistar.com/View.ashx?GUID=a7f8d019'));

// 4c. April 14, 2026 City Council meeting is linked separately from
//     Question 6 (a distinct source: the meeting record vs. the
//     Council Questions attachment).
const meetingUrl = 'https://mountainview.legistar.com/MeetingDetail.aspx?G=37932D0B-039B-4529-B6D8-73445A1D4799&GUID=1710BF87-89BF-487C-8122-64FA53B82D37&ID=1352178&Options=&Search=';
const meetingUrlEncoded = meetingUrl.replace(/&/g, '&amp;');
check('official April 14 Council meeting URL appears', html.includes(meetingUrlEncoded));
check('"View April 14 Council meeting" link text present (timeline and/or sources)', html.includes('View April 14 Council meeting'));

// 4d. No decorative external-link arrows remain anywhere on the page.
check('no ↗ (&#8599;) arrow icons remain anywhere on the page', !html.includes('&#8599;'));

// 5. B/PAC work-plan source link resolves/renders correctly, and is
//    reachable from multiple points on the page (hero, review section,
//    sources) without the reader needing to scroll to find it.
const bpacUrl = 'https://mountainview.legistar.com/View.ashx?GUID=B8C379FF-FC61-4130-AD2E-95B203668125&ID=1378443&M=PA';
const bpacUrlEncoded = bpacUrl.replace(/&/g, '&amp;');
check('B/PAC work plan link appears in the hero', html.includes(bpacUrlEncoded));
check('B/PAC work plan link appears at least 3 times (hero status + hero line + review/sources)', (html.match(new RegExp(bpacUrlEncoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length >= 3);
check('"View B/PAC work plan" or "View official B/PAC work plan" link text present', /View (official )?B\/PAC work plan/.test(html));
check('hero Public Review field links "B/PAC · Q2 2027" to the work plan', /B\/PAC &middot; Q2 2027<\/a>/.test(html));

// 5b. CTC links to an official City page.
check('CTC links to the official City Council Transportation Committee page', />CTC<\/a>/.test(html) && html.includes('mountainview.gov/our-city/city-council/councilmembers/council-subcommittees/transportation-subcommittee'));

// 6. Hero engineering image (A-22) resolves and is a real asset, not
//    a placeholder/AI image.
check('hero uses the real A-22 asset', html.includes('mv-standard-detail-a22-visibility-triangle.png'));

// 7. Every sheet has at least one working lightbox trigger, and its
//    evidenceRecords entry exists.
const requiredSheets = ['sd-a1', 'sd-a2', 'sd-a3', 'sd-a4', 'sd-a5', 'sd-a6', 'sd-a7', 'sd-a7a', 'sd-a8', 'sd-a8a', 'sd-a9', 'sd-a22', 'sd-a23'];
for (const id of requiredSheets) {
  check(`page includes a lightbox trigger for sheet "${id}"`, html.includes(`data-evidence-id="${id}"`));
  check(`evidenceRecords includes sheet "${id}"`, new RegExp(`'${id}':\\s*\\{`).test(html));
}
const highlightSheets = ['A-1', 'A-4', 'A-5', 'A-22', 'A-23'];
for (const num of highlightSheets) {
  check(`sheet number "${num}" is labeled on the page`, html.includes(`>${num}<`) || html.includes(`${num} &mdash;`));
}
// A-4 and A-5 get the "feature" star treatment in the gallery.
check('A-4 gallery card has the feature/star treatment', /data-evidence-id="sd-a4">\s*<span class="sd-multiple__star"/.test(html));
check('A-5 gallery card has the feature/star treatment', /data-evidence-id="sd-a5">\s*<span class="sd-multiple__star"/.test(html));

// 8. Source links render (both a local archived copy and an original
//    City / authoritative external link for each cited source).
check('Council Questions PDF (local archive) link present', html.includes('documents/standard-details/mountain-view-council-questions-2026-04-14-item-3-1-cip.pdf'));
check('Council Questions original Legistar link present', html.includes('mountainview.legistar.com/View.ashx?GUID=a7f8d019'));
check('Standard Provisions & Details PDF (local archive) link present', html.includes('documents/standard-details/mountain-view-standard-provisions-and-details-2026-08.pdf'));
check('Standard Provisions & Details original City link present', html.includes('mountainview.gov/our-city/departments/public-works/land-development'));
check('Municipal Code link present', html.includes('library.municode.com/ca/mountain_view/codes/'));
check('ATP project page link present', html.includes('collaborate.mountainview.gov/atp'));

// 9. BUFP cross-link resolves to the real sibling page.
check('links to the BUFP page at ../../plans/bufp/', html.includes('href="../../plans/bufp/"'));

// 9b. Municipal Code section: plain-language definition, and contextual
//     links for the Code landing page, §27.58, Article V, and Standard
//     Details -- not just a single link buried in Sources.
check('"What is the Municipal Code?" plain-language definition present', html.includes('What is the Municipal Code?'));
check('Mountain View Municipal Code links to the official Code landing page', /Mountain View Municipal Code<\/a>/.test(html));
const municodeUrl = 'https://library.municode.com/ca/mountain_view/codes/code_of_ordinances';
check('Municipal Code links use the verified working landing-page URL', html.includes(municodeUrl));
check('§27.58 is linked inline (not just cited as plain text)', /Municipal Code &sect;27\.58<\/a>/.test(html));
check('Article V is linked inline', /Article V<\/a>/.test(html));
check('Standard Details is linked inline in the relationship diagram', /Standard Details<\/a><\/p>\s*<p class="sd-flow__desc">Technical dimensions/.test(html));
check('the relationship diagram carries secondary descriptive text per node (sd-flow__desc)', html.includes('sd-flow__desc'));
check('the diagram does not overclaim exclusivity (says "one path")', html.includes('This shows one path through which street design gets regulated'));
check('the page is honest that a stable §27.58 deep link could not be verified', html.includes('a stable deep link could not be verified'));

// 9c. Vision Zero connection: SR-9/SR-10, linked inline and in Sources.
check('"Vision Zero Action Plan" is linked inline', /Vision Zero Action Plan<\/a>/.test(html));
check('SR-9 is cited', html.includes('SR-9'));
check('SR-10 is cited', html.includes('SR-10'));
check('SR-10 quote about updating City standard details appears', html.includes('Update City standard details to reflect Vision Zero best practices'));
check('SR-9 quote about NACTO/PROWAG guidance appears', html.includes('adopt NACTO, PROWAG and/or other best practice guidance to inform engineering judgment'));
check('Vision Zero Action Plan appears in Sources', /Vision Zero Action Plan[^<]*<\/p>[\s\S]{0,400}?View Vision Zero Action Plan/.test(html));
const visionZeroUrl = 'https://mountainview.legistar.com/View.ashx?M=F&ID=13283293&GUID=79E9CBB3-E8AA-421A-BC4E-B1A04A1F35B6';
check('Vision Zero Action Plan URL is the verified PDF (not an unverified general page)', html.includes(visionZeroUrl.replace(/&/g, '&amp;')));

// 9d. ATP Existing Conditions connection: the all-ages-and-abilities
//     finding, attributed and linked inline.
check('"ATP Existing Conditions and Needs Summary" is linked inline', /ATP Existing Conditions and Needs Summary<\/a>/.test(html));
check('the all-ages-and-abilities finding appears, attributed to the 2023 ATP report', html.includes('the current standards do not reflect streets that support active transportation for all ages and abilities'));
check('A-1 through A-9 are described as the ATP’s starting-point cross-sections', html.includes('Standard Details A-1 through A-9 as the typical street cross-sections'));

// 9e. Compact "Related standards + code" list -- 3-5 verified items.
check('"Related standards + code" section present', html.includes('Related standards + code'));
const relatedItemCount = (html.match(/sd-related__title/g) || []).length;
check('Related standards + code has between 3 and 5 items', relatedItemCount >= 3 && relatedItemCount <= 5);
check('Related standards + code cites its source (ATP Code Review Table 9)', html.includes('Table 9'));

// 10. Every referenced local image asset resolves on disk.
const imageDir = join(REPO_ROOT, 'images/cities/mountainview-ca/standard-details');
const imageFiles = [
  'mv-standard-detail-a1-sidewalk.png',
  'mv-standard-detail-a2-60-foot-street.png',
  'mv-standard-detail-a3-street-sections.png',
  'mv-standard-detail-a4-four-lane-arterial.png',
  'mv-standard-detail-a5-six-lane-arterial.png',
  'mv-standard-detail-a6-curb-gutter.png',
  'mv-standard-detail-a7-sidewalk-driveway.png',
  'mv-standard-detail-a7a-level-sidewalk.png',
  'mv-standard-detail-a8-detached-sidewalk.png',
  'mv-standard-detail-a8a-detached-sidewalk.png',
  'mv-standard-detail-a9-driveway-conform.png',
  'mv-standard-detail-a22-visibility-triangle.png',
  'mv-standard-detail-a23-intersection-visibility.png'
];
for (const file of imageFiles) {
  check(`image asset resolves on disk: ${file}`, existsSync(join(imageDir, file)));
  check(`image asset is referenced in the page: ${file}`, html.includes(`standard-details/${file}`));
}

const imgSrcPattern = /<img[^>]+src="([^"]+standard-details\/[^"]+)"/g;
let match;
let imgSrcChecks = 0;
while ((match = imgSrcPattern.exec(html))) {
  const relPath = match[1].replace(/^(\.\.\/)+/, '');
  imgSrcChecks++;
  check(`<img src> resolves: ${relPath}`, existsSync(join(REPO_ROOT, relPath)));
}
check('found at least 13 <img> tags referencing standard-details images', imgSrcChecks >= 13);

// 11. Document assets resolve on disk.
const docDir = join(REPO_ROOT, 'documents/standard-details');
check('Council Questions PDF exists on disk', existsSync(join(docDir, 'mountain-view-council-questions-2026-04-14-item-3-1-cip.pdf')));
check('Standard Provisions & Details PDF exists on disk', existsSync(join(docDir, 'mountain-view-standard-provisions-and-details-2026-08.pdf')));

// 12. Policies index page exists and links to this page; hub page links
//     to the Policies index (route is discoverable).
const policiesIndexPath = join(REPO_ROOT, 'cities/mountainview-ca/policies/index.html');
check('Policies index page exists', existsSync(policiesIndexPath));
if (existsSync(policiesIndexPath)) {
  const policiesHtml = readFileSync(policiesIndexPath, 'utf8');
  check('Policies index links to standard-details/', policiesHtml.includes('href="standard-details/"'));
}
const hubPath = join(REPO_ROOT, 'cities/mountainview-ca/index.html');
if (existsSync(hubPath)) {
  const hubHtml = readFileSync(hubPath, 'utf8');
  check('Mountain View hub page links to policies/standard-details/', hubHtml.includes('href="policies/standard-details/"'));
}

// 13. On-page nav (mobile bar + desktop sidebar) both carry the same
//     9 section links, and every target id exists on the page exactly
//     once (catches duplicate-id regressions like the earlier
//     id="sources" bug).
const navItems = [
  ['#what-is-updated', 'What is being updated'],
  ['#public-review', 'Public review'],
  ['#current-standards', 'Current standards'],
  ['#sidewalks-driveways', 'Sidewalks & driveways'],
  ['#visibility', 'Visibility'],
  ['#what-to-watch', 'What to watch'],
  ['#municipal-code', 'Municipal Code'],
  ['#timeline', 'Timeline'],
  ['#sources', 'Sources']
];
for (const [href, label] of navItems) {
  const idName = href.slice(1);
  check(`mobile nav has "${label}" -> ${href}`, html.includes(`onpage-nav__link" href="${href}">${label.replace('&', '&amp;')}<`));
  check(`sidebar nav links to ${href}`, html.includes(`<a href="${href}">`));
  const idCount = (html.match(new RegExp(`id="${idName}"`, 'g')) || []).length;
  check(`target id "${idName}" exists on the page exactly once`, idCount === 1);
}

// 14. Structural sanity: sticky sidebar + mobile collapsible nav both
//     present (two separate nav elements, CSS toggles which is visible).
check('desktop sidebar nav markup present', html.includes('class="sd-sidebar"'));
check('mobile collapsible nav markup present', html.includes('sd-onpage-nav-mobile'));

console.log(`\n${passes} passed, ${failures} failed.`);
process.exit(failures > 0 ? 1 : 0);
