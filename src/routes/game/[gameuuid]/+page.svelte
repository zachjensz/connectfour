<script>
  /** @type {import('./$types').PageData} */
  export let data
  const gameuuid = data.gameuuid

  import Grid from '$lib/Grid.svelte'
  import Banner from '$lib/Banner.svelte'

  import { io } from 'socket.io-client'
  const socket = io()
  socket.emit('join', gameuuid, async (confirm) => {
    console.log(confirm)
  })
</script>

<Banner />
<main>
  <Grid />
</main>

<style>
  main {
    display: flex;
  }
</style>
