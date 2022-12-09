<script>
  import Grid from '$lib/Grid.svelte'
  import Banner from '$lib/Banner.svelte'

  import { io } from 'socket.io-client'

  const socket = io()

  socket.on('eventFromServer', (message) => {
    console.log(message)
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
