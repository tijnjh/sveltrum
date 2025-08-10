<script>
  import Button from '$lib/components/ui/button/button.svelte'
  import Input from '$lib/components/ui/input/input.svelte'
</script>

<div class='max-w-xl mx-auto p-4 flex flex-col gap-4'>

  <h1 class='mx-auto text-center text-2xl font-medium'>Sveltrum</h1>

  <form action='/search' class='flex gap-2'>
    <Input name='q' />
    <Button type='submit'>Search</Button>
  </form>
</div>
