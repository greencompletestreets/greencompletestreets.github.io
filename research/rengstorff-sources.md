# Rengstorff Avenue Green Complete Street — source/provenance tracker

Internal research file. **Not linked from or rendered on the public site** —
it exists to track provenance for the Rengstorff Avenue Green Complete
Street project pages without exposing "still looking for this"
placeholders to readers.

**Project URL structure (as of the feasibility-study child page):**
- Parent project page: `cities/mountainview-ca/rengstorff-green-complete-streets/`
- Feasibility & Alternatives Study (child page): `cities/mountainview-ca/rengstorff-green-complete-streets/feasibility-study/`
- Future sibling child pages: `.../preliminary-design/`, `.../construction/`
- The old URL, `cities/mountainview-ca/rengstorff-green-complete-streets-project.html`,
  is kept in place as a redirect stub (meta refresh + `location.replace()` +
  a visible fallback link) so existing links/bookmarks to it still resolve
  rather than 404ing. Don't delete that file.

**Workflow:** when a missing source below is found, fill in its Official URL
and move it from *Sources to locate* into *Sources found*. Only add/enable a
link on the public page (At a Glance Source zones, the evidence timeline's
`officialSources` entries, or the Funding section's requirement cards) once
the URL here is verified — never publish a placeholder or a guessed link.

As of the September 10, 2024 staff report, the public-facing link for a
found primary-source document should point to that document's own
**Source Document page** (`/documents/<project>/<slug>/`, built on the
reusable `.source-document` template in `assets/css/main.css`) rather than
linking the raw official URL directly from the project page. The Source
Document page then provides "View PDF" (a locally hosted copy) and "View
official City record" (the raw official URL) itself. See
`documents/rengstorff/2024-09-10-council-staff-report/index.html` as the
reference implementation when building the next one.

Formerly, three of the "sources to locate" below (grant guidelines, Caltrans
grant award, grant application) were shown directly on the public page as a
"Sources & documents" list of `Source pending` placeholders, under Funding.
That public list was removed; the same outstanding research items now live
here instead.

---

## Sources found

### September 10, 2024 Mountain View Council action

| Field | Value |
|---|---|
| Status | Found — verified |
| Date | Sept. 10, 2024 |
| Source/document name | *Rengstorff Avenue Complete Streets Study — Various Actions* (Legistar legislative record) |
| Supports | Council's Sept. 10, 2024 action: accepted the Caltrans SB 1 grant, created CIP 25-39 (Rengstorff Avenue Complete Streets Study), appropriated $71,600 from the City Transportation Reserve Fund, and accepted/appropriated the $352,000 Caltrans SB 1 grant |
| Project/CIP identifier | CIP 25-39 |
| Official URL | https://mountainview.legistar.com/LegislationDetail.aspx?GUID=A17E425A-D6F9-4A13-ACB4-9232B148D33B&ID=6852939&Options=&Search= |
| Related documents | Council staff report PDF (below) |
| Research/search notes | Currently linked from the At a Glance "Current stage" card's Source zone (primary link) and used as the Sept. 10, 2024 milestone's source in the evidence timeline. |

### September 10, 2024 Council staff report PDF

| Field | Value |
|---|---|
| Status | Found — verified. Now has its own Source Document page (see below); a local PDF still needs to be placed in the repo before "View PDF" on that page will resolve. |
| Date | Sept. 10, 2024 |
| Agenda item | 4.4 (Consent Calendar) |
| Source/document name | Council report (PDF) — Consent Calendar, Item 4.4 |
| Supports | Same Sept. 10, 2024 action as above; this is the staff report backup/detail behind it |
| Project/CIP identifier | CIP 25-39 |
| Source Document page (public) | `/documents/rengstorff/2024-09-10-council-staff-report/` |
| Local PDF path (needed for "View PDF" to work) | `documents/rengstorff/pdfs/2024-09-10-council-staff-report.pdf` — **not yet in the repo; the downloaded PDF needs to be placed at this exact path.** |
| Original City PDF URL | https://mountainview.legistar.com/View.ashx?GUID=9849D61B-AE50-4622-A6F5-4DF92C2DDB59&ID=13283318&M=F |
| Official City record (Legistar item) | https://mountainview.legistar.com/LegislationDetail.aspx?GUID=A17E425A-D6F9-4A13-ACB4-9232B148D33B&ID=6852939&Options=&Search= |
| Related documents | Legistar "Various Actions" record (above) |
| Research/search notes | The Source Document page at `/documents/rengstorff/2024-09-10-council-staff-report/` is now the public-facing link for this document — it's what the At a Glance "Current stage" card's Source zone (secondary link, "Council report (PDF)") and the evidence timeline's Sept. 10, 2024 `officialSources` ("Council approval") both point to, instead of linking the raw Legistar PDF directly. That page itself links out to both the Original City PDF URL and the Official City record above. |

---

## Sources found (added during the timeline redesign pass)

### Caltrans FY 2024-25 STPG award — Rengstorff Avenue Complete Streets Study

| Field | Value |
|---|---|
| Status | Found — verified |
| Date | Jul. 9, 2024 (Caltrans press release date) |
| Source/document name | Caltrans Sustainable Transportation Planning Grant (STPG) FY 2024-25 awards — Sustainable Communities Competitive category, District 4, City of Mountain View, "Rengstorff Avenue Complete Streets Study" |
| Supports | The $352,000 award and Caltrans' own project description (District 4, Sustainable Communities Competitive, SB 1 funded) |
| Official URL | Press release: https://dot.ca.gov/news-releases/news-release-2024-025 — Full awards list (PDF, Mountain View/Rengstorff entry confirmed by direct text extraction): https://dot.ca.gov/-/media/dot-media/programs/transportation-planning/documents/division-transportation-planning/regional-and-community-planning/sustainable-transportation-planning-grants/fy-2024-25-awards-final-a11y.pdf |
| Research/search notes | Now used as the Jul. 9, 2024 evidence-timeline milestone's officialSources. The awards PDF's dollar-amount column wasn't captured in the extracted linear text order but the project/category/district match is confirmed. |

### Original City of Mountain View Caltrans grant application

| Field | Value |
|---|---|
| Status | Found — verified, and the PDF is now in the repo. Moved to `documents/rengstorff/rengstorff-stpg-2024-25-grant-application.pdf` (was `documents/rengstorff/pdfs/grant-application.pdf`) to match the site's document-naming convention; the Jan. 18, 2024 evidence-timeline entry and the Funding section's "What Mountain View proposed" card both point at the new path. |
| Date | Jan. 18, 2024 (staff submission date) |
| Source/document name | Caltrans Sustainable Transportation Planning Grant (STPG), Sustainable Communities Competitive category — City of Mountain View's application for Rengstorff Ave, funded through SB 1 |
| Related documents | Caltrans grant award (above); approved Scope of Work (below) |

### Approved Caltrans Scope of Work

| Field | Value |
|---|---|
| Status | Found — content in hand, PDF in the repo. Moved to `documents/rengstorff/rengstorff-stpg-2024-25-scope-of-work.pdf` (was `documents/rengstorff/pdfs/scope-of-work.pdf`). No longer a standalone evidence-timeline milestone — per the redesigned timeline's information architecture, it's folded into the Jul. 9, 2024 grant-award milestone's detail section as the document governing the grant-funded tasks/deliverables. |
| Approval date | Still not confirmed from source material reviewed so far — the Jul. 9, 2024 milestone's `processNote` states this explicitly rather than inferring a date. |

### Official 2023 adopted CIP source for the original Rengstorff project

| Field | Value |
|---|---|
| Status | Partially located — the final Jun. 27, 2023 Council adoption is confirmed; the Apr. 3, 2023 Council Study Session (Item 7.1) and May 9, 2023 Council Study Session (Item 3.1) are still pending despite a further search pass (a Jun. 4, 2024 Vision Zero Action Plan staff report surfaced in search results but is a different, unrelated document) |
| Date | Council process ran Apr. 3 – Jun. 27, 2023 |
| Source/document name | 2023 CIP adoption record, Project 27-xx (Rengstorff Ave Green Complete Street Improvements, Study and Preliminary Design) |
| Official URL | Jun. 27, 2023 final adoption (Council Adoption, Item 4.3) is confirmed: https://mountainview.legistar.com/LegislationDetail.aspx?GUID=44C19218-D2B1-45BC-BB7E-F470FB5C854E&ID=6269434 |
| Research/search notes | The Apr. 3, 2023 milestone is now its own top-level evidence-timeline entry (previously nested as a subMilestone under the 2023 CIP entry) with `officialSources: [{ label: 'Council minutes', pending: true }]`. May 9, 2023 remains a subMilestone under the Jun. 27, 2023 entry, also still pending. Locate the two earlier Legistar records to complete the full 2023 process trail. |

### Official FY 2025-26 adopted CIP — preliminary design and construction programming

| Field | Value |
|---|---|
| Status | Found — verified by direct PDF text extraction. "Attachment 4" of the FY 2025-26 adopted CIP lists, under Year 3/FY 2027-28: "Rengstorff Avenue Green Complete Street Improvements, Prelim Design" — $2,000,000 (C/C Tax) — and, under Unscheduled Proposed Projects: "US-13 — Rengstorff Avenue Green Complete Street Improvements, Construction." Both match the figures already on the public page. |
| Official URL | https://mountainview.legistar.com/View.ashx?GUID=7B370370-AB1A-4AB3-9EAE-37E750005F2C&ID=14306857&M=F (Attachment 4, FY 2025-26 CIP) |
| Research/search notes | The extracted text doesn't show a specific "28-xx" number assigned to the Prelim Design line item (unlike the sequential "28-01" … "28-28" backlog-project codes elsewhere in the same document) — "Project 28-xx" on the public page is carried forward as the pre-existing placeholder pending an assigned number, not verified against this document. Now used as the officialSources for both the "2025 CIP" and "Future: Preliminary Design" evidence-timeline milestones, the two `cip-2025-step2`/`cip-2025-step3` evidenceRecords' sourceHref, and the At a Glance "What's next" card. The parent Legistar legislative item (CIP adoption resolution) for this Attachment 4 PDF has not been separately identified — only the direct PDF URL is used. |

### Jun. 24, 2025 consultant contract — Professional Services Agreement with Kimley-Horn

| Field | Value |
|---|---|
| Status | Found — verified via Legistar |
| Date | Jun. 24, 2025, Consent Calendar, Item 4.14 |
| Source/document name | "Rengstorff Avenue Complete Streets Study-Professional Services Agreement" — File #205259 |
| Supports | Council authorization of the up-to-$352,000 professional services agreement with Kimley-Horn and Associates for CIP 25-39 |
| Official URL | Legistar item: https://mountainview.legistar.com/LegislationDetail.aspx?GUID=4A9E0C6C-AA9F-475D-B5F8-C11EDEBCEF8C&ID=7443267&Options=&Search= — Meeting: https://mountainview.legistar.com/MeetingDetail.aspx?GUID=5693DE19-AAAB-4188-9483-B5FEF45B0611&ID=1249679&Options= — Council report PDF: https://mountainview.legistar.com/View.ashx?M=F&ID=14306863&GUID=CC1E254E-1D68-4849-911B-72EA7A92F799 |
| Research/search notes | New evidence-timeline milestone added this pass (was previously missing from the timeline entirely). Legistar's own item title uses "Project 25-39"; the public page keeps the site's established "CIP 25-39" identifier for consistency with the Sept. 10, 2024 milestone. |

### Aug. 18, 2026 BPAC meeting — Alternatives A-C

| Field | Value |
|---|---|
| Status | Found — verified via Legistar Calendar |
| Date | Aug. 18, 2026, 6:00 PM, Plaza Conference Room and Video Conference |
| Source/document name | Agenda Item 6.1, "Rengstorff Complete Streets Study, Project 25-39" (New Business) |
| Official URL | https://mountainview.legistar.com/MeetingDetail.aspx?ID=1378436&GUID=CA13F978-062B-4C26-A933-839190223AD3&Options=info|&Search= |
| Research/search notes | Staff report/presentation not yet linked from Legistar as of this research pass ("Not available"). New evidence-timeline milestone. |

### Aug. 24, 2026 community workshop

| Field | Value |
|---|---|
| Status | Found — City's own GovDelivery bulletin and community survey confirmed via search; direct WebFetch of both URLs returned 403 (site blocks non-browser fetches) so content is corroborated via search-result excerpts and the Aug. 14, 2026 Mountain View Voice article rather than a full page fetch |
| Date | Aug. 24, 2026, 5:30-7:00 PM, Mountain View Community Center, Maple Room |
| Official URL | City announcement: https://content.govdelivery.com/accounts/CAMOUNTAINVIEW/bulletins/406eb29 — Survey: https://web.cvent.com/survey/93a6421c-3963-4c80-923d-13246b4715fc/welcome |
| Research/search notes | No dedicated mountainview.gov project page was confirmed reachable (a guessed URL returned 403; not used as a citation since it wasn't actually verified). New evidence-timeline milestone. |

### Aug. 31, 2026 Council Transportation Committee (CTC) — scheduled review

| Field | Value |
|---|---|
| Status | Found — verified via Legistar Calendar |
| Date | Aug. 31, 2026, 6:00 PM, Plaza Conference Room and Video Conference |
| Source/document name | Agenda Item 5.1, "Rengstorff Complete Streets Study, Project 25-39" (New Business), File #206293 |
| Official URL | https://mountainview.legistar.com/MeetingDetail.aspx?ID=1422169&GUID=4FCB4722-F96C-403F-B4FE-0C21E6DA5BEF&Options=info|&Search= |
| Research/search notes | This meeting is still upcoming as of this pass — the public page deliberately states only that a review is scheduled, not an outcome. New evidence-timeline milestone. |

---

## Feasibility & Alternatives Study

Tracks provenance for the feasibility-study page group, now split into
three pages by information-architecture role rather than one long page:

- `feasibility-study/index.html` — short landing/dashboard page (30-second
  read: scope, process stage, current alternatives, a condensed "what
  happened before" visual, links out). Detailed evidence and interpretation
  were moved out of this page, not deleted.
- `feasibility-study/screening/index.html` — the detailed evidence record,
  now fully populated (it went through one intermediate revision where it
  was still thin/mostly placeholder cards; that has been superseded): full
  grant-application problem statement (crash stat blocks, PQOS/BLTS,
  school/senior/equity detail), the grant + SOW treatment taxonomy, the
  mode-shift quotations, the screening-process flow, all 10 evaluation
  criteria, the three SOW deliverables, the LOS road-diet table, a
  decision-provenance diagram, full TAC facts, the missing-evidence
  tracker, an evidence-coverage matrix, an established/record-pending
  summary, the canonical Documents & evidence list, and Community input.
- `feasibility-study/analysis/index.html` — Green Complete Streets'
  interpretation only, leading with the technical-finding → evaluation-
  judgment → policy-choice distinction, then the feasibility/constraints
  taxonomy, a "what role did LOS play" section, the four-lanes-as-
  constraint question, the congestion-framing comparison, and the
  governance question. No raw research record lives on this page.

The three items already covered above (2023 CIP adoption, Sept. 10, 2024
Council action, Sept. 10, 2024 staff report) are this study's founding
records too — see their entries above rather than duplicated here.

**Important standing note:** nothing in this section, and nothing on the
public feasibility-study page, should be read as a conclusion about LOS,
VMT, or the study's transportation methodology. Every item below needs
independent source verification before any conclusion is published,
public or internal. Do not characterize the City's use of LOS as
inappropriate, required, prohibited, or legally significant unless a
specific source found below actually supports that statement.

### Primary source documents — content received, files not yet added to repo

The three documents below are now the evidentiary basis for most of the
public feasibility-study page's "Feasibility Study Documents" section
(facts, quotations, and the road-diet LOS table). Their *content* has been
reviewed and transcribed onto the public page; what's still missing is an
actual file or URL for each one in this repository. Until one is added,
they're listed as plain (non-link) text in the public page's "Documents &
evidence" section, per the same "never fabricate a link" rule used
everywhere else on this site.

| Document | Status | Notes |
|---|---|---|
| Caltrans Sustainable Communities Competitive Grant Application | **Resolved — PDF now in the repo** at `documents/rengstorff/rengstorff-stpg-2024-25-grant-application.pdf` (moved from `documents/rengstorff/pdfs/grant-application.pdf`) | Same document as "Original City of Mountain View Caltrans grant application" above. The parent project page's evidence timeline and Funding section ("What Mountain View proposed" card) now link this exact path. **This page's own "Documents & evidence" list may still show it as plain non-link text — not updated in this pass (out of scope; this pass only touched the parent project page's timeline).** |
| Approved Caltrans Scope of Work | **Resolved — PDF now in the repo** at `documents/rengstorff/rengstorff-stpg-2024-25-scope-of-work.pdf` (moved from `documents/rengstorff/pdfs/scope-of-work.pdf`); **approval date still not confirmed** | Establishes the alternatives-development process, the original 10 evaluation criteria, and the deliverables list (including the still-missing Screening Criteria Memorandum and Summary of Alternatives Analysis). No longer a standalone evidence-timeline milestone on the parent page — folded into the Jul. 9, 2024 grant-award milestone's detail section instead. **This page's own "Documents & evidence" list may still show it as plain non-link text — not updated in this pass.** |
| August 2026 Mountain View staff report (Feasibility & Alternatives Study) | Content in hand; file/URL pending | Distinct from the Sept. 10, 2024 staff report tracked above (that one is about CIP 25-39's creation; this one is about the road-diet analysis and current alternatives). Source of the Old Middlefield/Montecito LOS figures and the "preserve vehicle capacity and corridor throughput" quotation. |

Once a real file or URL exists for any of these, link it from the public
page's "Feasibility Study" document group and update this table.

### Green Complete Streets assessment (placeholder)

| Field | Value |
|---|---|
| Status | **Not yet imported — do not populate the public page's "Green Complete Streets assessment" section until this is.** The public page currently omits that section entirely rather than showing an empty/pending placeholder. |
| What it will support | Green Complete Streets' own analysis of the feasibility study and alternatives: bikeway continuity, protected intersections, whether safety elements are treated as baseline vs. competing alternatives, green infrastructure, shade/street trees, accessibility, speed management, multimodal access, LOS/VMT methodology, design constraints, and whether the alternatives deliver the Council-programmed scope. |
| Category if/when published | Analysis (not Project record, not Community input) |
| Research/search notes | The actual assessment/letter content needs to be imported from its source before this section can be written — do not draft or infer its position from assumptions. Once imported, add it to `feasibility-study/analysis/index.html` (the interpretation page — this content belongs there, not on the landing page or the screening/evidence page), tagged `category-tag--analysis`. |

### Alternatives A/B/C — comparison details

| Field | Value |
|---|---|
| Status | Not yet located. One fact is now known and already on the public page: all three current alternatives preserve the existing travel-lane count "to preserve vehicle capacity and corridor throughput" (August 2026 staff report). Per-alternative specifics (bikeway/intersection/crossing/green-infrastructure treatment differences) remain undocumented. |
| What it will support | The specific per-alternative comparison the public page's Alternatives section is structured to hold (continuous vs. discontinuous Class IV bikeway treatment, intersection treatments, crossing treatments, green stormwater infrastructure, street trees/landscaping, other design differences) |
| Category | Project record (once sourced from the study itself) |
| Research/search notes | Try the Summary of Alternatives Analysis (tracked below) and any BPAC or Council presentation that lays out Alternatives A/B/C. |

### LOS (Level of Service) references

| Field | Value |
|---|---|
| Status | Partially found. The August 2026 staff report reports LOS for the three-lane road-diet concept at two locations (Old Middlefield Way: D → F; Montecito Avenue: C → E) — now documented on the public page's staff-report section and the Current Analytical Question flow diagram. Still not established: whether LOS was a formal screening criterion/threshold, or how it was weighed against the SOW's other 10 criteria (none of which explicitly name LOS). |
| What it will support | Where/how LOS appears in the study; what it's used to evaluate; whether it functions as a design constraint; whether automobile delay affects which alternatives advance |
| Category | Project record (the study's own use of LOS) / Analysis (Green Complete Streets' evaluation of that use, kept separate) |
| Research/search notes | The Detailed Road-Diet Traffic Analysis and Screening Criteria Memorandum (both tracked below) should have the rest — full intersection-LOS methodology, thresholds if any, and how the finding was weighed. |

### VMT (Vehicle Miles Traveled) references

| Field | Value |
|---|---|
| Status | Not yet located — none of the documents reviewed so far (grant application, SOW, August 2026 staff report) mention VMT. |
| What it will support | Whether and where VMT is considered in the study, and how it relates (or doesn't) to the LOS analysis above |
| Category | Project record |
| Research/search notes | Try the Detailed Road-Diet Traffic Analysis (tracked below) and any CEQA documentation (VMT is the state's post-SB 743 standard for CEQA transportation-impact analysis, distinct from operational LOS — confirm whether/how this study distinguishes the two rather than assuming). |

### Transportation analysis methodology (general)

| Field | Value |
|---|---|
| Status | Partially found. The approved SOW's 10 evaluation criteria are now documented on the public page (pedestrian safety/convenience/comfort, bicycle safety/convenience/LTS, parking, motor-vehicle speed and volume, transit, right-of-way/utilities, access, biodiversity/stormwater/context, community support, cost) — notably, none of the 10 explicitly name LOS, vehicle delay, capacity, or throughput. Still not established: whether/how that list changed before being applied to the road-diet decision. |
| What it will support | What performance measures the study uses overall; how bicycle, pedestrian, transit, safety, accessibility, and green-infrastructure outcomes are evaluated alongside vehicle operations; whether/how CEQA transportation-impact analysis is distinguished from operational/design analysis |
| Category | Project record |
| Research/search notes | The Screening Criteria Memorandum (tracked below) is the most likely place to find whether/how the 10 SOW criteria were revised. |

### Screening Criteria Memorandum

| Field | Value |
|---|---|
| Status | Pending — identified as a deliverable in the approved SOW, not yet obtained |
| What it will support | The final screening criteria (vs. the SOW's original 10); whether LOS, vehicle delay, or capacity/throughput were added; numerical thresholds; weighting; how "fatal flaw" was defined; how TAC/community feedback changed the criteria |
| Category | Project record |
| Research/search notes | Likely the single most important outstanding document for the Current Analytical Question (the decision-point gap) — see the public page's "Missing Alternatives-Screening Documents" section. |

### Summary of Alternatives Analysis

| Field | Value |
|---|---|
| Status | Pending — identified as a deliverable in the approved SOW, not yet obtained |
| What it will support | Which concepts were initially considered; how each alternative performed against the criteria; why concepts (including the road diet) were eliminated; tradeoffs identified; how the three current alternatives were selected |
| Category | Project record |
| Research/search notes | See the public page's "Missing Alternatives-Screening Documents" section. |

### Initial Screening / Fatal-Flaw Schematics

| Field | Value |
|---|---|
| Status | Pending — referenced in the approved SOW ("schematic layouts for initial screening/fatal-flaw analysis"), not yet obtained |
| What it will support | The original range of concepts; the actual three-lane road-diet configuration; other screened-out concepts; roadway-space/parking/bikeway/green-infrastructure configurations |
| Category | Project record |
| Research/search notes | See the public page's "Missing Alternatives-Screening Documents" section. |

### Detailed Road-Diet Traffic Analysis

| Field | Value |
|---|---|
| Status | Pending — the August 2026 staff report reports LOS/travel-time results but not the underlying technical analysis |
| What it will support | Traffic volumes, intersection LOS methodology, vehicle delay, queue lengths, travel time, diversion/redistribution assumptions, transit/emergency-response/pedestrian/bicycle/safety impacts |
| Category | Project record |
| Research/search notes | See the public page's "Missing Alternatives-Screening Documents" section. Also the most likely place to find VMT (or its absence) directly addressed. |

### TAC (Technical Advisory Committee) documents

| Field | Value |
|---|---|
| Status | Pending. What's now known and already on the public page: the TAC's member departments/functions per the SOW (Public Works incl. Civil Infrastructure/Traffic/Land Development, Community Development, Community Services, City Manager's Office/Sustainability, Police Traffic Enforcement, Fire/Emergency Response, Traffic Engineering, Sustainability); the August 2026 staff report's narrower list of who actually served; and that the TAC met three times and reviewed existing conditions, draft concepts, and evaluation criteria. Not yet known: any of the actual records below. |
| What it will support | Membership list with roles; meeting dates/agendas/presentations/notes; written comments; evaluation matrices; consultant materials; recommendations; whether/how the TAC changed the evaluation criteria or discussed the road diet as a fatal flaw |
| Category | Project record |
| Research/search notes | See the public page's "Technical Advisory Committee" document section and its TAC-documents placeholder card. |

### Grant requirements (FY 2024-25 Sustainable Transportation Planning Grant)

| Field | Value |
|---|---|
| Status | Not yet located |
| Research/search notes | Duplicate of "FY 2024-25 Sustainable Transportation Planning Grant guidelines" above — tracked once, see that entry. Relevant here because the grant's own criteria shape what the feasibility study is required to evaluate. |

### Engagement materials (BPAC / Council presentations)

| Field | Value |
|---|---|
| Status | Not yet located |
| What it will support | Public engagement and BPAC/Council presentation materials specific to the feasibility study and its alternatives |
| Category | Project record (presentation materials) — any resulting public comment goes under Community input instead |
| Research/search notes | Try Mountain View's BPAC meeting agendas/minutes and any Council study-session materials specific to this study (distinct from the CIP-programming actions already tracked above). |

### April Webster letter / Council assessment

| Field | Value |
|---|---|
| Status | Not yet imported |
| Author | April Webster |
| Document type | Assessment / Council letter |
| Category | Community input |
| Research/search notes | Content not yet imported — do not summarize or characterize it until it is. Once available, record date, a short neutral description, a locally hosted copy (if available), the original/public source (if available), and the related Council meeting or milestone; populate the "April Webster" card in `feasibility-study/screening/index.html`'s Community input section (moved there from the landing page during the information-architecture restructure). A substantial version of this document may eventually get its own Source Document page. |

### Isaac's letter (transportation analysis)

| Field | Value |
|---|---|
| Status | Not yet imported |
| Author | Isaac (last name not yet known — do not guess) |
| Document type | Letter regarding the project and transportation analysis |
| Category | Community input |
| Research/search notes | Content not yet imported — do not summarize or characterize it until it is. Same fields to record as April Webster's letter above, once available. |

### City responses to community input, if any

| Field | Value |
|---|---|
| Status | Not yet located / not yet confirmed to exist |
| What it will support | Whether the City formally responded to community submissions (e.g. April Webster's or Isaac's letters) and what those responses said |
| Category | Project record (a City response would itself be a primary-source document) |
| Research/search notes | Check Council meeting minutes/staff reports around the relevant meeting dates once those dates are known from the letters themselves. |

### Council/BPAC actions specific to the feasibility study

| Field | Value |
|---|---|
| Status | Partially covered — the CIP-creation/grant-acceptance action (Sept. 10, 2024) is already tracked above; study-specific BPAC or Council study-session actions (e.g. reviewing alternatives) are not yet located |
| Category | Project record |
| Research/search notes | Distinct from the 2023 CIP-elevation and 2024 CIP-creation actions already tracked above — this is specifically for any Council/BPAC action that reviews or directs the feasibility study's alternatives themselves, once one exists in the public record. |

### City Attachment 4 (typical cross-section dimensions)

| Field | Value |
|---|---|
| Status | Content transcribed onto the Analysis page's cross-section tables (South/North detailed geometry, category totals, sidewalk widths); no verified file/URL for Attachment 4 itself added to this repository yet |
| Source/document name | City Attachment 4 — typical cross-section drawings, South of Central Expressway and North of Central Expressway, for Existing conditions and Alternatives A/B/C |
| Supports | Every dimension in the Analysis page's cross-section tables (lane widths, bike lanes, parking, planting strip, sidewalks) and the exploratory 10&#8217;-inner-lane rows Green Complete Streets added alongside them |
| Official URL | *(none yet)* |
| Research/search notes | This is the single most-cited source on the Analysis page and does not yet have a file or link in this repository — locating and adding it (or a Source Document page for it) should be a priority. The exploratory rows on the cross-section tables are Green Complete Streets' own width-allocation test, not part of Attachment 4 itself — keep that distinction if this entry is expanded. |

### Caltrans DIB 89-02 (Class IV Bikeway Guidance)

| Field | Value |
|---|---|
| Status | Citation known and content transcribed onto the Analysis page's "Parking and bikeway separation design requirements" table (Section 3.3 separation guidance); no verified public URL added to this repository yet |
| Source/document name | Caltrans Design Information Bulletin 89-02, Class IV Bikeway Guidance, Section 3.3 |
| Supports | The external (non-Rengstorff-specific) separation-width guidance table on the Analysis page — explicitly labeled as external guidance, not a City of Mountain View dimension |
| Official URL | *(none yet — do not guess a dot.ca.gov URL from memory; verify and add the exact current link before citing it as a source)* |
| Research/search notes | This is general statewide Caltrans design guidance, not Rengstorff-specific — kept in this project's tracker only because it's cited for context on the Analysis page's separation-requirements table. |

### Rengstorff parking study (City findings)

| Field | Value |
|---|---|
| Status | Content transcribed onto the Analysis page's "What the Rengstorff parking study found" table (253 total spaces, ~40% of corridor with parking allowed, occupancy/demand patterns, 80% of survey respondents who don't park on Rengstorff); the specific City parking-study document/report this came from has not been identified or linked yet |
| Supports | The "What the Rengstorff parking study found" context table and its accompanying note on the Analysis page |
| Official URL | *(none yet)* |
| Research/search notes | Identify and link the actual City parking study/report (or the staff report section presenting these findings) so this table can cite a real source rather than standing as unattributed figures. |
