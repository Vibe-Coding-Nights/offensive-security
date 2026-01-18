<script lang="ts">
	/**
	 * Public Job Application Form
	 *
	 * Candidates use this page to apply for open positions.
	 */

	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';

	let { data, form } = $props();
	const job = data.job;

	// Format salary display
	const salaryDisplay = job.salaryMin && job.salaryMax
		? `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k`
		: job.salaryMin
		? `From $${(job.salaryMin / 1000).toFixed(0)}k`
		: '';

	// Form state
	let resumeFile = $state<File | null>(null);
	let isSubmitting = $state(false);

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			resumeFile = input.files[0];
		}
	}
</script>

<svelte:head>
	<title>{job.title} at {job.org.name} - Apply Now</title>
	<meta name="description" content="Apply for {job.title} at {job.org.name}. {job.location}. {salaryDisplay}." />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-3xl mx-auto">
		{#if form?.success}
			<!-- Success State -->
			<div class="card p-8 text-center">
				<div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h1 class="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
				<p class="text-gray-600 mb-6">
					Thank you for applying to {job.title} at {job.org.name}. We'll review your application and get back to you soon.
				</p>
				<p class="text-sm text-gray-500">
					Your resume is now being analyzed by our AI system...
				</p>
			</div>
		{:else}
			<!-- Header -->
			<div class="mb-8">
				<a href="/" class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Back to Jobs
				</a>

				<div class="flex items-start gap-4">
					<div class="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
						<span class="text-violet-700 font-bold text-lg">{job.org.name[0]}</span>
					</div>
					<div>
						<h1 class="text-2xl font-bold text-gray-900">{job.title}</h1>
						<p class="text-gray-600">{job.org.name} {job.location ? `• ${job.location}` : ''}</p>
						{#if salaryDisplay}
							<p class="text-emerald-600 font-medium mt-1">{salaryDisplay}</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="grid lg:grid-cols-3 gap-6">
				<!-- Job Details -->
				<div class="lg:col-span-1 lg:order-2">
					<div class="card p-5 sticky top-6">
						<h2 class="font-semibold text-gray-900 mb-3">About this role</h2>
						<p class="text-sm text-gray-600 whitespace-pre-line mb-4">{job.description}</p>

						<h3 class="font-medium text-gray-900 mb-2">Requirements</h3>
						<p class="text-sm text-gray-600 whitespace-pre-line">{job.requirements}</p>
					</div>
				</div>

				<!-- Application Form -->
				<div class="lg:col-span-2 lg:order-1">
					<form
						method="POST"
						enctype="multipart/form-data"
						class="card p-6"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								await update();
								isSubmitting = false;
							};
						}}
					>
						<h2 class="text-lg font-semibold text-gray-900 mb-6">Apply for this position</h2>

						{#if form?.message && !form?.success}
							<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
								{form.message}
							</div>
						{/if}

						<div class="space-y-5">
							<!-- Name -->
							<Input
								label="Full Name"
								name="name"
								placeholder="Jane Doe"
								required
							/>

							<!-- Email -->
							<Input
								label="Email"
								name="email"
								type="email"
								placeholder="jane@example.com"
								required
							/>

							<!-- Phone (optional) -->
							<Input
								label="Phone"
								name="phone"
								type="tel"
								placeholder="+1 (555) 123-4567"
							/>

							<!-- LinkedIn (optional) -->
							<Input
								label="LinkedIn Profile"
								name="linkedin"
								type="url"
								placeholder="https://linkedin.com/in/janedoe"
							/>

							<!-- Portfolio (optional) -->
							<Input
								label="Portfolio / Website"
								name="portfolio"
								type="url"
								placeholder="https://janedoe.dev"
							/>

							<!-- Resume Upload -->
							<div>
								<label class="label">
									Resume / CV
									<span class="text-red-500">*</span>
								</label>
								<div class="mt-1">
									<label
										class="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-200 border-dashed rounded-lg appearance-none cursor-pointer hover:border-gray-300 focus:outline-none"
									>
										{#if resumeFile}
											<span class="flex items-center space-x-2 text-gray-600">
												<svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
												<span class="font-medium">{resumeFile.name}</span>
											</span>
										{:else}
											<span class="flex flex-col items-center justify-center space-y-2 text-gray-600">
												<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
												</svg>
												<span class="text-sm">
													<span class="font-medium text-violet-600">Upload a file</span> or drag and drop
												</span>
												<span class="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</span>
											</span>
										{/if}
										<input
											type="file"
											name="resume"
											class="hidden"
											accept=".pdf,.doc,.docx"
											onchange={handleFileChange}
											required
										/>
									</label>
								</div>
								<p class="helper-text">
									Your resume will be analyzed by AI to match against job requirements.
								</p>
							</div>

							<!-- Cover Letter (optional) -->
							<Textarea
								label="Cover Letter (optional)"
								name="coverLetter"
								placeholder="Tell us why you're interested in this role..."
								rows={5}
								maxlength={5000}
							/>

							<!-- Submit -->
							<div class="pt-4">
								<Button
									type="submit"
									variant="primary"
									size="lg"
									loading={isSubmitting}
								>
									{#snippet children()}
										{isSubmitting ? 'Submitting...' : 'Submit Application'}
									{/snippet}
								</Button>
							</div>

							<!-- Privacy Notice -->
							<p class="text-xs text-gray-500">
								By submitting this application, you agree to our privacy policy.
								Your resume will be processed by our AI system to evaluate your qualifications.
							</p>
						</div>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>
