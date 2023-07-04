import { c as create_ssr_component, d as createEventDispatcher, f as each, v as validate_component, b as subscribe } from "../../chunks/index.js";
import { w as writable } from "../../chunks/index2.js";
import { io } from "socket.io-client";
const isPlayerTurn = writable(true);
const Slot_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: `.slot.svelte-1es4fq7{--slotImage:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0v50A50 50 0 0 1 50 0H0zm50 0a50 50 0 0 1 50 50V0H50zm50 50a50 50 0 0 1-50 50h50V50zm-50 50A50 50 0 0 1 0 50v50h50z' style='fill:%2300a;fill-rule:evenodd;'/%3E%3Ccircle cx='50' cy='50' r='48' style='fill:none;stroke:%2300a;stroke-width:5;'/%3E%3C/svg%3E");--discImage:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle fill='%2388f' stroke='%23ddf' stroke-width='5' cx='50' cy='50' r='45' /%3E%3C/svg%3E%0A");--discImagePrimary:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle fill='%23e00' stroke='%23b00' stroke-width='5' cx='50' cy='50' r='45' /%3E%3C/svg%3E%0A");--discImageSecondary:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle fill='%23ffe819' stroke='%23ffc010' stroke-width='5' cx='50' cy='50' r='45' /%3E%3C/svg%3E%0A");--discSize:4rem;display:grid;place-content:center;width:var(--discSize);height:var(--discSize);position:relative;cursor:pointer}.slot.svelte-1es4fq7::after,.slot.svelte-1es4fq7::before{content:'';position:absolute;inset:0px;background-repeat:no-repeat;background-position:center;background-image:none}.slot.svelte-1es4fq7::after{content:'';z-index:1;outline:2px solid #00a;outline-offset:-1px;background-image:var(--slotImage)}.slot.hover.svelte-1es4fq7::after{z-index:1;filter:brightness(1.5)}.slot.drophint.svelte-1es4fq7::before{background-image:var(--discImage)}.slot.dance.svelte-1es4fq7::before{isolation:isolate;z-index:2;transform:scale(1.1);animation:250ms ease-out infinite alternate svelte-1es4fq7-disc-dance}.slot.primary.svelte-1es4fq7::before{background-image:var(--discImagePrimary)}.slot.secondary.svelte-1es4fq7::before{background-image:var(--discImageSecondary)}.slot.svelte-1es4fq7:is(.primary, .secondary)::before{filter:initial;animation-name:svelte-1es4fq7-disc-drop;animation-duration:1200ms}@keyframes svelte-1es4fq7-disc-dance{0%{transform:scale(1)}100%{transform:scale(1.1)}}@keyframes svelte-1es4fq7-disc-drop{0%{transform:translateY(-590px);animation-timing-function:ease-in}50%{transform:translateY(0px);animation-timing-function:ease-out}60%{transform:translateY(-250px);animation-timing-function:ease-in}75%{transform:translateY(0px);animation-timing-function:ease-out}80%{transform:translateY(-80px);animation-timing-function:ease-in}90%{transform:translateY(0px)}}`,
  map: null
};
const Slot = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { slot = 0 } = $$props;
  let { hover = false } = $$props;
  let { drophint = false } = $$props;
  let { dance = false } = $$props;
  if ($$props.slot === void 0 && $$bindings.slot && slot !== void 0)
    $$bindings.slot(slot);
  if ($$props.hover === void 0 && $$bindings.hover && hover !== void 0)
    $$bindings.hover(hover);
  if ($$props.drophint === void 0 && $$bindings.drophint && drophint !== void 0)
    $$bindings.drophint(drophint);
  if ($$props.dance === void 0 && $$bindings.dance && dance !== void 0)
    $$bindings.dance(dance);
  $$result.css.add(css$3);
  return `<div class="${[
    "slot svelte-1es4fq7",
    (hover ? "hover" : "") + " " + (drophint ? "drophint" : "") + " " + (dance ? "dance" : "") + " " + (slot === 1 ? "primary" : "") + " " + (slot === 2 ? "secondary" : "")
  ].join(" ").trim()}"></div>`;
});
const Column_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: ".column.svelte-1jua7ev{display:flex;flex-flow:column nowrap}",
  map: null
};
const Column = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let hovered;
  createEventDispatcher();
  let { columnIndex = -1 } = $$props;
  let { rows = [] } = $$props;
  isPlayerTurn.subscribe((value) => {
  });
  if ($$props.columnIndex === void 0 && $$bindings.columnIndex && columnIndex !== void 0)
    $$bindings.columnIndex(columnIndex);
  if ($$props.rows === void 0 && $$bindings.rows && rows !== void 0)
    $$bindings.rows(rows);
  $$result.css.add(css$2);
  hovered = -1;
  return `<div class="${"column svelte-1jua7ev"}">${each(rows, (slot, slotIndex) => {
    return `${validate_component(Slot, "Slot").$$render(
      $$result,
      {
        slot,
        hover: hovered >= 0,
        drophint: hovered == slotIndex
      },
      {},
      {}
    )}`;
  })}
</div>`;
});
const Grid_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".grid.svelte-11m4irl{display:flex;flex-flow:row nowrap}",
  map: null
};
const Grid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { columns = Array(7) } = $$props;
  if ($$props.columns === void 0 && $$bindings.columns && columns !== void 0)
    $$bindings.columns(columns);
  $$result.css.add(css$1);
  return `<div class="${"grid svelte-11m4irl"}">${each(columns, (column, columnIndex) => {
    return `${validate_component(Column, "Column").$$render($$result, { columnIndex, rows: Array(6).fill(0) }, {}, {})}`;
  })}
</div>`;
});
const Banner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isPlayerTurn, $$unsubscribe_isPlayerTurn;
  $$unsubscribe_isPlayerTurn = subscribe(isPlayerTurn, (value) => $isPlayerTurn = value);
  $$unsubscribe_isPlayerTurn();
  return `${$isPlayerTurn ? `<h1>Your turn
	</h1>` : `<h1>Opponent&#39;s turn
	</h1>`}`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-1m4a34k{display:flex}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const socket = io();
  socket.on("eventFromServer", (message) => {
    console.log(message);
  });
  $$result.css.add(css);
  return `${validate_component(Banner, "Banner").$$render($$result, {}, {}, {})}
<main class="${"svelte-1m4a34k"}">${validate_component(Grid, "Grid").$$render($$result, {}, {}, {})}
</main>`;
});
export {
  Page as default
};
