/*
 * Rengstorff Avenue project timeline -- prototype V2 (vertical timeline).
 *
 * This is a REVERSIBLE PROTOTYPE, reviewed side by side with the existing
 * milestone-card timeline ("V1", built by the inline <script> earlier in
 * cities/mountainview-ca/rengstorff-green-complete-streets/index.html,
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
  var spineEventsEl = null; // set by renderTimelineV2(); read by layoutSpine()

  if (container && events.length) {
    renderTimelineV2(container, events);
  }

  // Renders one flat, continuous stream of rows (year markers and events
  // interleaved in chronological order) rather than separate per-year
  // containers -- see assets/css/rengstorff-timeline-v2.css's
  // .tlv2-events/.tlv2-year-marker/.tlv2-event rules. The rows themselves
  // no longer draw the spine (no per-row line -- see layoutSpine() below
  // for the single global spine that replaces that), but staying flat
  // (not nested per year) is still what lets a year transition sit in
  // the middle of the list with nothing else needed to keep the rows
  // themselves, and the spine passing behind them, reading as one
  // unbroken sequence.
  function renderTimelineV2(root, events) {
    var groups = groupByYear(events);
    var eventsEl = el('div', 'tlv2-events');

    // The spine itself: two elements (solid, then its dashed future
    // continuation) inserted before any row so they sit lowest in paint
    // order within .tlv2-events (see .tlv2-spine's z-index: 0 and
    // .tlv2-event/.tlv2-year-marker's position: relative in the CSS,
    // which is what keeps every row's own content and the horizontal
    // year-boundary rules painting in front of it). Both start [hidden]
    // -- layoutSpine() below sizes and un-hides them once real
    // milestone-node positions are known.
    var spineEl = el('div', 'tlv2-spine');
    spineEl.hidden = true;
    spineEl.setAttribute('aria-hidden', 'true');
    var spineFutureEl = el('div', 'tlv2-spine tlv2-spine--future');
    spineFutureEl.hidden = true;
    spineFutureEl.setAttribute('aria-hidden', 'true');
    eventsEl.appendChild(spineEl);
    eventsEl.appendChild(spineFutureEl);

    groups.forEach(function (group, groupIndex) {
      var isNext = group.key === 'NEXT';
      var label = isNext ? 'Next' : group.key;
      var isFirst = groupIndex === 0;

      eventsEl.appendChild(buildYearMarker(label, { isFirst: isFirst, isNext: isNext }));

      group.events.forEach(function (event) {
        eventsEl.appendChild(buildEvent(event));
      });
    });

    root.appendChild(eventsEl);
    spineEventsEl = eventsEl;

    // Deferred a frame so layout (including web-font metrics, if any)
    // has settled before the first real measurement -- see layoutSpine().
    // (If a stored V1/V2 preference is about to hide #timeline-v2-wrap,
    // applyVersion() re-runs this itself once V2 becomes visible again --
    // see below.)
    window.requestAnimationFrame(layoutSpine);
  }

  // Sizes and positions the single global spine (.tlv2-spine, plus its
  // dashed .tlv2-spine--future continuation) from the FIRST milestone
  // node to the LAST, split at the first `future` milestone (currently
  // the Aug. 31, 2026 review) -- measured with getBoundingClientRect()
  // rather than assumed from CSS box math, so it's exactly right
  // regardless of how tall any event's text happens to wrap, and stays
  // right if that changes (a resize listener below re-runs this). This
  // is what replaces the old approach of every row drawing its own
  // line segment -- there is now exactly one (two-part) line element,
  // not thirteen, so there is nowhere for a per-row seam to appear.
  function layoutSpine() {
    // v2Wrap (declared further down, with the rest of the V1/V2 toggle)
    // is what actually gets hidden/shown -- #timeline-v2 itself never
    // has its own [hidden] attribute set. getBoundingClientRect() on
    // anything inside a hidden ancestor returns all-zero rects, so bail
    // out rather than sizing the spine from bogus zeros; applyVersion()
    // re-calls this once V2 becomes visible again.
    if (!spineEventsEl || (v2Wrap && v2Wrap.hidden)) { return; }

    var nodes = spineEventsEl.querySelectorAll('.tlv2-event__node');
    if (!nodes.length) { return; }

    var spineEl = spineEventsEl.querySelector('.tlv2-spine:not(.tlv2-spine--future)');
    var spineFutureEl = spineEventsEl.querySelector('.tlv2-spine--future');
    if (!spineEl || !spineFutureEl) { return; }

    var containerRect = spineEventsEl.getBoundingClientRect();
    var firstRect = nodes[0].getBoundingClientRect();
    var lastRect = nodes[nodes.length - 1].getBoundingClientRect();
    var centerX = Math.round((firstRect.left + firstRect.right) / 2 - containerRect.left);
    var firstCenterY = (firstRect.top + firstRect.bottom) / 2 - containerRect.top;
    var lastCenterY = (lastRect.top + lastRect.bottom) / 2 - containerRect.top;

    var firstFutureNode = spineEventsEl.querySelector('.tlv2-event--future .tlv2-event__node');
    var splitCenterY = lastCenterY;
    if (firstFutureNode) {
      var splitRect = firstFutureNode.getBoundingClientRect();
      splitCenterY = (splitRect.top + splitRect.bottom) / 2 - containerRect.top;
    }

    spineEl.style.left = centerX + 'px';
    spineEl.style.top = firstCenterY + 'px';
    spineEl.style.height = Math.max(0, splitCenterY - firstCenterY) + 'px';
    spineEl.hidden = false;

    if (firstFutureNode && splitCenterY < lastCenterY) {
      spineFutureEl.style.left = centerX + 'px';
      spineFutureEl.style.top = splitCenterY + 'px';
      spineFutureEl.style.height = (lastCenterY - splitCenterY) + 'px';
      spineFutureEl.hidden = false;
    } else {
      spineFutureEl.hidden = true;
    }
  }

  // Row heights reflow at the 720px mobile breakpoint (and whenever text
  // rewraps at any width), so the spine's measured pixel positions need
  // to be recomputed after a resize, not just once at load.
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(layoutSpine, 150);
  });

  function buildYearMarker(label, options) {
    var classes = ['tlv2-year-marker'];
    if (options.isFirst) { classes.push('tlv2-year-marker--first'); }
    if (options.isNext) { classes.push('tlv2-year-marker--next'); }
    var marker = el('div', classes.join(' '));

    // Empty date-column cell, purely so this row shares the same grid
    // tracks as .tlv2-event and its rail column lines up with theirs --
    // that shared column position is what the global spine (see
    // layoutSpine()) measures its x-position from.
    marker.appendChild(el('div', 'tlv2-year-marker__date'));

    var railEl = el('div', 'tlv2-year-marker__rail');
    railEl.setAttribute('aria-hidden', 'true');
    marker.appendChild(railEl);

    var labelEl = el('div', 'tlv2-year-marker__label');
    labelEl.textContent = label;
    marker.appendChild(labelEl);

    return marker;
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
    var v2WasHidden = v2Wrap && v2Wrap.hidden;
    if (v1Wrap) { v1Wrap.hidden = v !== 'v1'; }
    if (v2Wrap) { v2Wrap.hidden = v !== 'v2'; }
    for (var i = 0; i < toggleButtons.length; i++) {
      var btn = toggleButtons[i];
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-timeline-view') === v));
    }
    // V2 just became visible (either just now, or a stored preference
    // hid it before the very first layoutSpine() call in
    // renderTimelineV2() ever got a chance to measure anything real) --
    // re-measure now that its rows actually have real, on-screen sizes.
    if (v === 'v2' && v2WasHidden) {
      window.requestAnimationFrame(layoutSpine);
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
