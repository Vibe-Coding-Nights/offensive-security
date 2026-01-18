<script lang="ts">
	/**
	 * New Job Page
	 *
	 * Create a new job posting.
	 */

	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';

	let { form } = $props();
	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>New Job - HireFlow</title>
</svelte:head>

<div class="p-6 max-w-3xl mx-auto">
	<div class="mb-8">
		<a href="/jobs" class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
			Back to Jobs
		</a>
		<h1 class="text-2xl font-bold text-gray-900">Create New Job</h1>
		<p class="text-gray-600 mt-1">Fill in the details for your new job posting.</p>
	</div>

	{#if form?.message}
		<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
			{form.message}
		</div>
	{/if}

	<form
		method="POST"
		class="card p-6 space-y-6"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}}
	>
		<!-- Job Title -->
		<Input
			label="Job Title"
			name="title"
			placeholder="e.g., Senior Frontend Engineer"
			required
		/>

		<!-- Location -->
		<Input
			label="Location"
			name="location"
			placeholder="e.g., Remote, San Francisco, CA"
		/>

		<!-- Salary Range -->
		<div class="grid grid-cols-2 gap-4">
			<Input
				label="Minimum Salary"
				name="salaryMin"
				type="number"
				placeholder="100000"
			/>
			<Input
				label="Maximum Salary"
				name="salaryMax"
				type="number"
				placeholder="150000"
			/>
		</div>

		<!-- Description -->
		<Textarea
			label="Job Description"
			name="description"
			placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
			rows={6}
			required
		/>

		<!-- Requirements -->
		<Textarea
			label="Requirements"
			name="requirements"
			placeholder="List the skills, experience, and qualifications needed for this role..."
			rows={6}
			required
		/>

		<!-- Submit -->
		<div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
			<Button href="/jobs" variant="secondary">
				{#snippet children()}
					Cancel
				{/snippet}
			</Button>
			<Button type="submit" variant="primary" loading={isSubmitting}>
				{#snippet children()}
					{isSubmitting ? 'Creating...' : 'Create Job'}
				{/snippet}
			</Button>
		</div>
	</form>
</div>
