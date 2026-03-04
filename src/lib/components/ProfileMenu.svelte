<script lang="ts">
  import Button from "./ui/Button.svelte";
  import { LogOutIcon } from "@lucide/svelte";
  import { DropdownMenu, Button as BitsUiButton } from "bits-ui";
  import { scale } from "svelte/transition";

  const { user }: { user: { name: string; email: string; picture: string } | null } = $props();
</script>

{#if user}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <img
        src={user.picture}
        alt={user.name}
        class="size-10 cursor-pointer rounded-full transition-transform active:scale-90 active:opacity-50"
        referrerpolicy="no-referrer"
      />
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content align="end" forceMount preventScroll={false}>
        {#snippet child({ props, open, wrapperProps })}
          <div {...wrapperProps}>
            {#if open}
              <div
                {...props}
                class="z-1000 flex origin-top-right flex-col gap-2 pt-2"
                transition:scale={{ start: 0.9, duration: 150 }}
              >
                <div class="rounded-2xl bg-mist-700 p-4">
                  <p class="font-medium">{user.name}</p>
                  <p class="text-sm opacity-50">{user.email}</p>
                </div>
                <form method="POST" action="/auth/logout">
                  <Button type="submit" variant="secondary" icon={LogOutIcon} class="w-full">
                    Sign Out
                  </Button>
                </form>
              </div>
            {/if}
          </div>
        {/snippet}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
{:else}
  <Button variant="secondary" href="/auth/login">Sign in with Google</Button>
{/if}
