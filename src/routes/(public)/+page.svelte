<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { APP_NAME } from '$lib/config/constants';
	import heroImg from '$lib/assets/hero-img.jpg';
	import { env } from '$env/dynamic/public';
</script>

<svelte:head>
	<title>Dental Staffing Solutions Made Simple | {APP_NAME}</title>
	<meta
		name="description"
		content="Sveltekit Auth Starter - An open source auth starter project utilizing lucia-auth, skeleton ui, prisma and sveltekit."
	/>
</svelte:head>

<div class="flex-1">
	<section id="hero" class="py-20 md:py-40 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col md:flex-row items-center">
				<div class="md:w-1/2 mb-10 md:mb-0">
					<h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
						Connecting Dental Professionals Within a Private Member Association
					</h1>
					<p class="mt-3 text-base text-blue-100 sm:mt-5 sm:text-xl">
						DentalStaff.US is a secure platform for dental professionals and practices to connect,
						collaborate, and conduct business.
					</p>
					<div class="mt-8 flex flex-col sm:flex-row gap-4">
						<a
							href={`${env.PUBLIC_CLIENT_APP_DOMAIN}/auth/sign-up`}
							class="bg-white text-blue-800 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-50 transition duration-300"
						>
							Find Talent Now
						</a>
						<a
							href="/auth/sign-up"
							class="bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-blue-800 transition duration-300"
						>
							Find Jobs Now
						</a>
					</div>
				</div>
				<div class="md:w-1/2">
					<img src={heroImg} alt="Staffing Services" class="rounded-lg shadow-xl" />
				</div>
			</div>
		</div>
	</section>

	<!-- <section id="logos" class="py-12 bg-gray-100">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<p class="text-center text-gray-600 font-medium mb-8">
				Trusted by industry-leading companies
			</p>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center">
				<div class="h-12 flex items-center justify-center">
					<div class="bg-gray-400 w-32 h-12 rounded"></div>
				</div>
				<div class="h-12 flex items-center justify-center">
					<div class="bg-gray-400 w-32 h-12 rounded"></div>
				</div>
				<div class="h-12 flex items-center justify-center">
					<div class="bg-gray-400 w-32 h-12 rounded"></div>
				</div>
				<div class="h-12 flex items-center justify-center">
					<div class="bg-gray-400 w-32 h-12 rounded"></div>
				</div>
				<div class="h-12 flex items-center justify-center">
					<div class="bg-gray-400 w-32 h-12 rounded"></div>
				</div>
				<div class="h-12 flex items-center justify-center">
					<div class="bg-gray-400 w-32 h-12 rounded"></div>
				</div>
			</div>
		</div>
	</section> -->

	<section id="why-choose-us" class="py-16 bg-white">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
					Why Choose <span class="text-blue-800">DentalStaff.US</span>?
				</h2>
				<p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
					We empower the dental industry with tailored staffing solutions that connect professionals
					and practices, ensuring compliance and quality in every placement.
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-8">
				<div
					class="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
				>
					<div
						class="inline-flex items-center justify-center p-2 bg-blue-800 rounded-md text-white mb-4"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-2">PMA Benefits</h3>
					<p class="text-gray-600">
						Our ecclesiastic structure provides members with privacy protection and operates under
						common law principles, creating a trusted environment for professional relationships and
						business interactions.
					</p>
				</div>

				<div
					class="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
				>
					<div
						class="inline-flex items-center justify-center p-2 bg-blue-800 rounded-md text-white mb-4"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-2">Comprehensive Platform</h3>
					<p class="text-gray-600">
						From requisition management to automated billing, our platform handles the
						administrative details so you can focus on what matters most - quality dental care and
						professional growth.
					</p>
				</div>

				<div
					class="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
				>
					<div
						class="inline-flex items-center justify-center p-2 bg-blue-800 rounded-md text-white mb-4"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-2">Dental Industry Expertise</h3>
					<p class="text-gray-600">
						Built specifically for the dental industry by professionals who understand your unique
						staffing challenges and opportunities.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section id="business-members" class="py-16 bg-gray-50">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="md:flex md:items-center md:justify-between">
				<div class="md:w-1/2 mb-8 md:mb-0 md:pr-8">
					<h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
						For <span class="text-blue-800">Business Members</span>
					</h2>
					<p class="text-muted-foreground mb-6">Dental Practices & Organizations</p>
					<p class="text-xl text-gray-600 mb-6">
						Transform how your dental practice manages temporary and permanent staffing needs
						through our comprehensive platform designed exclusively for our business members.
					</p>
					<ul class="space-y-4">
						<li class="flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-blue-800 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span class="text-gray-700">Temporary and Permanent staffing placement</span>
						</li>
						<li class="flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-blue-800 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span class="text-gray-700">Requisition Management Tools</span>
						</li>
						<li class="flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-blue-800 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span class="text-gray-700">Automatic Billing & Invoicing</span>
						</li>
						<li class="flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-blue-800 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span class="text-gray-700">Payroll and compliance services</span>
						</li>
						<li class="flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-blue-800 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span class="text-gray-700">Timesheet Management</span>
						</li>
						<li class="flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-blue-800 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span class="text-gray-700">Location & Staff Management</span>
						</li>
					</ul>
					<Button
						href={`${env.PUBLIC_CLIENT_APP_DOMAIN}/auth/sign-up`}
						variant="default"
						class="bg-blue-800 hover:bg-blue-900 mt-8">Hire Talent Now</Button
					>
				</div>
				<div class="md:w-1/2">
					<img
						src="/api/placeholder/600/400"
						alt="Employer Services"
						class="rounded-lg shadow-xl"
					/>
				</div>
			</div>
		</div>
	</section>

	<section id="professional-members" class="py-16 bg-white">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="md:flex md:items-center md:justify-between">
				<div class="md:w-1/2 md:order-2 mb-8 md:mb-0 md:pl-8">
					<h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
						For <span class="text-blue-800">Professional Members</span>
					</h2>
					<p class="text-muted-foreground mb-6">Dental Staff & Professionals</p>
					<p class="text-xl text-gray-600 mb-6">
						Join a private association of dental professionals where you control your schedule,
						choose your assignments, and connect with practices that value your expertise.
					</p>
					<ul class="space-y-4">
						<li class="flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-blue-800 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span class="text-gray-700">Flexible Opportunities</span>
						</li>
						<li class="flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-blue-800 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span class="text-gray-700">Simplified Operations</span>
						</li>
						<li class="flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-blue-800 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span class="text-gray-700">Professional Community</span>
						</li>
						<li class="flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-blue-800 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<span class="text-gray-700">Streamlined payment processes</span>
						</li>
					</ul>
					<Button href="/auth/sign-up" variant="default" class="bg-blue-800 hover:bg-blue-900 mt-8"
						>Find Jobs Now</Button
					>
				</div>
				<div class="md:w-1/2 md:order-1">
					<img
						src="/api/placeholder/600/400"
						alt="Candidate Services"
						class="rounded-lg shadow-xl"
					/>
				</div>
			</div>
		</div>
	</section>

	<!-- <section id="testimonials" class="py-16 bg-gray-50">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
					What People Are <span class="text-blue-800">Saying</span>
				</h2>
				<p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
					Hear from our satisfied clients and successful placements.
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-8">
				<div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
					<div class="flex items-center mb-4">
						<div class="text-yellow-400 flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
						</div>
					</div>
					<p class="text-gray-700 mb-4">
						"Elite Staffing helped us fill three critical positions in less than two weeks. The
						candidates were perfectly matched to our company culture and technical needs."
					</p>
					<div class="flex items-center">
						<div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
						<div class="ml-3">
							<p class="text-sm font-medium text-gray-900">Sarah Johnson</p>
							<p class="text-sm text-gray-500">HR Director, TechCore Inc.</p>
						</div>
					</div>
				</div>

				<div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
					<div class="flex items-center mb-4">
						<div class="text-yellow-400 flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
						</div>
					</div>
					<p class="text-gray-700 mb-4">
						"The career coaching I received was transformative. My recruiter was patient,
						insightful, and helped me secure a position that pays 30% more than my previous role."
					</p>
					<div class="flex items-center">
						<div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
						<div class="ml-3">
							<p class="text-sm font-medium text-gray-900">Michael Chen</p>
							<p class="text-sm text-gray-500">Software Engineer</p>
						</div>
					</div>
				</div>

				<div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
					<div class="flex items-center mb-4">
						<div class="text-yellow-400 flex">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
						</div>
					</div>
					<p class="text-gray-700 mb-4">
						"As a healthcare facility with strict compliance requirements, we needed specialized
						talent quickly. Elite Staffing delivered pre-vetted candidates who hit the ground
						running from day one."
					</p>
					<div class="flex items-center">
						<div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
						<div class="ml-3">
							<p class="text-sm font-medium text-gray-900">Robert Williams</p>
							<p class="text-sm text-gray-500">Operations Manager, MedTech Solutions</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section> -->

	<section id="cta" class="py-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="lg:flex lg:items-center lg:justify-between">
				<div class="lg:w-3/5">
					<h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
						Ready to transform your hiring process?
					</h2>
					<p class="mt-3 max-w-3xl text-lg">
						Whether you're looking to hire top talent or advance your career, our team is ready to
						help you achieve your goals. Let's connect today and explore how we can work together.
					</p>
					<div class="mt-8 flex flex-col sm:flex-row gap-4">
						<a
							href={`${env.PUBLIC_CLIENT_APP_DOMAIN}/auth/sign-up`}
							class="bg-white text-blue-800 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-50 transition duration-300"
						>
							Find Your Next Hire
						</a>
						<!-- <a
							href="/auth/sign-up"
							class="bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-blue-800 transition duration-300"
							>Find Your Next Job
						</a> -->
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<!-- <section id="stats" class="py-16 bg-white">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-extrabold text-gray-900">Our Track Record</h2>
				<p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
					We've helped thousands of companies and professionals achieve their goals.
				</p>
			</div>

			<div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
				<div class="p-6">
					<p class="text-4xl font-bold text-blue-800">15+</p>
					<p class="mt-2 text-gray-600 font-medium">Years in Business</p>
				</div>

				<div class="p-6">
					<p class="text-4xl font-bold text-blue-800">5,000+</p>
					<p class="mt-2 text-gray-600 font-medium">Successful Placements</p>
				</div>

				<div class="p-6">
					<p class="text-4xl font-bold text-blue-800">97%</p>
					<p class="mt-2 text-gray-600 font-medium">Client Satisfaction</p>
				</div>

				<div class="p-6">
					<p class="text-4xl font-bold text-blue-800">12</p>
					<p class="mt-2 text-gray-600 font-medium">Industry Specializations</p>
				</div>
			</div>
		</div>
	</section> -->

	<!-- Contact Form Section -->
	<section id="contact-us" class="py-20 bg-white">
		<div class="container mx-auto px-4">
			<div class="flex flex-col md:flex-row">
				<!-- Left Side - Content -->
				<div
					class="w-full md:w-1/2 bg-blue-800 text-white p-12 md:p-16 lg:p-20 flex flex-col justify-center"
				>
					<h2 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
						Not sure DentalStaff.US is right for you? <p class="text-blue-300">Book A Demo</p>
					</h2>
					<p class="text-lg text-blue-100 mb-8">
						Whether you're seeking exceptional talent or your next opportunity, we're here to guide
						you every step of the way.
					</p>
					<div class="space-y-6 mt-4">
						<div class="flex items-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 mr-3 text-blue-300"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							<div>
								<h3 class="font-semibold text-blue-300">Email</h3>
								<p class="mt-1">support@dentalstaff.us</p>
							</div>
						</div>
						<div class="flex items-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 mr-3 text-blue-300"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
							<div>
								<h3 class="font-semibold text-blue-300">Phone</h3>
								<p class="mt-1">(888) 800-4224</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Right Side - Form -->
				<div class="w-full md:w-1/2 md:p-16 lg:p-20 bg-white flex flex-col justify-center">
					<h3 class="text-2xl font-semibold text-gray-900 mb-8">Get in Touch</h3>
					<form class="space-y-6" method="POST" action="https://api.web3forms.com/submit">
						<input type="hidden" name="access_key" value="f3a3d4cd-057b-4db5-bfd0-77e92cb67b27" />
						<input type="hidden" name="subject" value="New Submission from Website." />
						<input type="hidden" name="from_name" value="DentalStaff US Contact Form" />
						<div>
							<input
								name="full_name"
								type="text"
								placeholder="Full Name"
								class="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-800 focus:outline-none transition-colors bg-transparent"
							/>
						</div>
						<div>
							<input
								name="email"
								type="email"
								placeholder="Email Address"
								class="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-800 focus:outline-none transition-colors bg-transparent"
							/>
						</div>
						<div>
							<select
								name="user_type"
								class="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-800 focus:outline-none transition-colors bg-transparent"
							>
								<option value="" selected disabled>I am a...</option>
								<option value="Professional Member"
									>Professional Service Provider to Dental Organizations</option
								>
								<option value="Business Member"
									>Business Providing Dental Care Services to Patients</option
								>
							</select>
						</div>
						<div>
							<textarea
								name="message"
								placeholder="Your Message"
								rows="4"
								class="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-800 focus:outline-none transition-colors bg-transparent"
							></textarea>
						</div>
						<div>
							<button
								type="submit"
								class="w-full bg-blue-800 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
							>
								Send Message
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-gray-900 text-white">
		<div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
				<!-- Company Info -->
				<div class="col-span-1 md:col-span-1">
					<div class="text-xl font-bold mb-4">
						DentalStaff<span class="text-blue-400">.US</span>
					</div>
					<p class="text-gray-400 mb-4">
						DentalStaff.US is the property of DentalStaff United a Private Member Association (PMA),
						managed by:
					</p>
					<div class="mb-4">
						<p class="text-gray-400 mb-1">Blue Water Business Associates, LLC</p>
						<p class="text-gray-400 mb-1">411 N 6 th Street #7228</p>
						<p class="text-gray-400 mb-1">Emery, SD 57332</p>
					</div>
					<div class="flex space-x-4">
						<a href={null} class="text-gray-400 hover:text-white">
							<span class="sr-only">Facebook</span>
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									fill-rule="evenodd"
									d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
									clip-rule="evenodd"
								></path>
							</svg>
						</a>
						<a href={null} class="text-gray-400 hover:text-white">
							<span class="sr-only">Twitter</span>
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
								></path>
							</svg>
						</a>
						<a href={null} class="text-gray-400 hover:text-white">
							<span class="sr-only">LinkedIn</span>
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									fill-rule="evenodd"
									d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
									clip-rule="evenodd"
								></path>
							</svg>
						</a>
					</div>
				</div>

				<!-- For Employers -->
				<div>
					<h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
						For Business Members
					</h3>
					<ul class="space-y-3">
						<li>
							<a
								href={`${env.PUBLIC_CLIENT_APP_DOMAIN}/auth/sign-in`}
								class="text-gray-400 hover:text-white cursor-pointer">Business Member Portal</a
							>
						</li>
					</ul>
				</div>

				<!-- For Job Seekers -->
				<div>
					<h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
						For Professional Members
					</h3>
					<ul class="space-y-3">
						<!-- <li>
							<a href={null} class="text-gray-400 hover:text-white cursor-pointer">Browse Jobs</a>
						</li> -->
						<li>
							<a href={'/auth/sign-in'} class="text-gray-400 hover:text-white cursor-pointer"
								>Professional Member Portal</a
							>
						</li>
					</ul>
				</div>

				<!-- Quick Links -->
				<div>
					<h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
						Quick Links
					</h3>
					<ul class="space-y-3">
						<!-- <li>
							<a href={null} class="text-gray-400 hover:text-white cursor-pointer">About Us</a>
						</li> -->
						<li>
							<a href="/#contact-us" class="text-gray-400 hover:text-white cursor-pointer"
								>Contact Us</a
							>
						</li>
					</ul>
				</div>
			</div>

			<div class="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
				<p>&copy; {new Date().getFullYear()} DentalStaff.US. All rights reserved.</p>
				<div class="mt-2 flex justify-center space-x-6">
					<a href="/privacy-policy" class="text-gray-400 hover:text-white">Privacy Policy</a>
					<a href="/terms-and-conditions" class="text-gray-400 hover:text-white">Terms of Service</a
					>
				</div>
			</div>
		</div>
	</footer>
</div>
