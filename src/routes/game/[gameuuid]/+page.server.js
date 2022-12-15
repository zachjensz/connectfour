import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const game = (params.gameuuid == "zach");
 
  if (game) {
    return params;
  }
 
  throw error(404, params.gameuuid);
}
