import { writable } from 'svelte/store';

export const status = writable('');
export const drops = writable([]);
export const oppHoverColumn = writable(undefined);
export const oppDropColumn = writable(undefined);
export const hoverColumn = writable(undefined);
export const dropColumn = writable(undefined);
