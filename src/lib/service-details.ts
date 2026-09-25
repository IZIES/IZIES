import { capabilityContent, type CapabilityId } from "@/lib/capabilities";

type SectionItem = { title: string; description: string };
type ServiceDetail = {
  metaTitle: string;
  metaDescription: string;
  introduction: string[];
  approach: string;
  useCases: SectionItem[];
  process: SectionItem[];
  planning: string[];
  faqs: { question: string; answer: string }[];
  related: CapabilityId[];
};

// Service-specific scope guidance, based on the existing capability catalog.
// Keep this long-form content out of homepage client components.
export const serviceDetails: Record<CapabilityId, ServiceDetail> = {
  ai: {
    metaTitle: "AI Development & Integration Services",
    metaDescription: "Build AI assistants, document search, chatbots and workflow integrations with IZIES. Explore data access, evaluation and deployment for your use case.",
    introduction: [
      "An AI feature is useful when it fits a real workflow: finding an answer in internal documents, helping a support team handle requests or extracting information from incoming files. IZIES develops AI applications and integrations around those tasks, rather than treating a model connection as a complete product.",
      "The scope includes the people using the feature, the information it can access and the decisions that still need human review. For an existing application, the integration also needs to respect account permissions, data boundaries and the way your team already works.",
    ],
    approach: "The starting point is a defined task and a set of representative examples. Retrieval-augmented generation can connect an assistant to relevant documents; structured workflows can connect it to business tools. Model choice, evaluation, usage monitoring and fallback behavior are considered together. AI output is tested against the intended task, with review or escalation paths for cases the system should not handle on its own.",
    useCases: [
      { title: "Search across business knowledge", description: "Help employees locate information in approved documents, with source references and access that follows the underlying permissions." },
      { title: "Assist customer support", description: "Draft answers, classify incoming requests and direct difficult cases to a person using the product's existing support workflow." },
      { title: "Process incoming documents", description: "Extract and organize fields from files for a review queue, with validation before information enters a downstream business system." },
    ],
    process: [
      { title: "Define the task and data boundaries", description: "Identify users, source material, permitted actions and examples of acceptable output. Decide which situations require human approval." },
      { title: "Build and evaluate the workflow", description: "Connect retrieval, model calls and application logic. Evaluate representative inputs, missing information and incorrect or unsupported responses." },
      { title: "Integrate and monitor", description: "Add the feature to the product, document its limits and configure monitoring for usage, failures and feedback." },
    ],
    planning: ["The task you want the AI feature to perform", "Sample documents or data formats, without sensitive production records", "Required integrations, access restrictions and approval rules"],
    faqs: [
      { question: "Can you add AI to an existing website or internal tool?", answer: "Yes. The integration scope depends on the existing application, available APIs and how users sign in. A feature may be added through the backend, a search interface or a defined workflow without replacing the entire product." },
      { question: "Do we need to train a model from scratch?", answer: "Not necessarily. An existing model combined with retrieval or an application workflow may fit the problem. The choice depends on the task, available data, evaluation results and operational requirements." },
      { question: "Can an AI agent make every decision automatically?", answer: "Automation should have clear boundaries. Actions affecting business records or users may need validation, permissions and human approval. The design defines what the agent can do and how exceptions are handled." },
    ],
    related: ["automation", "data-analytics", "backend-api"],
  },
  "web-saas": {
    metaTitle: "Website, Web App & SaaS Development",
    metaDescription: "IZIES develops business websites, web applications and SaaS platforms. Explore responsive design, subscriptions, customer portals and API integrations.",
    introduction: [
      "A business website needs to explain your offer and help visitors take the next step. A web application or SaaS product must also support the workflows behind that experience: accounts, permissions, payments, data and everyday operations. IZIES works across both, from public websites to custom business platforms.",
      "We separate the needs of visitors, customers and administrators before choosing the architecture. That helps define which pages should be discoverable in search, which workflows belong behind a login and how the product will be managed after launch.",
    ],
    approach: "Public pages benefit from semantic content, responsive layouts, optimized images and appropriate server rendering. Application areas need well-defined data models, API contracts and permission checks. For SaaS, tenant separation, subscription events and administrative controls are part of the scope. Existing frameworks and integrations are considered before proposing a replacement, and performance targets are agreed around actual user journeys.",
    useCases: [
      { title: "A website for business enquiries", description: "Present services, explain the work you offer and give visitors a clear route to a contact form or another agreed conversion action." },
      { title: "A customer or partner portal", description: "Give signed-in users access to their records, requests or shared workflows while providing administrators with operational controls." },
      { title: "A subscription software product", description: "Connect onboarding, plans, billing and product features into a SaaS experience with appropriate account and tenant boundaries." },
    ],
    process: [
      { title: "Map the pages and workflows", description: "Define the audience, public content, user roles and key journeys. Separate launch essentials from later enhancements." },
      { title: "Design and build the product", description: "Develop responsive interfaces, backend services and integrations in reviewable milestones, using feedback to refine the workflow." },
      { title: "Validate and prepare the release", description: "Check core journeys, forms, permissions and device layouts. Review technical SEO for public pages and document operational handover." },
    ],
    planning: ["Your audience, business goals and existing website if any", "Required pages, user roles and product workflows", "Payment, CRM, content or other systems the product must connect to"],
    faqs: [
      { question: "Do I need a website or a custom web application?", answer: "A website is usually centered on content and enquiries. A web application supports interactive workflows such as accounts, approvals or data management. Many projects combine a public website with a private application; the requirements determine the boundary." },
      { question: "Can you improve an existing website instead of rebuilding it?", answer: "Yes. Work can focus on responsive design, performance, accessibility, technical SEO or integrations. Reviewing the current code and platform helps establish whether targeted changes or a broader rebuild are appropriate." },
      { question: "Does a SaaS project include billing and subscriptions?", answer: "These can be included in the agreed scope. Subscription rules, payment provider events, upgrades, cancellations and access changes need to be defined and tested alongside the product itself." },
    ],
    related: ["backend-api", "testing-qa", "support-maintenance"],
  },
  mobile: {
    metaTitle: "Mobile App Development for Android & iOS",
    metaDescription: "Plan and build Android, iOS and cross-platform apps with IZIES, including backend integration, offline workflows, notifications and release support.",
    introduction: [
      "Mobile products need to work around small screens, changing connectivity and the device features people rely on. IZIES develops Android, iOS and cross-platform applications for customers, employees and field teams, with backend integration and release support included where required.",
      "The choice between native and cross-platform development follows the product's requirements. Camera access, background work, offline behavior, payments and the expected device range can affect that decision just as much as the interface design.",
    ],
    approach: "We map key mobile journeys and decide which data must be available when the network is unreliable. API contracts, authentication and synchronization rules are planned alongside the screens. Notifications, device permissions and store requirements need explicit handling. Testing covers normal use as well as interrupted requests, permission denial and state changes when an app moves between foreground and background.",
    useCases: [
      { title: "Customer-facing applications", description: "Connect accounts, product features, payments and notifications in an interface designed for repeated use on a phone." },
      { title: "Field and operations tools", description: "Support work away from a desk with forms, device integrations and planned offline access or synchronization." },
      { title: "A mobile companion for a platform", description: "Extend an existing web product to mobile while sharing backend data, account access and business rules." },
    ],
    process: [
      { title: "Scope platforms and device needs", description: "Identify Android/iOS requirements, user journeys, device features and connectivity constraints before choosing the development approach." },
      { title: "Build screens and integrations", description: "Implement navigation, application state, APIs and device capabilities. Review behavior on representative devices during development." },
      { title: "Test and support submission", description: "Validate release builds, permissions and recovery paths, then prepare store assets and submission requirements within the agreed scope." },
    ],
    planning: ["Target platforms and the devices your users have", "Required device features and offline workflows", "Existing backend APIs, accounts and store ownership"],
    faqs: [
      { question: "Should we use native or cross-platform development?", answer: "That depends on platform-specific features, performance needs and maintenance plans. Cross-platform tools can share application code; native development can be appropriate for deeper platform integration. The choice should follow the product requirements." },
      { question: "Can the app work without an internet connection?", answer: "Selected workflows can be designed for offline use. We need to define which data is stored on the device, how changes synchronize and what happens when two users change the same record." },
      { question: "Can you help publish the app?", answer: "Store submission and release support are existing capabilities. You will need the relevant developer accounts and accurate product information. Approval remains subject to the platform's review; no approval date is guaranteed." },
    ],
    related: ["backend-api", "testing-qa", "support-maintenance"],
  },
  automation: {
    metaTitle: "Business Automation & Integration Services",
    metaDescription: "Connect CRM, billing, messaging and internal workflows with IZIES. Plan business automation with validation, approval steps, retries and activity logs.",
    introduction: [
      "Repeated copying between tools, manual follow-ups and disconnected records make it difficult to see whether a process has completed. IZIES builds automation around defined business workflows, connecting existing systems through APIs, webhooks and scheduled jobs.",
      "A useful workflow handles more than the successful path. Missing information, duplicate events, delayed responses and steps that require approval all need a place in the design. The aim is a process your team can understand, supervise and recover when something goes wrong.",
    ],
    approach: "We map the trigger, source of truth, actions and completion conditions before building the integration. Validation and duplicate handling protect downstream records; retries and logs help operators investigate failures. Some tasks fit an automation platform, while others need a custom service or queue. Credentials, permissions and provider limits are treated as part of the workflow rather than as afterthoughts.",
    useCases: [
      { title: "Lead and CRM synchronization", description: "Move an enquiry into the appropriate system, validate required fields and notify the person responsible for the next step." },
      { title: "Billing and operational events", description: "Connect payment or invoice events to defined account updates and notifications, with checks for retries and duplicate deliveries." },
      { title: "Approvals and onboarding", description: "Coordinate forms, review steps, account tasks and status updates while keeping decisions requiring human approval visible." },
    ],
    process: [
      { title: "Document the current process", description: "Identify each system, manual handoff, decision and failure condition. Agree on what the workflow should and should not automate." },
      { title: "Connect and validate", description: "Implement API connections, field mapping and authorization. Test duplicate events, invalid data and unavailable services." },
      { title: "Hand over operational controls", description: "Provide activity visibility, recovery instructions and configuration guidance so the team can supervise the automated process." },
    ],
    planning: ["The current manual steps and who performs them", "Tools involved and their available APIs or export formats", "Approval rules, failure handling and expected event volume"],
    faqs: [
      { question: "Can you automate workflows across tools we already use?", answer: "Yes, where those tools provide suitable APIs, webhooks or supported import/export mechanisms. Access restrictions and provider limitations affect the design and should be reviewed before committing to an integration." },
      { question: "Will automation remove all manual review?", answer: "Not necessarily. Approvals and exception handling may be essential to the business process. Automation can collect the information and route the task while leaving the final decision with an authorized person." },
      { question: "What happens when an external service is unavailable?", answer: "The design can include retries, queued work, alerts and a way to inspect failed steps. Recovery behavior depends on whether the action can be safely repeated and how the connected systems report its status." },
    ],
    related: ["backend-api", "ai", "data-analytics"],
  },
  "backend-api": {
    metaTitle: "Backend & API Development Services",
    metaDescription: "IZIES builds backend services, REST and GraphQL APIs, databases and real-time integrations for web and mobile products. Explore scope and delivery.",
    introduction: [
      "A product's backend defines how information is stored, who can access it and what happens when users take an action. IZIES develops APIs and backend services for web applications, mobile products and business integrations, including work on existing systems.",
      "The architecture needs to fit the application rather than a fashionable pattern. A clear API contract, consistent permissions and a maintainable database can matter more than splitting a small product into many services. Expected traffic and operational requirements guide those choices.",
    ],
    approach: "We start with domain data, user roles and the requests the product must support. Database design, validation and authorization are developed together. Background jobs, caching or real-time events are introduced where the workflow needs them. Documentation and automated checks make integrations easier to maintain, while profiling helps identify actual bottlenecks before selecting performance changes.",
    useCases: [
      { title: "A shared backend for web and mobile", description: "Serve consistent product data and business rules to multiple interfaces while applying account and role permissions centrally." },
      { title: "Partner and third-party integrations", description: "Expose or consume documented APIs with defined request formats, authentication and error behavior." },
      { title: "Real-time product workflows", description: "Connect notifications, collaborative updates or event processing to the application without relying on repeated manual refreshes." },
    ],
    process: [
      { title: "Model data and access", description: "Define entities, relationships, roles and business rules. Document the API operations required by each interface or integration." },
      { title: "Implement the service contracts", description: "Build request handling, database operations and asynchronous work, with validation and tests for important success and failure paths." },
      { title: "Review performance and handover", description: "Profile representative requests, prepare migration and deployment steps, and document the APIs and operational requirements." },
    ],
    planning: ["The products or integrations that will consume the API", "Data models, access rules and existing databases", "Expected traffic, asynchronous tasks and migration constraints"],
    faqs: [
      { question: "Can you work with an existing backend?", answer: "Yes. API additions, query optimization, integrations and migrations are part of the existing capability scope. The first step is understanding the current contracts and consumers so changes do not unexpectedly break them." },
      { question: "Should we choose REST or GraphQL?", answer: "The choice depends on how clients access data, the team's maintenance requirements and existing integrations. Either can support a well-designed product; the important work includes consistent contracts, authorization and error handling." },
      { question: "Do we need microservices from the start?", answer: "Not every product does. Service boundaries should follow the workload, ownership and operational needs. A modular application may be easier to operate initially, with selected components separated when there is a concrete reason." },
    ],
    related: ["web-saas", "mobile", "cloud-devops"],
  },
  "cloud-devops": {
    metaTitle: "Cloud Infrastructure & DevOps Services",
    metaDescription: "Plan cloud infrastructure, migrations, CI/CD, monitoring and recovery with IZIES. Build a delivery workflow around your application's requirements.",
    introduction: [
      "A release process should be repeatable, and a production issue should leave enough information to investigate. IZIES helps teams set up cloud infrastructure and DevOps workflows around those needs, from a first deployment to an existing application's migration or operational improvements.",
      "Infrastructure choices depend on traffic, data, availability expectations and the team's ability to operate the system. Managed services, containers and orchestration each bring different responsibilities. The project scope should make those responsibilities and costs visible.",
    ],
    approach: "We review application dependencies, environments and deployment requirements before planning infrastructure. CI/CD can automate agreed build and validation steps; infrastructure as code can make environments reproducible. Monitoring, backup and restore procedures need testing as well as configuration. Scaling and cost decisions are based on the workload, while migration plans include rollback and an explicit approach to data changes.",
    useCases: [
      { title: "Prepare a product for launch", description: "Create the environments, deployment pipeline and monitoring needed to operate a new web or mobile backend." },
      { title: "Move an existing application", description: "Plan a cloud migration around dependencies, data transfer and a defined cutover process rather than treating hosting as a file copy." },
      { title: "Improve release operations", description: "Replace inconsistent manual deployment steps with a documented workflow, validation checks and a recovery plan." },
    ],
    process: [
      { title: "Assess the workload", description: "Review architecture, traffic, dependencies, access requirements and the existing operational process." },
      { title: "Configure environments and delivery", description: "Set up the agreed infrastructure and build/deployment workflow, with appropriate configuration and access separation." },
      { title: "Validate operation and recovery", description: "Exercise monitoring, deployment rollback and restore procedures. Document responsibilities and ongoing maintenance needs." },
    ],
    planning: ["Current hosting and application architecture", "Release frequency, uptime expectations and recovery needs", "Cloud account ownership, access and cost constraints"],
    faqs: [
      { question: "Do you work with our existing cloud provider?", answer: "Cloud setup and migration are part of the service scope. Provider services, application requirements and access need to be reviewed before defining the work. There is no need to change providers without a practical reason." },
      { question: "Is Kubernetes required?", answer: "No. A managed application platform or simpler container deployment may suit the workload. Orchestration should be chosen when its operational benefits justify the additional complexity." },
      { question: "Can you guarantee a migration without downtime?", answer: "That cannot be promised without assessing the system. Database changes, stateful services and traffic cutover can affect availability. A migration plan should define the maintenance window, rollback conditions and validation steps." },
    ],
    related: ["backend-api", "testing-qa", "support-maintenance"],
  },
  "data-analytics": {
    metaTitle: "Data Engineering & Analytics Services",
    metaDescription: "IZIES builds data pipelines, reporting models and business dashboards. Connect business systems with data quality checks and clear metric definitions.",
    introduction: [
      "Useful reporting starts before a chart is drawn. Records from different tools need consistent identifiers, definitions and update rules. IZIES develops data pipelines and analytics workflows that turn those inputs into reporting your team can understand and use.",
      "The project can focus on a single operational dashboard or a broader reporting model. In either case, it helps to define who uses each metric, what decision it supports and how current the underlying information must be.",
    ],
    approach: "We review source systems and agree on metric definitions before designing ingestion and transformation. Data quality checks can identify missing fields, duplicates and unexpected values. Refresh schedules follow the business need rather than assuming every report requires real-time streaming. Access controls, pipeline monitoring and documentation help the reporting workflow remain understandable as sources and requirements change.",
    useCases: [
      { title: "Bring operational data together", description: "Combine information from approved business tools into a reporting model with consistent definitions and traceable sources." },
      { title: "Replace repetitive reporting work", description: "Prepare scheduled dashboards or summaries instead of rebuilding the same spreadsheet and calculations each reporting cycle." },
      { title: "Understand product activity", description: "Organize application events into agreed metrics and conversion journeys, with validation of what each event represents." },
    ],
    process: [
      { title: "Define questions and sources", description: "Identify the decisions the reports should support, available source data and the definitions of important metrics." },
      { title: "Build the reporting pipeline", description: "Implement ingestion, transformation and data quality checks, then create the agreed reporting models and dashboards." },
      { title: "Validate and document", description: "Compare results with source records, review access and refresh behavior, and document metric definitions and pipeline operation." },
    ],
    planning: ["The business questions and metrics that matter", "Source systems, sample formats and access limitations", "Refresh frequency, dashboard users and reporting tools"],
    faqs: [
      { question: "Can reports combine data from several tools?", answer: "Yes, where data can be accessed through supported APIs, databases or exports. The important work is matching records and agreeing on definitions so figures from different systems are not combined incorrectly." },
      { question: "Do all dashboards need real-time data?", answer: "No. Some decisions need immediate updates; others work well with hourly or daily refreshes. The refresh schedule should balance business value, source-system limits and operating cost." },
      { question: "Can you work with our existing reporting setup?", answer: "Yes. The scope can include improving source connections, transformation logic, data quality or dashboards. Existing tools and team skills are considered before recommending a different platform." },
    ],
    related: ["automation", "ai", "backend-api"],
  },
  web3: {
    metaTitle: "Blockchain & Web3 Development Services",
    metaDescription: "Develop smart contracts, wallet integrations and decentralized application interfaces with IZIES. Explore contract testing, network choices and review scope.",
    introduction: [
      "A blockchain component should have a clear role in the product, such as shared on-chain state or a wallet-based interaction. IZIES develops smart contracts, decentralized application interfaces and related integrations where those features fit the requirements.",
      "The user experience includes more than a contract call. Network selection, account state, transaction confirmation, failed requests and changes to contract behavior all affect how the application works. Those details belong in the scope from the beginning.",
    ],
    approach: "We define which information belongs on-chain and which should remain in conventional application storage. Contract behavior, permissions and upgrade requirements are documented before deployment. Automated tests and test-network validation cover expected transactions and failure paths. Security review preparation and remediation can be included, while any independent audit must be separately scoped and must not be assumed from development alone.",
    useCases: [
      { title: "Wallet-enabled interfaces", description: "Connect a wallet to an application and guide the user through network selection, requested actions and transaction status." },
      { title: "Smart contract workflows", description: "Implement defined on-chain rules with tests for permissions, state transitions and invalid transactions." },
      { title: "On-chain data integrations", description: "Read relevant blockchain events into an application interface or reporting workflow with clear handling of network state." },
    ],
    process: [
      { title: "Assess the on-chain requirement", description: "Define the purpose, network constraints, actors and data boundaries. Confirm why the feature needs blockchain integration." },
      { title: "Build and test the interaction", description: "Develop contract logic and interface behavior, including rejected signatures, failed transactions and network changes." },
      { title: "Prepare review and deployment", description: "Document deployment steps, permissions and operational responsibilities. Address findings from the agreed review process before release." },
    ],
    planning: ["Why the product needs an on-chain component", "Target network, wallet behavior and contract rules", "Review requirements and ownership of deployment accounts"],
    faqs: [
      { question: "Does every application benefit from blockchain?", answer: "No. A conventional database may be more appropriate when the product does not need shared on-chain state or wallet-based interactions. The business requirement should justify the additional complexity." },
      { question: "Is an independent security audit included automatically?", answer: "No. Development tests and review preparation are different from an independent audit. If your release requires one, the scope, reviewer and remediation process must be agreed explicitly." },
      { question: "Can you connect a frontend to an existing contract?", answer: "Yes. The integration needs the network details, contract interface and expected behavior. The frontend must also handle signing, confirmation and errors so users can understand the status of an action." },
    ],
    related: ["web-saas", "backend-api", "testing-qa"],
  },
  "media-streaming": {
    metaTitle: "Video & Media Platform Development",
    metaDescription: "Build video libraries, streaming workflows and media applications with IZIES. Explore uploads, transcoding, HLS playback, storage and content access.",
    introduction: [
      "A media platform connects several different workflows: accepting files, preparing playable versions, organizing content and delivering it to the right audience. IZIES develops those application and processing layers for video libraries, creator platforms and real-time communication features.",
      "Video on demand, live broadcasts and interactive calls have different requirements. Identifying which experience the product needs helps define encoding, storage, delivery and playback choices without assuming one pipeline fits all three.",
    ],
    approach: "We map the media lifecycle from upload to playback. Processing jobs can create the required renditions, thumbnails and subtitles, while application state tracks progress and failures. Storage and CDN integration need to match access rules and delivery requirements. Playback validation covers device support, source formats and changing connectivity, with operational visibility for failed uploads or processing tasks.",
    useCases: [
      { title: "A video-on-demand library", description: "Organize uploaded videos into a catalog with adaptive playback, metadata and the required content access controls." },
      { title: "Creator and publishing workflows", description: "Give content teams a way to upload, monitor processing, edit information and publish media through a managed interface." },
      { title: "Live and interactive features", description: "Connect a live streaming or WebRTC calling workflow to the product, based on the type of audience interaction required." },
    ],
    process: [
      { title: "Define the media experience", description: "Identify source formats, expected viewers, device targets and whether the product needs on-demand, live or interactive delivery." },
      { title: "Build processing and playback", description: "Connect uploads, jobs, storage and the player. Implement content status and error handling across the media lifecycle." },
      { title: "Validate delivery and operation", description: "Test representative media on target devices, review access behavior and document monitoring and recovery for processing failures." },
    ],
    planning: ["Media types, typical source files and expected usage", "Playback devices and live versus on-demand requirements", "Publishing permissions, storage and delivery constraints"],
    faqs: [
      { question: "What is the difference between live streaming and video on demand?", answer: "Video on demand prepares recorded media for later playback. Live streaming delivers an ongoing broadcast. Interactive calls add two-way participation and different latency needs, so each requires an appropriate delivery design." },
      { question: "Can users upload their own videos?", answer: "Upload and creator-management workflows are part of the capability scope. The design needs validation, processing status, storage rules and controls over who can publish or view the resulting content." },
      { question: "Can you add streaming to an existing application?", answer: "Yes. The integration can connect media processing and playback to existing accounts and content records. Reviewing storage, delivery and access requirements helps determine the right boundary between application code and media services." },
    ],
    related: ["backend-api", "cloud-devops", "web-saas"],
  },
  immersive: {
    metaTitle: "Gaming, 3D & Interactive Development",
    metaDescription: "IZIES creates browser games, 3D product viewers and interactive experiences. Explore WebGL, product configurators and device-aware development.",
    introduction: [
      "Interactive 3D can help a user inspect a product, explore a space or take part in a browser-based experience. IZIES develops these features with attention to navigation, loading behavior and the devices people actually use.",
      "The work starts with the interaction, not only the visual effect. A product viewer, a configurator and a game have different controls, data needs and performance constraints. Existing assets and the expected level of visual detail also affect the scope.",
    ],
    approach: "We define the scene, user actions and target device range before building the experience. Rendering choices, asset complexity and animation are balanced against loading time and responsiveness. Interfaces need usable controls beyond the 3D scene itself. AR/VR and WebXR work is scoped around supported devices and browser capabilities, with representative testing rather than an assumption of universal compatibility.",
    useCases: [
      { title: "Interactive product previews", description: "Let a visitor inspect a product or explore configured options through a 3D viewer connected to the surrounding product interface." },
      { title: "Virtual demonstrations", description: "Present a space or concept through an interactive scene with defined navigation and clear points of interest." },
      { title: "Browser games and engagement", description: "Build a game or guided interactive activity with scoped mechanics, input controls and device performance expectations." },
    ],
    process: [
      { title: "Plan interaction and assets", description: "Define the purpose, controls, scenes and available models or artwork. Establish device and loading requirements." },
      { title: "Prototype and integrate", description: "Build the core interaction first, then connect visual assets, application data and supporting interface elements." },
      { title: "Tune and test", description: "Review rendering, loading and input behavior on representative devices, and refine the experience against the agreed requirements." },
    ],
    planning: ["The interaction or experience you want users to have", "Existing 3D assets, artwork and product data", "Target browsers, devices and accessibility requirements"],
    faqs: [
      { question: "Can a 3D experience run inside a normal website?", answer: "Browser-based 3D is an existing capability. The experience needs to be designed for the target browser and device range, and integrated with the page's navigation, content and loading behavior." },
      { question: "Will the same experience work on every phone?", answer: "Device graphics capabilities and browser support vary. Scope should identify the supported range and a suitable fallback where needed. Testing on representative devices is necessary before making compatibility claims." },
      { question: "Do we need to supply 3D models?", answer: "Available assets and any work needed to prepare them should be discussed during scoping. A viewer or configurator depends on usable models, textures and product information, so those requirements need to be agreed before development." },
    ],
    related: ["web-saas", "mobile", "testing-qa"],
  },
  "testing-qa": {
    metaTitle: "Software Testing & QA Services",
    metaDescription: "IZIES provides functional testing, test automation, regression checks and performance profiling. Plan QA around your product's important user journeys.",
    introduction: [
      "A useful test strategy focuses on the behavior that matters to users and the failures that would be costly to miss. IZIES combines automated checks and manual validation around those risks, for both new products and existing applications.",
      "Testing can support a release, improve a recurring regression process or investigate a specific reliability problem. The scope should identify the environments, devices and workflows covered, as well as how findings are reported and rechecked.",
    ],
    approach: "We map critical journeys to appropriate checks: unit tests for isolated logic, integration tests for connected components and end-to-end tests for complete flows. Manual review remains useful for behavior that automation does not adequately assess. Performance and accessibility checks need defined scenarios. Findings include reproduction steps and impact so the development team can prioritize fixes; no test suite proves a product is defect-free.",
    useCases: [
      { title: "Prepare a release for validation", description: "Check the agreed product journeys, permissions and device layouts before a release decision is made." },
      { title: "Reduce repetitive regression work", description: "Automate stable, important flows so recurring changes can be checked consistently as part of the development workflow." },
      { title: "Investigate performance problems", description: "Profile representative application behavior and run agreed load scenarios to identify bottlenecks and validate proposed improvements." },
    ],
    process: [
      { title: "Define coverage and risk", description: "Review the product, critical workflows and previous issues. Agree on environments, test data and expected behavior." },
      { title: "Execute and document findings", description: "Run the agreed checks and record reproducible defects, evidence and their effect on the user journey." },
      { title: "Recheck and hand over", description: "Verify relevant fixes, document remaining findings and integrate maintainable automated checks into the release workflow." },
    ],
    planning: ["Critical workflows and known defects or release concerns", "Test environments, representative data and device coverage", "Release criteria and access to the development workflow"],
    faqs: [
      { question: "Can testing guarantee that software has no bugs?", answer: "No. Testing provides evidence about the scenarios covered and helps identify risks. Coverage, environments and limitations should be documented so release decisions are based on what was actually verified." },
      { question: "Should every test be automated?", answer: "No. Repeatable checks on stable workflows often benefit from automation. Exploratory, usability and some device-specific checks still need human judgment. A useful plan balances the two rather than maximizing test counts." },
      { question: "Can you add tests to an existing project?", answer: "Yes. The work can start with high-risk journeys and recurring defects. Existing architecture, testability and environment setup affect how much preparation is needed before reliable automated checks can be introduced." },
    ],
    related: ["web-saas", "mobile", "cloud-devops"],
  },
  "dedicated-team": {
    metaTitle: "Dedicated Development Team Services",
    metaDescription: "Extend your product team with IZIES engineering, QA and design support. Explore onboarding, milestones, collaboration and project handover.",
    introduction: [
      "Some products need ongoing development capacity rather than a single isolated delivery. IZIES offers dedicated development support matched to the work, with engineering, QA and design responsibilities defined around the project.",
      "The engagement should clarify who owns product decisions, how priorities are set and how completed work is reviewed. That makes it easier for an external team to collaborate with existing staff without creating a separate, opaque delivery process.",
    ],
    approach: "We begin with the product roadmap, current codebase and the roles needed to deliver the next milestones. Onboarding covers access, development setup and team conventions. Shared planning, code review and regular demonstrations make progress visible. Documentation and handover are part of continuity planning, while team composition and availability are agreed for the engagement.",
    useCases: [
      { title: "Extend an existing product team", description: "Add development or QA capacity around a defined roadmap while retaining the product owner's priorities and review process." },
      { title: "Support an ongoing application", description: "Coordinate maintenance and feature work in one delivery workflow, with a visible backlog and agreed responsibilities." },
      { title: "Bring a product through milestones", description: "Organize development, testing and review around successive product releases rather than treating each task as a separate engagement." },
    ],
    process: [
      { title: "Agree on responsibilities", description: "Review the roadmap, required skills and existing team. Define ownership, communication and how work will be accepted." },
      { title: "Onboard and deliver", description: "Establish access and development practices, then work through planned tasks with reviewable code and regular demonstrations." },
      { title: "Review capacity and continuity", description: "Assess upcoming priorities, document decisions and plan handover or team adjustments as the engagement evolves." },
    ],
    planning: ["Your roadmap and the responsibilities you need covered", "Existing team structure, codebase and tools", "Collaboration hours, review process and expected engagement scope"],
    faqs: [
      { question: "Can the team work with our existing developers?", answer: "Yes. The engagement can align with your repositories, review process and planning tools. Access, ownership and communication expectations need to be agreed during onboarding." },
      { question: "Can we change the team size or skill mix?", answer: "Changes can be discussed as the roadmap evolves. Timing, role availability and onboarding need to be agreed so a change in capacity fits the delivery plan and the team's existing responsibilities." },
      { question: "How will we know what has been delivered?", answer: "The working arrangement can include milestones, code review, demonstrations and progress reporting. Acceptance criteria should be defined for each piece of work so completion is clear to both teams." },
    ],
    related: ["web-saas", "testing-qa", "support-maintenance"],
  },
  "support-maintenance": {
    metaTitle: "Software Support & Maintenance Services",
    metaDescription: "IZIES offers 24×7 service availability for software support and maintenance, including bug fixes, updates, monitoring and ongoing product improvements.",
    introduction: [
      "Applications need attention after launch: dependencies change, defects emerge and business requirements evolve. IZIES provides software support and maintenance with 24×7 service availability, helping teams investigate issues and plan ongoing improvements.",
      "Availability is separate from a guaranteed response or resolution time. The engagement defines support channels, priorities, responsibilities and response targets around the application and the level of coverage required.",
    ],
    approach: "Maintenance starts with understanding the application, deployment process and available monitoring. Work is classified so urgent incidents do not obscure planned fixes and upgrades. Changes need validation and a release or rollback path. Documentation, dependency review and operational visibility help the team maintain the product over time, while larger feature requests are scoped rather than silently included in routine support.",
    useCases: [
      { title: "Maintain a live application", description: "Investigate reported issues, apply agreed fixes and manage updates through the existing release process." },
      { title: "Improve operational visibility", description: "Set up or refine monitoring and incident diagnostics so the team has useful information when behavior changes." },
      { title: "Plan ongoing product improvements", description: "Organize performance work, dependency upgrades and feature enhancements into a backlog with clear priorities." },
    ],
    process: [
      { title: "Review the application and coverage", description: "Understand the architecture, access, deployment and known issues. Agree on channels, priorities and support responsibilities." },
      { title: "Investigate and implement", description: "Reproduce issues, assess changes and validate fixes or upgrades in an appropriate environment before release." },
      { title: "Release and review", description: "Deploy through the agreed process, check the outcome and document follow-up work or changes to operational guidance." },
    ],
    planning: ["Your application, hosting and current maintenance arrangements", "Known issues, monitoring access and deployment process", "Required coverage, issue priorities and response expectations"],
    faqs: [
      { question: "Is 24×7 support available?", answer: "IZIES has confirmed 24×7 service availability. The actual support arrangement, channels and response targets are agreed for the engagement; availability is not an automatic promise of immediate resolution." },
      { question: "Can you maintain software built by another team?", answer: "An existing application can be assessed for maintenance. Code access, documentation, deployment setup and dependency condition affect onboarding and the scope of work that can be taken on." },
      { question: "Are new features included in maintenance?", answer: "That depends on the agreement. Bug fixes, updates and operational support can be distinguished from new feature development so priorities, effort and acceptance criteria remain clear." },
    ],
    related: ["cloud-devops", "testing-qa", "dedicated-team"],
  },
};

export const serviceIds = Object.keys(capabilityContent) as CapabilityId[];

export function getServiceBySlug(slug: string) {
  const id = serviceIds.find(key => capabilityContent[key].slug === slug);
  return id ? { id, ...capabilityContent[id], ...serviceDetails[id] } : undefined;
}
