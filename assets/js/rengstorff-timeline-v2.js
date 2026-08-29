/*
 * Rengstorff Avenue project timeline -- prototype V2 (vertical timeline).
 *
 * This is a REVERSIBLE PROTOTYPE, reviewed side by side with the existing
 * milestone-card timeline ("V1", built by the inline <script> earlier in
 * cities/mountain-view-ca/rengstorff-green-complete-streets/index.html,
 * around the `events` array / d3.select('#evidence-timeline') code).
 *
 * - Renders from window.rengstorffTimelineEvents, the SAME `events` array
 *   V1 renders from (set via `window.rengstorffTimelineEvents = events;`
 *   right after that array in the page's first inline <script>). No
 *   content is duplicated here -- only V2-specific presentation fields
 *   (yearGroup, marker, v2Summary, nodeStyle, future, emphasis) were added
 *   to that shared array, additively, for this renderer to read; V1 does
 *   not use them and is otherwise untouched.
 * - Owns the small "Prototype review" toggle (.tlv2-toggle buttons) that
 *   switches between #timeline-v1-wrap and #timeline-v2-wrap.
 *
 * To remove this prototype entirely: delete this file, its <script src>
 * tag, the assets/css/rengstorff-timeline-v2.css <link>, and the
 * .tlv2-toggle / #timeline-v2-wrap markup in index.html. V1 keeps working
 * exactly as it does today either way -- nothing here modifies it.
 */
(function () {
  'use strict';

  var events = window.rengstorffTimelineEvents || [];
  var container = document.getElementById('timeline-v2');

  if (container && events.length) {
    renderTimelineV2(container, events);
  }

  function renderTimelineV2(root, events) {
    var groups = groupByYear(events);

    groups.forEach(function (group) {
      root.appendChild(buildGroup(group));
    });
  }

  // Groups events by their yearGroup field, preserving the order groups
  // (and events within them) first appear in -- the shared `events` array
  // is already in chronological order, so no separate sort is needed here.
  function groupByYear(events) {
    var groups = [];
    var indexByKey = {};
    events.forEach(function (event) {
      var key = event.yearGroup || event.date;
      if (!(key in indexByKey)) {
        indexByKey[key] = groups.length;
        groups.push({ key: key, events: [] });
      }
      groups[indexByKey[key]].events.push(event);
    });
    return groups;
  }

  function buildGroup(group) {
    var isNext = group.key === 'NEXT';
    var groupEl = el('div', 'tlv2-group' + (isNext ? ' tlv2-group--next' : ''));

    var yearEl = el('h3', 'tlv2-group__year');
    yearEl.textContent = isNext ? 'Next' : group.key;
    groupEl.appendChild(yearEl);

    var eventsEl = el('div', 'tlv2-group__events');
    group.events.forEach(function (event) {
      eventsEl.appendChild(buildEvent(event));
    });
    groupEl.appendChild(eventsEl);

    return groupEl;
  }

  function buildEvent(event) {
    var classes = ['tlv2-event', 'tlv2-event--' + (event.nodeStyle || 'outline')];
    if (event.future) { classes.push('tlv2-event--future'); }
    if (event.emphasis) { classes.push('tlv2-event--emphasis'); }
    var article = el('article', classes.join(' '));

    var dateEl = el('div', 'tlv2-event__date');
    dateEl.textContent = shortDate(event);
    article.appendChild(dateEl);

    var railEl = el('div', 'tlv2-event__rail');
    railEl.setAttribute('aria-hidden', 'true');
    railEl.appendChild(el('span', 'tlv2-event__node'));
    article.appendChild(railEl);

    var bodyEl = el('div', 'tlv2-event__body');

    var markerEl = el('p', 'tlv2-event__marker');
    markerEl.textContent = event.marker || event.eventType;
    if (event.emphasis) {
      var tag = el('span', 'tlv2-event__tag');
      tag.textContent = 'Upcoming decision';
      markerEl.appendChild(tag);
    }
    bodyEl.appendChild(markerEl);

    var summaryEl = el('p', 'tlv2-event__summary');
    summaryEl.textContent = event.v2Summary || event.shortTitle || '';
    bodyEl.appendChild(summaryEl);

    var meta = buildMeta(event);
    if (meta) {
      var metaEl = el('p', 'tlv2-event__meta');
      metaEl.textContent = meta;
      bodyEl.appendChild(metaEl);
    }

    bodyEl.appendChild(buildSources(event));

    article.appendChild(bodyEl);
    return article;
  }

  // Derives a compact "Mon. D" label from the existing `date` field
  // (e.g. "APR. 3, 2023" -> "Apr. 3") instead of adding a separate
  // short-date field to the shared data. Year-only CIP entries and the
  // "FUTURE" placeholder entries fall back to short, non-redundant labels
  // since their year is already shown by the enclosing group heading.
  function shortDate(event) {
    var raw = event.date || '';
    var m = raw.match(/^([A-Z]{3})\.\s(\d+),\s\d{4}$/);
    if (m) {
      var month = m[1].charAt(0) + m[1].slice(1).toLowerCase();
      return month + '. ' + m[2];
    }
    if (raw === 'FUTURE') { return ''; }
    if (/^\d{4}$/.test(raw)) { return 'CIP'; }
    return raw;
  }

  // Source metadata line: meeting body / item number where available,
  // falling back to the project/CIP identifier. v2Meta is a small,
  // explicit V2-only override for the one event (Jun. 27, 2023) whose
  // own meeting-item detail lives a level down in V1's subMilestones
  // rather than on the event itself -- everything else here comes
  // straight from fields V1 already uses (agenda, identifier).
  function buildMeta(event) {
    if (event.v2Meta) { return event.v2Meta; }
    if (event.agenda) { return event.agenda; }
    if (event.identifier) { return event.identifier; }
    return '';
  }

  // Every non-pending officialSources entry becomes its own link (using
  // that source's own descriptive label, same convention V1 uses) rather
  // than collapsing multiple sources behind one generic "View source" --
  // several events here cite more than one primary source, and giving
  // each its own accurately-labeled link is more useful on an evidence
  // page than hiding all but the first. A .pdf or absolute-http link
  // opens in a new tab, matching V1's appendOfficialSources() convention
  // (see the inline <script> above); an event with no real source yet
  // renders as the same muted, non-link "Source pending" state V1 uses,
  // never a fabricated href.
  function buildSources(event) {
    var wrap = el('p', 'tlv2-event__sources');
    var sources = (event.officialSources || []).filter(function (s) { return !s.pending; });

    if (!sources.length) {
      var pending = el('span', 'tlv2-event__source tlv2-event__source--pending');
      pending.textContent = 'Source pending';
      wrap.appendChild(pending);
      return wrap;
    }

    sources.forEach(function (source) {
      var a = document.createElement('a');
      a.className = 'tlv2-event__source';
      a.href = source.href;
      var opensNewTab = /^https?:\/\//i.test(source.href) || /\.pdf($|[?#])/i.test(source.href);
      if (opensNewTab) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      a.textContent = source.label;
      wrap.appendChild(a);
    });

    return wrap;
  }

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    return node;
  }

  // ---- Temporary V1/V2 review toggle ----
  //
  // RENGSTORFF_TIMELINE_VERSION sets which prototype is shown by default;
  // change it and reload to flip the page's default without touching
  // anything else. Reviewers can also switch live via the .tlv2-toggle
  // buttons in the page -- that choice is remembered per-browser via
  // localStorage (falling back to the constant below if unavailable, e.g.
  // private browsing) so it survives a reload during review, but it never
  // changes what any other visitor sees by default.
  var RENGSTORFF_TIMELINE_VERSION = 'v2'; // 'v1' | 'v2'
  var STORAGE_KEY = 'rengstorff-timeline-version';

  var v1Wrap = document.getElementById('timeline-v1-wrap');
  var v2Wrap = document.getElementById('timeline-v2-wrap');
  var toggleButtons = document.querySelectorAll('.tlv2-toggle__button');

  function applyVersion(version) {
    var v = version === 'v1' ? 'v1' : 'v2';
    if (v1Wrap) { v1Wrap.hidden = v !== 'v1'; }
    if (v2Wrap) { v2Wrap.hidden = v !== 'v2'; }
    for (var i = 0; i < toggleButtons.length; i++) {
      var btn = toggleButtons[i];
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-timeline-view') === v));
    }
  }

  var initialVersion = RENGSTORFF_TIMELINE_VERSION;
  try {
    var stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'v1' || stored === 'v2') { initialVersion = stored; }
  } catch (e) {
    // localStorage unavailable (private browsing, disabled storage, etc.)
    // -- fall back to the constant above, no functional loss.
  }
  applyVersion(initialVersion);

  for (var i = 0; i < toggleButtons.length; i++) {
    toggleButtons[i].addEventListener('click', function (event) {
      var version = event.currentTarget.getAttribute('data-timeline-view');
      applyVersion(version);
      try { window.localStorage.setItem(STORAGE_KEY, version); } catch (e) { /* ignore */ }
    });
  }
})();
