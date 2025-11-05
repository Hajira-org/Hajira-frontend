## New Features
* add new hajira Logo for better consistency across the application. (21d17c42795fe0658f8de6a40ab0a7a0cc888343 by @Brianali-codes)
* implement chat functionality in SeekerDashboardPage; add chat fetching and display logic (ce3d165fe270893cb3f0734effb8a90ce97b8d83 by @Brianali-codes)
* update @types/node version and add GROQ_API_KEY to environment variables; improve button labels in PosterDashboardPage (f72bb6bad28ca19059a58d5bc4e1d29de8f2f162 by @Brianali-codes)
* add auto-changelog dependency and generate initial changelog file (32385312423aedab012da5f3f4e6d7d90dba16ba by @Brianali-codes)
* refactor SeekerDashboardPage to enable dynamic map initialization and cleanup (909eeccefe91544049f3a6c8afce1c17dcc33ed7 by @Brianali-codes)
* update ChatPopup to use backend URL from environment variable (0325bd68a3be4e18289c492e31f1794cd260964f by @Brianali-codes)
* update environment variables for backend URL and modify ChatPopup to use dynamic socket connection (28fd36ff91c52d0a9dd12c63d1bffb3fc3c8d3bb by @Brianali-codes)
* add optional dependencies for bufferutil and utf-8-validate; refactor ChatPopup to initialize socket on client-side (20b8f4794d7aa4bec3eb8dae2e40f7ec471a0073 by @Brianali-codes)
* implement user state management and enhance header with avatar and logout functionality (cfb154e86b32d19f56e594de659778952179d98a by @Brianali-codes)
* enhance ChatPopup with Framer Motion for animated message display (061fd371d46c0bc420cdf885558daf88ee55266b by @Brianali-codes)
* add chat functionality to Seeker and Poster dashboard pages with ChatPopup integration (53035ce81cd2385d99acfa10bf7be240594b2d1b by @Brianali-codes)
* implement geolocation functionality in PosterDashboardPage and handle location fallback (f44c03435bee54f165e174712bc03cda858be767 by @Brianali-codes)
* add avatar upload functionality to Seeker and Poster dashboard pages (d3fdc79767e804188b0d73aa226e5a74bfc4f2e6 by @Brianali-codes)
* add avatar upload functionality and enhance profile setup with avatar handling (559f0473275fef4c15c8fdfe958bce6934056229 by @Brianali-codes)
* implement job editing functionality in PosterDashboardPage and adjust Preloader styles (23aa2d8defeee95b0398d1c707e23f2ed3ba0089 by @Brianali-codes)
* integrate Leaflet for map functionality in dashboard pages and add styling adjustments (a649fde67703ed6917d37836cdcc03c386184b43 by @Brianali-codes)
* enhance PosterDashboardPage with applicant visibility and styling improvements (844b749200b94cc827a3f49126dd19b3525242c2 by @Brianali-codes)
* enhance profile setup with user fetching and update functionality (c59ca534f12ddb54625cb40f7c15e3031110f583 by @Brianali-codes)
* add change password functionality in settings and update success message (a5df897622fef770a91228ffafd2c31e887b08f9 by @Brianali-codes)

## Bug Fixes
* remove sensitive GROQ_API_KEY from .env file (a1e3194de0ba3a4061b9257a4646bf27e04cb30f by @Brianali-codes)
* add .env to .gitignore to prevent local environment files from being tracked (8688ec5ee592d301a38ca3ff85733ffd90f29abf by @Brianali-codes)
* correct casing of 'Dashboard' link in Header constants (828b96552211c2df9b8cd1196969284bc74e017d by @Brianali-codes)
* update API URL in .env file for deployment and local development (1b04a0b37c2f8822a0519841d52f522fb31cf3b7 by @Brianali-codes)
* update logo dimensions in Header component (3b957e27e04ce5002bf1c4f1a3d6c2e72106ca91 by @Brianali-codes)
* adjust animation duration and delay in Preloader component (c710ce06496f33ae750bf30d9069595f537311c7 by @Brianali-codes)
* correct HTML entity for double quotes in add skill button (c3d2786ea7a3a3ee3521123caf10e0d1458eef75 by @Brianali-codes)
* update fetch URL to use localhost for API authentication in signin page (c2837f0bd67d01b82bbc024abad3d119e843d082 by @Brianali-codes)

## Documentation
* update changelog (7b12ff026d28eb67432198a74bd357053d8a7e91 & 11a9b84526b5fab7f4af18e75c53a4bca11511f5 & 5ea0b2452b8ba6dcbba6f13069788feea13c899f & eac2ee1b6a832e1be924c3651bfe0d8c2c958f73 & 24eedc87009344470087d9fa484aef61373483e6 & 513c2fd6fd486bf1ca18f0a3de557d83abad0cfb & 9ee9fe748c2df93ff570dc8288c8232b84392a0b & 5e16eff79b99cdb739f26b3ad642b32eb93fc3a5 & 54080298ccb31c88a00e439db8c508d638dc2e6f & ed53bdbdf55ba5b356c05a0a500130fa90c84c8d & f5cf5259b194cc28f33b19d72cb70e419b2079af & 59813fbde39b1b71c382245723fddd06ba31c3a7 & 6daa811b97a0ad574c89ebacd6cf82b7b57454bd & b484b750bb67f365507be8426b46adf8c61f9fea & c849079c91cf91512095c7096b1695e96d3c6ba0 by @github-actions[bot])

## Refactors
* update profile form with styled components and improve UI (2002a0e2b969832e86bb3467755061837f92b6d3 by @Brianali-codes)
* enhance job poster handling and improve job application UI (b83e010974a4646411faed2271effe24b5bbc5af by @Brianali-codes)
* remove React strict mode and styled-components configuration from next.config.js (a5e68c7df3991ab3dc055eac23e8bf03b5fd9337 by @Brianali-codes)
* enable React strict mode and configure styled-components in next.config.js (acb0836678ed63820b94565e37cfc3adc7016a68 by @Brianali-codes)
* add API_URL dependency to useEffect and update job creation message for consistency (0f6417ec72c1bb6cc308639068160d21e056cce9 by @Brianali-codes)
* update wording in applied jobs message for clarity (d190f919f45ffe26483e09738ff75926069223c4 by @Brianali-codes)
* improve mobile responsiveness and layout in styled components (3e70f5634332854ff65c79fd6c30aaa06f075457 by @Brianali-codes)
* enhance responsive design in styled components for better mobile experience (e1785289ededce5b62d5e46bc2c3bb049af5841d by @Brianali-codes)
* update copyright name in Footer and adjust positioning in Header styles (9372cd43311673a385c2386afa458e93a3235655 by @Brianali-codes)
* replace PNG images with WebP format for improved performance in JoinSection component (24fb18e3499ecd2664a9d8bf64bb5fda98af7775 by @Brianali-codes)
* update image formats to WebP for better performance in multiple components (782a89935ed072b5abb0cac325f2af2daf252cd9 by @Brianali-codes)
* replace hardcoded API URL with environment variable in dashboard and signin pages (b42704faa93ab92abfe675341a1f7a4af5adf977 by @Brianali-codes)
* replace hardcoded API URL with environment variable in multiple components (db96582814f44ed29f28a2523ceb99f6a54c693d by @Brianali-codes)

## Code Style
* update background colors and border styles across components (7ff2ceb22e11148a7323984194dfeefaf5d36e74 by @Brianali-codes)

