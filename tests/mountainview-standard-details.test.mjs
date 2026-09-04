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
const CSS_PATH = join(REPO_ROOT, 'assets/css/main.css');

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
check('quote attribution cites Question 6 by name (not the old generic attribution)', /Council Questions, Question 6<\/a>, April 14, 2026/.test(html));
check('generic "staff response, April 2026" attribution no longer used', !html.includes('City of Mountain View staff response, April 2026'));
check('"Council Questions, Question 6" is itself the clickable link (inline-link practice, not a separate action line)', /<a href="[^"]*a7f8d019[^"]*"[^>]*>Council Questions, Question 6<\/a>/.test(html));
check('no separate "View Question 6..." action line beneath the review-process quote (sd-review-quote__link removed)', !html.includes('sd-review-quote__link'));

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

// 5b. Inline-link cleanup pass: when a source is already named in the
// surrounding text, the source name itself is the link -- no separate
// "View ..." action line duplicating a link that's right above it. The
// Sources & Original Documents section is exempt (it's a bibliography).
const sourcesStart = html.indexOf('id="sources"');
const beforeSources = html.slice(0, sourcesStart);
check('hero B/PAC line links "B/PAC&#8217;s FY 2026-27 work plan" inline, no separate "View B/PAC work plan" line', /per <a[^>]*>B\/PAC&#8217;s FY 2026&ndash;27 work plan<\/a> \(a work-plan/.test(html));
check('B/PAC work-plan milestone callout links the work plan name inline, not a separate action line', /<a[^>]*>B\/PAC&#8217;s FY 2026&ndash;27 Work Plan<\/a> lists/.test(html));
check('no "sd-callout__link" / "sd-review-quote__link" / "sd-provision__link" action-line classes remain (all converted to inline links)', !html.includes('sd-callout__link') && !html.includes('sd-review-quote__link') && !html.includes('sd-provision__link'));
check('no "View ..." action-line link text appears before the Sources section', !/>View [^<]+<\/a>/.test(beforeSources));
check('Existing rules provision titles are the only links needed (redundant "View official source" lines removed)', !beforeSources.includes('View official source'));
check('timeline links ATP Existing Conditions / Code Review inline', /<a[^>]*>ATP Existing Conditions \/ Code Review<\/a> identifies issues/.test(html));
check('timeline links Vision Zero Action Plan inline', /<a[^>]*>Vision Zero Action Plan<\/a> includes SR-9/.test(html));
check('timeline links Council CIP Study Session and Council Questions Question 6 inline', /<a[^>]*>Council CIP Study Session<\/a> and <a[^>]*>Council Questions Question 6<\/a> provide/.test(html));
check('timeline links CIP Project 27-27 inline', /<a[^>]*>CIP Project 27-27<\/a> &mdash; Mountain View Standards Update/.test(html));
check('public-review intro links "April 14, 2026 City Council CIP Study Session" inline', /<a[^>]*>April 14, 2026 City Council CIP Study Session<\/a>/.test(html));

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
check('the page is honest that a stable Municipal Code deep link could not be verified', html.includes('a stable per-section deep link could not be verified'));

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

// 9e. "Existing rules that shape walking + bicycling" -- its own standalone
//     section (not nested under Policy connections), organized as
//     continuous reference sections (not a card grid) with thematic
//     groups of quoted/excerpted provisions, source-type badges, and a
//     corrected Municipal Code bicycle-parking citation.
check('the old "Related standards + code" mini-list has been removed', !html.includes('Related standards + code'));
check('"sd-related" component classes are no longer used', !html.includes('sd-related__'));
check('the old card-grid classes (sd-rules-group, sd-provision) are no longer used', !html.includes('sd-rules-group') && !html.includes('sd-provision'));
check('"Existing rules that shape walking + bicycling" heading present', html.includes('Existing rules that shape walking + bicycling'));
check('#existing-rules section exists', /<section class="sd-block" id="existing-rules">/.test(html));
check('the intro paragraph appears verbatim', html.includes("Standard Details are not the City&#8217;s only design rules."));
check('at least 5 thematic sd-refgroup blocks present', (html.match(/class="sd-refgroup"/g) || []).length >= 5);
check('at least 11 sd-ref reference blocks present (each provision now its own block)', (html.match(/class="sd-ref"/g) || []).length >= 11);
check('the old shared-surface classes (sd-refgroup__surface, sd-refgroup__rule) are no longer used -- every provision is its own separate white block', !html.includes('sd-refgroup__surface') && !html.includes('sd-refgroup__rule'));
check('sd-refgroup__list wraps each group\'s provisions (flex + gap, not a shared white background)', (html.match(/sd-refgroup__list/g) || []).length >= 5);
check('"Sidewalks + frontage" group present', html.includes('Sidewalks + frontage'));
check('"Driveways + crossings" group present', html.includes('Driveways + crossings'));
check('"Bicycle access" group present', html.includes('Bicycle access'));
check('"Visibility + landscaping" group present', html.includes('Visibility + landscaping'));
check('"Street width + public improvements" group present', html.includes('Street width + public improvements'));

// The incorrect §36.22.50 citation must be gone; the corrected §36.32.50 /
// §36.32.85 pair must be present, with §36.32.50 visually subordinate.
check('incorrect "§36.22.50" citation no longer appears anywhere on the page', !html.includes('36.22.50'));
check('corrected §36.32.85 (bicycle parking facilities) is cited', html.includes('&sect;36.32.85'));
check('corrected §36.32.50 (required number of parking spaces) is cited', html.includes('&sect;36.32.50'));
check('the exact §36.32.85 quote (convenient access) appears', html.includes('Convenient access to bicycle parking facilities shall be provided.'));
check('the exact §36.32.85 quote (curb ramps) appears', html.includes('curb ramps shall be installed where appropriate'));
check('§36.32.50 is its own separate white block with its own anchor (not nested inside §36.32.85\'s block)', /<div class="sd-ref" id="code-36-32-50">/.test(html));
check('the old nested "subordinate" sub-card treatment is gone', !html.includes('sd-ref__subordinate'));

// Source-type badges distinguish current Code language from older/other
// authority types (Standard Design Criteria, Standard Detail, project
// condition, other City/state standards) -- source age and status must
// not be visually conflated (task: "do not visually imply ... identical
// status").
check('Municipal Code source badge used', html.includes('sd-ref__source--code'));
check('Standard Design Criteria source badge used', html.includes('sd-ref__source--sdc'));
check('Standard Detail source badge used', html.includes('sd-ref__source--detail'));
check('Project condition source badge used', html.includes('sd-ref__source--project'));
check('"2002 Standard Design Criteria" is dated distinctly from current Code provisions', html.includes('2002 Standard Design Criteria') || html.includes('Standard Design Criteria (2002)'));
check('Municipal Code badges are labeled "current"', (html.match(/Municipal Code &middot; current/g) || []).length >= 5);

// Verbatim City-language provisions (§27.57, §27.60, §27.61) are present
// with the exact quote treatment, not just paraphrase.
check('§27.57 is cited', html.includes('27.57'));
check('§27.60 is cited (operative "install the improvements" hook)', html.includes('&sect;27.60'));
check('§27.60 exact quote appears', html.includes('to install the improvements required by this article'));
check('§27.61 is cited', html.includes('27.61'));
check('provision quote styling (sd-ref__quote, green rule + italic, not a nested card) is used for verbatim language', html.includes('sd-ref__quote'));

// Compact "Key details" / "Key dimensions" structured lists pull
// dimensions out of prose (task: not a 200-word block quote).
check('sd-ref__details structured list is used', (html.match(/sd-ref__details/g) || []).length >= 2);

// 2002 Standard Design Criteria §3.5 -- consolidated card with key
// dimensions, honestly sourced to the ATP's characterization since the
// original 2002 document could not be located.
check('SDC §3.5 combined card present', /&sect;3\.5<\/a> &mdash; Curb, Gutters, Sidewalk and Driveways/.test(html));
check('SDC key dimension: commercial driveway width up to 35 feet', html.includes('up to 35 feet'));
check('SDC key dimension: curb-return radius minimum 30 feet', html.includes('minimum 30 feet'));
check('SDC sourcing note discloses the original 2002 document could not be located', html.includes('could not be located online for this page'));

// Caltrans curb ramp standards now link to the official, verified Caltrans
// Standard Plans page (not left unlinked).
const caltransUrl = 'https://dot.ca.gov/programs/design/2025-ccs-standard-plans-and-standard-specifications/2025-standard-plans-toc';
check('Caltrans Standard Plans link present', html.includes(caltransUrl));

// A-22 project-condition example: a real, verified condition of approval
// citing Standard Detail A-22 by name, presented as one example of
// application (not a universal rule).
const a22ExampleUrl = 'https://mountainview.legistar.com/View.ashx?M=F&ID=9336853&GUID=BDC13B3B-FDB3-4B59-8F79-2875D0F6A33E';
check('A-22 project-condition example URL present', html.includes(a22ExampleUrl.replace(/&/g, '&amp;')));
check('A-22 exact condition-of-approval quote appears', html.includes('shall conform to City Standard Detail A-22'));
check('A-22 example cites its source (PL-2020-184, 773 Cuesta Drive)', html.includes('PL-2020-184') && html.includes('773 Cuesta Drive'));
check('A-22 example is framed as one example, not a universal rule', html.includes('not a claim that identical wording applies automatically to every project'));
check('A-22 lightbox trigger present in the new example card', /data-evidence-id="sd-a22">Standard Detail A-22<\/button> &mdash; Side Street\/Driveway Triangle of Safety/.test(html));

// Standard Detail F-1 (Tree Planting and Staking) -- a real extracted
// asset with an evidence-modal entry and the exact spacing quote from
// the drawing's own notes.
check('F-1 asset resolves on disk', existsSync(join(REPO_ROOT, 'images/cities/mountainview-ca/standard-details/mv-standard-detail-f1-tree-planting.png')));
check('F-1 evidenceRecords entry present', /'sd-f1':\s*\{/.test(html));
check('F-1 lightbox trigger present', html.includes('data-evidence-id="sd-f1"'));
check('F-1 exact spacing quote appears (10 ft from sanitary sewer laterals, 5 ft from water services and driveways)', html.includes('10&#8217; from sanitary sewer laterals and 5&#8217; from water services and driveways'));
check('F-1 does not overclaim an "approved tree list" / arborist sign-off process not in the source', html.includes('do not describe a separate published tree list or arborist sign-off step'));
check('no ↗ arrow icons inside the Existing rules section', (() => {
  const start = html.indexOf('id="existing-rules"');
  const end = html.indexOf('id="public-review"');
  if (start === -1 || end === -1) return false;
  return !html.slice(start, end).includes('&#8599;');
})());

// Every individual provision has its own white block, separated by
// visible pale-green gaps (a flex column + gap on the shared list
// wrapper, not per-provision margin) -- verify each of the 11
// provisions' anchor + block markup is present.
const provisionAnchors = [
  ['code-27-57', '&sect;27.57'],
  ['policy-unimproved-streets', 'Policy on Unimproved Streets'],
  ['sdc-3-5', '&sect;3.5'],
  ['caltrans-curb-ramps', 'Curb ramp standards'],
  ['standard-detail-a-22', 'Standard Detail A-22'],
  ['code-36-32-85', '&sect;36.32.85'],
  ['code-36-32-50', '&sect;36.32.50'],
  ['standard-detail-f-1', 'Standard Detail F-1'],
  ['code-36-34-10-m', '&sect;36.34.10(m)'],
  ['code-27-60', '&sect;27.60'],
  ['code-27-61', '&sect;27.61'],
];
for (const [id, label] of provisionAnchors) {
  check(`provision "${label}" is its own white block at #${id}`, new RegExp(`<div class="sd-ref" id="${id}">`).test(html));
}

// Every thematic group has its own stable, human-readable anchor too.
const groupAnchors = ['sidewalks-frontage', 'driveways-crossings', 'bicycle-access', 'visibility-landscaping', 'street-width-improvements'];
for (const id of groupAnchors) {
  check(`group anchor #${id} exists on its h3 heading`, new RegExp(`<h3 class="sd-refgroup__heading" id="${id}">`).test(html));
}

// Local permalinks: one per group + one per provision (16 total), each
// a real, keyboard-focusable <a> with its own descriptive aria-label
// pointing at this page's own anchor -- not the official source link,
// and not a raw "#hash" displayed as visible text.
check('16 local permalinks present (5 groups + 11 provisions)', (html.match(/class="sd-permalink"/g) || []).length === 16);
check('permalinks are real <a> elements with an aria-label ("Link to X on this page"), not raw hash text', (html.match(/aria-label="Link to [^"]+ on this page"/g) || []).length === 16);
check('no visible raw "#driveways-crossings"-style hash text appears in the section body', !/>#[a-z0-9-]+</.test(html.slice(html.indexOf('id="existing-rules"'), html.indexOf('id="public-review"'))));
check('permalink icons use an inline SVG chain-link glyph, not the ↗ character', (html.match(/sd-permalink__icon/g) || []).length === 16 && !/sd-permalink[\s\S]{0,200}&#8599;/.test(html));

// scroll-margin-top on both group headings and provision blocks, so a
// direct #anchor URL isn't hidden under the sticky on-page nav.
if (existsSync(CSS_PATH)) {
  const css = readFileSync(CSS_PATH, 'utf8');
  const groupHeadingRule = css.match(/\.sd-page \.sd-refgroup__heading \{([^}]*)\}/);
  const refRule = css.match(/\.sd-page \.sd-ref \{([^}]*)\}/);
  check('.sd-refgroup__heading has scroll-margin-top (anchor lands below the sticky nav)', !!groupHeadingRule && /scroll-margin-top/.test(groupHeadingRule[1]));
  check('.sd-ref has scroll-margin-top (anchor lands below the sticky nav)', !!refRule && /scroll-margin-top/.test(refRule[1]));
  const refgroupRule = css.match(/\.sd-page \.sd-refgroup \{([^}]*)\}/);
  check('.sd-refgroup (the thematic group boundary) has a border but no white/filled background of its own -- pale-green page shows through', !!refgroupRule && /border:/.test(refgroupRule[1]) && !/background:\s*#fff/i.test(refgroupRule[1]));
  const refBlockRule = css.match(/\.sd-page \.sd-ref \{[^}]*background:\s*(#[0-9a-f]+)/i);
  check('.sd-ref (each individual provision) has its own white background', !!refBlockRule && /^#f+$/i.test(refBlockRule[1]));
  const listRule = css.match(/\.sd-page \.sd-refgroup__list \{([^}]*)\}/);
  check('.sd-refgroup__list uses a flex gap (24-32px range) to create visible green space between provisions, not shared borders', !!listRule && /gap:\s*1\.75rem/.test(listRule[1]));
  const groupRule = css.match(/\.sd-page \.sd-refgroup \{([^}]*)\}/);
  check('the gap between thematic groups (.sd-refgroup margin-top) is larger than the gap between provisions within a group', !!groupRule && /margin-top:\s*2\.5rem/.test(groupRule[1]));
}

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
  ['#existing-rules', 'Existing rules'],
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

// 15. Pale-green page background restored (a white-background version was
//     tried and then explicitly reverted after review) -- no page-scoped
//     override forcing the body white should remain in the stylesheet.
if (existsSync(CSS_PATH)) {
  const css = readFileSync(CSS_PATH, 'utf8');
  check('no page-scoped white-body-background override remains (pale green restored)', !/body\.sd-page\.rengstorff-microsite\s*\{\s*background:\s*#ffffff/.test(css));
  check('.sd-refgroup (the thin-outline thematic-group boundary) is styled', css.includes('.sd-page .sd-refgroup {'));
  check('.sd-policy-ref (Policy connections, no bordered card) is styled', css.includes('.sd-page .sd-policy-ref'));
} else {
  check('main.css exists for CSS-level checks', false);
}

// 16. Policy connections (Vision Zero + ATP) no longer presented as two
//     bordered/rounded callout cards -- plain stacked reference entries.
const policyConnStart = html.indexOf('Policy connections');
const policyConnEnd = html.indexOf('id="existing-rules"');
const policyConnSlice = (policyConnStart !== -1 && policyConnEnd !== -1) ? html.slice(policyConnStart, policyConnEnd) : '';
check('Policy connections no longer uses sd-callout--policy card markup', !policyConnSlice.includes('sd-callout--policy'));
check('Policy connections uses the plain sd-policy-ref treatment instead', (policyConnSlice.match(/sd-policy-ref"/g) || []).length === 2);

// 17. No "View ..." action-line links remain within the Existing Rules
//     section specifically (re-verified after the card-to-reference
//     rewrite, since that rewrite touched every link in the section).
const existingRulesStart = html.indexOf('id="existing-rules"');
const existingRulesEnd = html.indexOf('id="public-review"');
const existingRulesSlice = (existingRulesStart !== -1 && existingRulesEnd !== -1) ? html.slice(existingRulesStart, existingRulesEnd) : '';
check('no "View ..." action-line links remain inside Existing Rules', !/>View [^<]+<\/a>/.test(existingRulesSlice));
check('§27.61 section number is itself the clickable link', /<a href="[^"]*code_of_ordinances[^"]*"[^>]*>&sect;27\.61<\/a>/.test(existingRulesSlice));
check('§36.32.85 section number is itself the clickable link', /<a href="[^"]*code_of_ordinances[^"]*"[^>]*>&sect;36\.32\.85<\/a>/.test(existingRulesSlice));
check('"Curb ramp standards" heading is itself the clickable link', /<a href="[^"]*dot\.ca\.gov[^"]*"[^>]*>Curb ramp standards<\/a>/.test(existingRulesSlice));
check('"Policy on Unimproved Streets" title is itself linked to a verified City source', /<a href="https:\/\/www\.mountainview\.gov\/[^"]*walking-and-bicycling[^"]*"[^>]*>Policy on Unimproved Streets<\/a>/.test(existingRulesSlice));
check('the text discloses the linked page names the policy rather than being the original 1993 document itself', existingRulesSlice.includes('could not independently verify a standalone copy of the original 1993 policy document'));

// 18. Section introduction bands -- every one of the page's 11 primary
//     numbered sections gets a white intro band (number + H2 + any lead
//     paragraph(s)); subsection headings (h3) inside them do not.
check('exactly 11 sd-intro-band elements (one per primary numbered section)', (html.match(/class="sd-intro-band"/g) || []).length === 11);
for (let n = 1; n <= 11; n++) {
  check(`section ${n}'s number sits inside its intro band`, new RegExp(`<div class="sd-intro-band">\\s*<p class="sd-section-num">${n}</p>`).test(html));
}
check('Section 5\'s full example intro (both paragraphs) sits inside its band, gallery starts after', /<div class="sd-intro-band">\s*<p class="sd-section-num">5<\/p>\s*<h2>What the current standards look like<\/h2>\s*<p>The City.*?<\/p>\s*<p class="sd-prose sd-tight sd-footnote">The August 2026 revision[^<]*<\/p>\s*<\/div>\s*<div class="sd-group">/.test(html));
check('h3 subsection headings ("Policy connections", "Sidewalks + frontage", etc.) are NOT wrapped in sd-intro-band', !/<div class="sd-intro-band">\s*<h3/.test(html));
if (existsSync(CSS_PATH)) {
  const css = readFileSync(CSS_PATH, 'utf8');
  const bandRuleMatch = css.match(/\.sd-page \.sd-intro-band \{([^}]*)\}/);
  check('.sd-intro-band is styled', !!bandRuleMatch);
  if (bandRuleMatch) {
    const rule = bandRuleMatch[1];
    check('.sd-intro-band has a white background', /background:\s*#ffffff/i.test(rule));
    check('.sd-intro-band has generous padding (not a thin strip)', /padding:\s*2/.test(rule));
    check('.sd-intro-band has NO border (not a card)', !/\bborder:/.test(rule) && !/border-\w+:/.test(rule));
    check('.sd-intro-band has NO box-shadow (not a floating card)', !/box-shadow/.test(rule));
    check('.sd-intro-band has NO border-radius, or at most an extremely subtle one', !/border-radius/.test(rule) || /border-radius:\s*[0-4]px/.test(rule));
  }
}

// 19. "Who administers this?" -- compact City-contacts block inside the
//     §36.32.85 provision, informational (not advocacy, not a definitive
//     legal assignment), dated, capped at a handful of named contacts,
//     and distinguishing the responsible department from the specific
//     Zoning Administrator review role §36.32.85 establishes.
const code3685Start = html.indexOf('id="code-36-32-85"');
const code3685End = html.indexOf('id="code-36-32-50"');
const code3685Slice = (code3685Start !== -1 && code3685End !== -1) ? html.slice(code3685Start, code3685End) : '';
check('"Who administers this?" block sits inside the §36.32.85 provision', code3685Slice.includes('Who administers this?'));
check('the block is dated "as of September 2026"', /as of September 2026/.test(code3685Slice));
check('the block is framed as informational, not a definitive legal assignment', code3685Slice.includes('not a definitive legal assignment of responsibility'));
check('Christian Murdock is named as Community Development Director', /Christian Murdock[\s\S]{0,200}Community Development Director/.test(code3685Slice));
check('George Schroeder is named as Zoning Administrator (verified via a Jan. 2026 Administrative Zoning Hearing record, not the older Blizinski attribution)', /George Schroeder[\s\S]{0,400}Zoning Administrator/.test(code3685Slice));
check('outdated "Blizinski" name is not used (role verified as having changed since)', !code3685Slice.includes('Blizinski'));
check('§36.32.85\'s specific role for the Zoning Administrator (type, location, design) is explained', code3685Slice.includes('determining bicycle-parking type, location, and design'));
check('the text distinguishes department-context from the Zoning Administrator\'s specific review role (does not claim Murdock personally administers §36.32.85)', code3685Slice.includes('Community Development is the responsible department context, and the Zoning Administrator has the specific review role'));
check('department phone number present', code3685Slice.includes('650-903-6306'));
check('department email present (not a personal staff email)', code3685Slice.includes('community.development@mountainview.gov') && !/[a-z]+\.[a-z]+@mountainview\.gov/.test(code3685Slice.replace('community.development@mountainview.gov', '')));
check('"Community Development Department" name is linked to the official department page', /<a href="https:\/\/www\.mountainview\.gov\/our-city\/departments\/community-development"[^>]*>Community Development Department<\/a>/.test(code3685Slice));
check('a "Community Development directory" link points to the official current-contacts page, with a staff-can-change caveat', /Staff assignments can change[\s\S]{0,200}Community Development directory<\/a>/.test(code3685Slice));
check('at most 3 named/role contacts (Murdock + Schroeder; no invented third person)', (code3685Slice.match(/sd-ref__contact-row/g) || []).length <= 3 && (code3685Slice.match(/sd-ref__contact-row/g) || []).length >= 2);
check('no ↗ icons in the contacts block', !code3685Slice.includes('&#8599;'));
check('no photos/images added to the contacts block', !/<img/.test(code3685Slice));
check('the contacts block is visually subordinate (dashed rule), not its own separate white card', code3685Slice.includes('sd-ref__contacts">'));

console.log(`\n${passes} passed, ${failures} failed.`);
process.exit(failures > 0 ? 1 : 0);
