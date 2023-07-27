import { writable } from 'svelte/store';

export const status = writable('');
export const drops = writable([]);
export const columnCount = writable(7);
export const rowCount = writable(6);
export const oppHoverColumn = writable(undefined);
export const oppDropColumn = writable(undefined);
export const hoverColumn = writable(undefined);
export const dropColumn = writable(undefined);
export const winPositions = writable([]);
