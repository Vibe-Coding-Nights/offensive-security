<script lang="ts">
	/**
	 * Landing Page
	 *
	 * Public marketing page for HireFlow.
	 * Includes hero, features, and CTAs.
	 */

	import Button from '$lib/components/ui/Button.svelte';
</script>

<svelte:head>
	<title>HireFlow - AI-Powered Resume Screening</title>
	<meta
		name="description"
		content="Screen candidates faster with AI-powered resume analysis. Get intelligent recommendations in seconds."
	/>
</svelte:head>

<div class="min-h-screen">
	<!-- Navigation -->
	<nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Logo -->
				<a href="/" class="flex items-center gap-2">
					<div class="w-8 h-8 bg-gradient-to-br from-violet-500 to-violet-700 rounded-lg flex items-center justify-center">
						<span class="text-white font-bold text-sm">H</span>
					</div>
					<span class="text-xl font-semibold text-gray-900">HireFlow</span>
				</a>

				<!-- Navigation Links -->
				<div class="hidden md:flex items-center gap-8">
					<a href="#features" class="text-sm text-gray-600 hover:text-gray-900">Features</a>
					<a href="#pricing" class="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
					<a href="/login" class="text-sm text-gray-600 hover:text-gray-900">Log in</a>
					<Button href="/signup" variant="primary" size="sm">
						{#snippet children()}
							Get Started
						{/snippet}
					</Button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
		<div class="max-w-4xl mx-auto text-center">
			<!-- Badge -->
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-sm font-medium mb-6">
				<span class="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
				AI-Powered Screening
			</div>

			<!-- Headline -->
			<h1 class="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-6">
				Find great candidates
				<span class="text-gradient">in seconds</span>
			</h1>

			<!-- Subheadline -->
			<p class="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
				HireFlow uses AI to analyze resumes and surface the best candidates instantly.
				Stop spending hours on manual screening.
			</p>

			<!-- CTAs -->
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
				<Button href="/signup" variant="primary" size="lg">
					{#snippet children()}
						Start Free Trial
					{/snippet}
				</Button>
				<Button href="#demo" variant="secondary" size="lg">
					{#snippet children()}
						Watch Demo
					{/snippet}
				</Button>
			</div>
		</div>

		<!-- Hero Image -->
		<div class="max-w-5xl mx-auto mt-16">
			<div class="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
				<div class="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent pointer-events-none"></div>
				<div class="aspect-[16/10] bg-gray-100 flex items-center justify-center">
					<!-- Placeholder for dashboard screenshot -->
					<div class="p-8 w-full">
						<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
							<div class="flex items-center gap-4 mb-4">
								<div class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
									<span class="text-2xl font-bold text-emerald-600">9</span>
								</div>
								<div>
									<div class="h-4 w-32 bg-gray-200 rounded mb-2"></div>
									<div class="h-3 w-48 bg-gray-100 rounded"></div>
								</div>
								<div class="ml-auto">
									<span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg">
										Interview
									</span>
								</div>
							</div>
							<div class="space-y-2">
								<div class="h-3 w-full bg-gray-100 rounded"></div>
								<div class="h-3 w-3/4 bg-gray-100 rounded"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="py-20 bg-white border-y border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-3xl font-bold text-gray-900 mb-4">
					Everything you need to hire faster
				</h2>
				<p class="text-lg text-gray-600 max-w-2xl mx-auto">
					From resume parsing to candidate recommendations, HireFlow handles the heavy lifting.
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-8">
				<!-- Feature 1 -->
				<div class="card p-6">
					<div class="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
						<svg class="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">AI-Powered Scoring</h3>
					<p class="text-gray-600">
						Every resume is automatically analyzed and scored against your job requirements.
					</p>
				</div>

				<!-- Feature 2 -->
				<div class="card p-6">
					<div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
						<svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Instant Analysis</h3>
					<p class="text-gray-600">
						Get detailed candidate analysis in seconds, not hours. Focus on what matters.
					</p>
				</div>

				<!-- Feature 3 -->
				<div class="card p-6">
					<div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
						<svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Team Collaboration</h3>
					<p class="text-gray-600">
						Share candidates, leave notes, and make decisions together as a team.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-20 px-4 sm:px-6 lg:px-8">
		<div class="max-w-3xl mx-auto text-center">
			<h2 class="text-3xl font-bold text-gray-900 mb-4">
				Ready to hire smarter?
			</h2>
			<p class="text-lg text-gray-600 mb-8">
				Join hundreds of teams using HireFlow to find the best candidates.
			</p>
			<Button href="/signup" variant="primary" size="lg">
				{#snippet children()}
					Get Started Free
				{/snippet}
			</Button>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-gray-900 text-gray-400 py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col md:flex-row items-center justify-between gap-4">
				<div class="flex items-center gap-2">
					<div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
						<span class="text-white font-bold text-sm">H</span>
					</div>
					<span class="text-white font-semibold">HireFlow</span>
				</div>
				<p class="text-sm">
					© 2024 HireFlow. All rights reserved.
				</p>
			</div>
		</div>
	</footer>
</div>
