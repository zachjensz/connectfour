<script>
  import Column from './lib/Column.svelte'
  import Slot from './lib/Slot.svelte'
</script>

<main>
  <Column rows={[0, 0, 0, 0, 0, 1]}/>
  <Column />
  <Column rows={[0, 0, 0, 1, 1, 2]}/>
  <Column />
  <Column />
  <Column />
  <Column />
</main>

<style>
  main {
    display: flex;
  }
</style>
