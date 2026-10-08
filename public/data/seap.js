export default {
  id: 'seap',
  code: 'SEAP',
  name: 'Software Engineering',
  world: 'site',
  colors: { main: '#f97316', deep: '#7c2d12', soft: '#ffedd5', accent: '#22c55e' },
  blurb: 'Building software the right way, without breaking it later.',
  questions: [
    // ------------------------------------------------------------------ Q1
    {
      id: 'seap-q1',
      num: 1,
      topic: 'Risk Management and RMMM',
      question:
        'Explain Risk Identification, Risk Assessment, and Risk Projection in software projects. How does the RMMM plan help in managing identified risks?',
      scene: {
        art: 'risk',
        caption: 'A helmet on a walking stick beside a trench',
      },
      analogy: {
        title: 'Plan for a rainy picnic',
        body: 'You check the weather, work out how likely rain is and how bad it would be, keep an eye on the clouds, and carry a spare tent just in case.',
      },
      definition:
        'A risk is a possible future problem. Software teams find risks first, judge how bad each one is, then keep a written plan ready so nothing surprises them.',
      ideas: [
        {
          key: 'risk',
          term: 'Risk',
          text: 'A risk is something that might go wrong later. It can hurt the time, the money or the quality of the project.',
          hit: ['risk', 'possible problem', 'something might go wrong', 'future problem', 'uncertain event'],
          hint: 'Say what a risk is: a problem that has not happened yet.',
        },
        {
          key: 'risk-id',
          term: 'Risk Identification',
          text: 'This is the first step: list every risk you can think of. Checklists, brainstorming and lessons from old projects all help.',
          hit: ['risk identification', 'identifying risks', 'finding risks', 'identify', 'list the risks', 'spot the risks'],
          hint: 'First you find the risks and write them all down.',
        },
        {
          key: 'categories',
          term: 'Risk Categories',
          text: 'Risks fall into groups: project risks like staff and schedule, technical risks like design, and business risks like budget and market.',
          hit: ['risk categories', 'types of risk', 'kinds of risk', 'project risk', 'technical risk', 'business risk'],
          hint: 'Name the three risk groups and give one example of each.',
        },
        {
          key: 'risk-assess',
          term: 'Risk Assessment',
          text: 'For each risk you judge two things: how likely it is, and how much damage it would do. A probability and impact table is a usual way to do this.',
          hit: ['risk assessment', 'assessing risks', 'likelihood', 'how likely', 'probability and impact', 'chance of happening'],
          hint: 'Each risk gets a likelihood and an impact.',
        },
        {
          key: 'risk-proj',
          term: 'Risk Projection',
          text: 'Next you work out the risk exposure, which is probability times impact. That single number lets you compare risks fairly.',
          hit: ['risk projection', 'projecting the risks', 'risk exposure', 'probability times impact', 'likelihood times impact'],
          hint: 'Multiply probability by impact to get the exposure.',
        },
        {
          key: 'ranking',
          term: 'Risk Ranking',
          text: 'Sort the risk list by exposure, biggest first. Now you know which few risks deserve your time and money.',
          hit: ['risk ranking', 'rank', 'prioritise', 'prioritize', 'sort the risks', 'highest first'],
          hint: 'Handle the highest exposure risks first.',
        },
        {
          key: 'rmmm',
          term: 'RMMM',
          text: 'RMMM stands for Risk Mitigation, Monitoring and Management. It is the written plan that deals with every top risk you found.',
          hit: ['rmmm', 'risk mitigation monitoring and management', 'mitigation monitoring and management', 'rmm plan', 'risk management plan'],
          hint: 'Spell out RMMM and say what the plan covers.',
        },
        {
          key: 'mitigation',
          term: 'Mitigation',
          text: 'Take action now to lower the chance or the damage. Example: train a second person on the risky module.',
          hit: ['mitigation', 'reduce the risk', 'lower the chance', 'avoid the risk', 'make it less likely', 'reduce the damage'],
          hint: 'Act early to make a risk less likely or less harmful.',
        },
        {
          key: 'monitoring',
          term: 'Monitoring',
          text: 'Keep watching for warning signs, called triggers. You want to see the risk coming while you can still do something.',
          hit: ['monitoring', 'warning signs', 'triggers', 'keep an eye on', 'watch for early signs', 'watch the risk'],
          hint: 'Watch for triggers that show the risk is starting.',
        },
        {
          key: 'contingency',
          term: 'Contingency Plan',
          text: 'If the risk does happen you already have plan B ready: extra staff, extra budget or a backup server.',
          hit: ['contingency plan', 'backup plan', 'plan b', 'fallback', 'if it happens', 'manage the risk'],
          hint: 'Keep a ready plan for when the risk actually hits.',
        },
      ],
      mnemonic: {
        line: 'Danger Is Caught And Ranked, Risks Managed, Mitigated, Monitored, Controlled',
      },
    },

    // ------------------------------------------------------------------ Q2
    {
      id: 'seap-q2',
      num: 2,
      topic: 'Software Configuration Management',
      question:
        'What is Software Configuration Management (SCM)? Explain SCM repositories and the major activities involved in the SCM process.',
      scene: {
        art: 'scm',
        caption: 'A labelled crate with three sealed versions inside',
      },
      analogy: {
        title: 'Keeping a recipe box',
        body: 'Every recipe card is numbered, you keep one clean master copy, and no card changes without asking the person in charge first.',
      },
      definition:
        'SCM is the discipline of tracking and controlling every change to a software product. It keeps the work consistent and lets anyone see who changed what, and when.',
      ideas: [
        {
          key: 'scm',
          term: 'SCM',
          text: 'SCM means keeping track of every change made to the software and controlling who may make it. Without it the project quickly gets confused.',
          hit: ['scm', 'software configuration management', 'configuration management', 'track changes', 'control changes', 'keeping track of changes'],
          hint: 'Define SCM as tracking and controlling changes.',
        },
        {
          key: 'ci',
          term: 'Configuration Item (CI)',
          text: 'A configuration item is anything under SCM control: source code, documents, test cases, scripts, even the hardware list.',
          hit: ['configuration item', 'configuration items', 'ci', 'under version control', 'tracked item', 'item under scm'],
          hint: 'List the things that count as configuration items.',
        },
        {
          key: 'baseline',
          term: 'Baseline',
          text: 'A baseline is a snapshot everyone has agreed on. You cannot quietly change it, you must go through change control.',
          hit: ['baseline', 'baselines', 'snapshot', 'agreed version', 'fixed point', 'marked version'],
          hint: 'A baseline is an agreed snapshot that is hard to change.',
        },
        {
          key: 'repo',
          term: 'Repository',
          text: 'The repository is the one central store where all configuration items and every version of them are kept, with access control.',
          hit: ['repository', 'repositories', 'central store', 'central place', 'server that stores', 'storage place'],
          hint: 'Say what a repository holds and why it is central.',
        },
        {
          key: 'identify',
          term: 'Configuration Identification',
          text: 'This activity decides which items are configuration items and when a baseline is marked. Naming and numbering each item matters.',
          hit: ['configuration identification', 'identification', 'decide which items', 'naming and numbering', 'label the items', 'which items are'],
          hint: 'Identification decides what is a CI and when a baseline is set.',
        },
        {
          key: 'version',
          term: 'Version Control',
          text: 'Version control keeps every version and lets you branch, merge and roll back to an earlier version when something goes wrong.',
          hit: ['version control', 'versioning', 'different versions', 'branching', 'merging', 'rollback'],
          hint: 'Version control supports branching, merging and going back.',
        },
        {
          key: 'change',
          term: 'Change Control',
          text: 'No change happens on a whim. The flow is: request, study the impact, get approval, make the change, then verify it.',
          hit: ['change control', 'change request', 'impact analysis', 'approve the change', 'controlled change', 'request a change'],
          hint: 'Give the change control flow from request to verification.',
        },
        {
          key: 'ccb',
          term: 'Change Control Board (CCB)',
          text: 'The CCB is the small group that reviews each request and simply says yes or no. It is the gatekeeper for every change.',
          hit: ['change control board', 'ccb', 'review board', 'approves the change', 'approval group', 'say yes or no'],
          hint: 'Name the board that approves or rejects changes.',
        },
        {
          key: 'audit',
          term: 'Audit (FCA and PCA)',
          text: 'An audit checks the change was really done properly. FCA checks it works as asked, PCA checks the paperwork and files are right.',
          hit: ['audit', 'audits', 'fca', 'pca', 'functional configuration audit', 'physical configuration audit'],
          hint: 'FCA checks function, PCA checks the physical form.',
        },
        {
          key: 'status',
          term: 'Status Accounting',
          text: 'Status accounting records what changed, who changed it and when. That record is the trail you follow later.',
          hit: ['status accounting', 'record what changed', 'who changed it', 'change history', 'track record', 'audit trail'],
          hint: 'Status accounting records what, who and when.',
        },
      ],
      mnemonic: {
        line: 'Smart Code Builders Keep Indexed Versions, Changes Checked, Audits Saved',
      },
    },

    // ------------------------------------------------------------------ Q3
    {
      id: 'seap-q3',
      num: 3,
      topic: 'Levels of Testing',
      question:
        'Explain the different levels of software testing: Unit Testing, Integration Testing, System Testing, and Acceptance Testing. Give a suitable example for each.',
      scene: {
        art: 'testing',
        caption: 'Four magnifying glasses on a package, from tiny to huge',
      },
      analogy: {
        title: 'Checking a car before the drive',
        body: 'You test one switch, then the dashboard and the engine together, then the whole car on the road, and finally let the buyer take it for a spin.',
      },
      definition:
        'Testing grows in size. Small pieces are checked alone, then together, then the whole product, and finally the customer decides whether it is good enough.',
      ideas: [
        {
          key: 'levels',
          term: 'Levels of Testing',
          text: 'Testing is done in levels. Each level looks at a bigger piece of the software than the one before it.',
          hit: ['levels of testing', 'levels', 'testing levels', 'different levels', 'step by step testing', 'stages of testing'],
          hint: 'Say testing happens in levels, each bigger than the last.',
        },
        {
          key: 'unit',
          term: 'Unit Testing',
          text: 'Test one small piece on its own. Example: check that a login function rejects a wrong password.',
          hit: ['unit testing', 'unit test', 'single module', 'smallest part', 'test one function', 'in isolation'],
          hint: 'Unit testing checks one piece alone, and give the login example.',
        },
        {
          key: 'stub',
          term: 'Stubs and Drivers',
          text: 'While testing a piece alone you stand in for its missing neighbours. A stub is a fake above it, a driver pushes into it from below.',
          hit: ['stub', 'driver', 'stubs and drivers', 'dummy piece', 'fake neighbour', 'replace the missing'],
          hint: 'A stub replaces what is above, a driver pushes from below.',
        },
        {
          key: 'integration',
          term: 'Integration Testing',
          text: 'Check that two pieces work together properly at their interface. Example: login plus the database returns the right user.',
          hit: ['integration testing', 'integration test', 'modules together', 'work together', 'linking the modules', 'combined modules'],
          hint: 'Integration testing checks pieces working together. Use the login and database example.',
        },
        {
          key: 'approach',
          term: 'Top-down, Bottom-up, Sandwich',
          text: 'You can join pieces from the top down using stubs, from the bottom up using drivers, or sandwich style using both.',
          hit: ['top down', 'bottom up', 'sandwich', 'top-down', 'bottom-up', 'big bang'],
          hint: 'Name the three integration approaches.',
        },
        {
          key: 'system',
          term: 'System Testing',
          text: 'Test the whole finished product from the outside, including speed and security. Example: the full checkout flow from cart to payment.',
          hit: ['system testing', 'system test', 'whole system', 'entire product', 'complete build', 'end to end'],
          hint: 'System testing checks the complete build end to end.',
        },
        {
          key: 'acceptance',
          term: 'Acceptance Testing',
          text: 'The customer tries the system and checks it fits the real need. They sign off at the end, then it is accepted.',
          hit: ['acceptance testing', 'acceptance test', 'customer testing', 'user testing', 'sign off', 'client accepts'],
          hint: 'Acceptance testing is done by the customer, who then signs off.',
        },
        {
          key: 'alpha',
          term: 'Alpha Testing',
          text: 'Alpha testing is done in house by the development team themselves, before anybody outside the company sees it.',
          hit: ['alpha testing', 'alpha', 'in house testing', 'by the developers', 'internal testing', 'internal team tests'],
          hint: 'Alpha is in house testing by the own team.',
        },
        {
          key: 'beta',
          term: 'Beta Testing',
          text: 'Beta testing is done by real users out in the real world, before the final launch and with real data.',
          hit: ['beta testing', 'beta', 'real users', 'outside users', 'field testing', 'trial by users'],
          hint: 'Beta testing uses real outside users in the real world.',
        },
        {
          key: 'early',
          term: 'Test Early and Cheap',
          text: 'Always move from the smallest piece to the largest. A bug found now costs far less to fix than one found at the end.',
          hit: ['test early', 'early testing', 'smallest to largest', 'catch bugs early', 'cheaper to fix', 'cost of fixing'],
          hint: 'Testing goes from small to big, and early bugs are cheap.',
        },
      ],
      mnemonic: {
        line: 'Level Up Small Items, Arrange System, Acceptance, Alpha, Beta, Early',
      },
    },

    // ------------------------------------------------------------------ Q6
    {
      id: 'seap-q6',
      num: 6,
      topic: 'SQA Tasks and Metrics',
      question:
        'Explain the major tasks of Software Quality Assurance (SQA). What is an SQA plan, and what role do software metrics play in quality management?',
      scene: {
        art: 'sqa',
        caption: 'A clipboard checking ticks on a wall of code',
      },
      analogy: {
        title: 'Quality control in a kitchen',
        body: 'You set the rules, check the cooks follow them, taste every dish, and write down how many burnt dishes you get each week.',
      },
      definition:
        'SQA is the umbrella activity that makes sure the software and the way it was built meet agreed standards. It is about improving the process, not only testing at the end.',
      ideas: [
        {
          key: 'sqa',
          term: 'SQA',
          text: 'SQA means Software Quality Assurance. It is a planned activity that makes sure the product and the process match agreed standards.',
          hit: ['sqa', 'software quality assurance', 'quality assurance', 'making sure quality', 'ensure quality'],
          hint: 'Define SQA as planned work that ensures standards are met.',
        },
        {
          key: 'standards',
          term: 'Standards',
          text: 'SQA writes down the coding and documentation standards, then checks that the team really follows them.',
          hit: ['standards', 'coding standards', 'documentation standards', 'guidelines', 'follow the standards', 'written rules'],
          hint: 'SQA sets the standards and checks the team follows them.',
        },
        {
          key: 'prevention',
          term: 'Prevention',
          text: 'Good quality is built in from the start. Testing at the end only finds problems, it cannot stop them.',
          hit: ['prevention', 'prevent problems', 'build quality in', 'fix the process', 'quality is built in', 'stop problems early'],
          hint: 'The aim is to stop problems, not just find them at the end.',
        },
        {
          key: 'independence',
          term: 'Independence',
          text: 'The SQA group should report to management, not to the developers. That way its checks stay honest.',
          hit: ['independent', 'independence', 'report to management', 'not report to developers', 'separate from developers', 'free to report'],
          hint: 'SQA must be independent of the developers.',
        },
        {
          key: 'reviews',
          term: 'Reviews and Audits',
          text: 'SQA joins the formal reviews and audits, and watches the defect count over time to see if quality is really improving.',
          hit: ['review', 'reviews', 'audit', 'audits', 'formal technical review', 'watching defects'],
          hint: 'SQA takes part in reviews and audits.',
        },
        {
          key: 'defects',
          term: 'Defect Tracking',
          text: 'Every bug goes into one list with its status and owner. That list is the proof of what SQA is doing.',
          hit: ['defect tracking', 'bug tracking', 'track bugs', 'bug list', 'defect log', 'keep record of bugs'],
          hint: 'All bugs are recorded and tracked in one place.',
        },
        {
          key: 'plan',
          term: 'SQA Plan',
          text: 'The SQA plan says which standards apply, who does what, on what dates, which tools are used and how problems are escalated.',
          hit: ['sqa plan', 'quality assurance plan', 'the plan', 'written plan', 'who is responsible', 'which tools'],
          hint: 'The SQA plan lists standards, roles, dates, tools and escalation.',
        },
        {
          key: 'product-metrics',
          term: 'Product Metrics',
          text: 'Product metrics measure the finished software: defects per module, mean time to failure, and reliability.',
          hit: ['product metrics', 'defect density', 'mean time to failure', 'mttf', 'reliability', 'measure the product'],
          hint: 'Product metrics measure the product itself. Name two of them.',
        },
        {
          key: 'process-metrics',
          term: 'Process Metrics',
          text: 'Process metrics measure how the team works: how many review comments were useful, and how much the schedule slipped.',
          hit: ['process metrics', 'process quality', 'schedule variance', 'defect removal efficiency', 'measure the process'],
          hint: 'Process metrics measure the way the team works.',
        },
        {
          key: 'dre',
          term: 'Defect Removal Efficiency',
          text: 'DRE is the defects found before delivery divided by all defects. We want this close to one, because early defects are cheap ones.',
          hit: ['defect removal efficiency', 'dre', 'defects found before', 'caught before delivery', 'early defects', 'ratio of defects'],
          hint: 'DRE = defects caught before delivery over total defects.',
        },
      ],
      mnemonic: {
        line: 'Set Standards, Practice Independence, Review Defects, Plan, Prioritise, Prove, Deliver',
      },
    },

    // ------------------------------------------------------------------ Q8
    {
      id: 'seap-q8',
      num: 8,
      topic: 'Types of Maintenance',
      question:
        'Explain the four types of software maintenance: Corrective, Adaptive, Preventive, and Perfective. Provide one example of each.',
      scene: {
        art: 'maintenance',
        caption: 'A mechanic with four labelled tool trays',
      },
      analogy: {
        title: 'Keeping an old car on the road',
        body: 'You fix the leaking pipe, move it to the new fuel pump, tune it so it does not break next month, and add a nicer dashboard.',
      },
      definition:
        'Maintenance is any change made to software after delivery. Four kinds cover almost all of it: fixing, adapting, improving and preventing.',
      ideas: [
        {
          key: 'maint',
          term: 'Maintenance',
          text: 'Maintenance is any change made to software after it has been handed over. It is what keeps the software working and worth using.',
          hit: ['maintenance', 'after delivery', 'changes after release', 'keeping it working', 'post delivery', 'after it is delivered'],
          hint: 'Define maintenance as change made after delivery.',
        },
        {
          key: 'corrective',
          term: 'Corrective Maintenance',
          text: 'You fix a bug that has already happened. Example: payments fail, so you repair the payment code.',
          hit: ['corrective', 'corrective maintenance', 'fixing bugs', 'bug fix', 'repairing errors', 'fix errors'],
          hint: 'Corrective means fixing a bug that already occurred.',
        },
        {
          key: 'adaptive',
          term: 'Adaptive Maintenance',
          text: 'You change the software so it fits a new environment. Example: making the app run on the newest phone operating system.',
          hit: ['adaptive', 'adaptive maintenance', 'new environment', 'new operating system', 'new platform', 'changing platform'],
          hint: 'Adaptive means changing to fit a new environment.',
        },
        {
          key: 'perfective',
          term: 'Perfective Maintenance',
          text: 'You add new features or make it faster and nicer. Example: adding a dark mode option.',
          hit: ['perfective', 'perfective maintenance', 'new features', 'improving performance', 'adding features', 'better user experience'],
          hint: 'Perfective means adding features or improving speed.',
        },
        {
          key: 'preventive',
          term: 'Preventive Maintenance',
          text: 'You clean up the code now so that bugs do not come later. Example: rewriting old messy code into clean code.',
          hit: ['preventive', 'preventive maintenance', 'prevent future', 'cleaning the code', 'refactoring', 'cleaning up code'],
          hint: 'Preventive cleans up now to avoid problems later.',
        },
        {
          key: 'share',
          term: 'Perfective Takes the Largest Share',
          text: 'Most of the maintenance effort goes to perfective work, because users keep asking for more and more.',
          hit: ['largest share', 'most of the maintenance', 'biggest part', 'highest cost', 'takes the most time', 'majority of maintenance'],
          hint: 'Say which type of maintenance takes the biggest share.',
        },
        {
          key: 'cost',
          term: 'Maintenance Cost',
          text: 'Most of the life cost of a software product is spent on maintenance, not on building it. So it has to be planned for.',
          hit: ['maintenance cost', 'cost of maintenance', 'most of the total cost', 'expensive', 'life cycle cost', 'big cost'],
          hint: 'Maintenance costs more than building, over the product life.',
        },
        {
          key: 'impact',
          term: 'Effect of Poor Maintenance',
          text: 'Skip maintenance and quality drops, bugs pile up, users leave, and every later change becomes harder.',
          hit: ['poor maintenance', 'bad maintenance', 'quality drops', 'bugs pile up', 'users leave', 'hard to change'],
          hint: 'Skipping maintenance brings low quality and unhappy users.',
        },
        {
          key: 'techniques',
          term: 'Safe Change Techniques',
          text: 'Use version control, regression tests and up to date documents, so one change does not quietly break old work.',
          hit: ['version control', 'regression testing', 'regression tests', 'documentation', 'change safely', 'without breaking'],
          hint: 'Version control, regression tests and documents make changes safe.',
        },
        {
          key: 'goal',
          term: 'Goal of Maintenance',
          text: 'Keep the software correct, working and useful for as long as people need it, at the lowest sensible cost.',
          hit: ['goal of maintenance', 'keep it working', 'keep it useful', 'keep the software', 'long life', 'still useful'],
          hint: 'The goal is to keep it working and useful for as long as needed.',
        },
      ],
      mnemonic: {
        line: 'My Crew Always Prevents Problems, Secures Cash, Improves Things, Guards',
      },
    },

    // ----------------------------------------------------------------- Q10
    {
      id: 'seap-q10',
      num: 10,
      topic: 'Agile Manifesto and Principles',
      question:
        'Explain the Agile Manifesto and its principles. How do Agile values differ from traditional plan-driven software development approaches?',
      scene: {
        art: 'agile',
        caption: 'A runner on a loop track with a plan board melting behind',
      },
      analogy: {
        title: 'Cooking dinner for friends',
        body: 'You do not plan every dish three months ahead. You cook a bit, taste it, and change the next dish based on what people say.',
      },
      definition:
        'Agile is a mindset that values working software, people, customer partnership and change more than paperwork and rigid plans. It delivers value in short cycles with constant feedback.',
      ideas: [
        {
          key: 'agile',
          term: 'Agile',
          text: 'Agile means building in small steps and getting feedback fast, rather than following one big plan from start to finish.',
          hit: ['agile', 'agile approach', 'small steps', 'short cycles', 'iterative', 'in small pieces'],
          hint: 'Agile = small steps and fast feedback, not one big plan.',
        },
        {
          key: 'value1',
          term: 'Individuals and Interactions',
          text: 'The manifesto puts people talking to people above processes and tools. A tool that stops people talking is the wrong tool.',
          hit: ['individuals and interactions', 'people over processes', 'people working together', 'teamwork', 'humans over tools', 'talking to people'],
          hint: 'Value 1: individuals and interactions over processes and tools.',
        },
        {
          key: 'value2',
          term: 'Working Software',
          text: 'Working software is valued more than heavy documentation. A build that actually runs is the proof, not a thick file.',
          hit: ['working software', 'software that runs', 'running program', 'more than documentation', 'less documentation', 'working product'],
          hint: 'Value 2: working software over comprehensive documentation.',
        },
        {
          key: 'value3',
          term: 'Customer Collaboration',
          text: 'The customer is a partner, not someone you hand a finished product to at the very end.',
          hit: ['customer collaboration', 'customer involvement', 'working with customer', 'customer part of the team', 'client involved', 'customer feedback'],
          hint: 'Value 3: customer collaboration over contract negotiation.',
        },
        {
          key: 'value4',
          term: 'Responding to Change',
          text: 'Changing requirements are welcome, even late in the project. Change is treated as a competitive advantage, not a problem.',
          hit: ['responding to change', 'welcome change', 'change is welcome', 'embrace change', 'accept change', 'changing requirements'],
          hint: 'Value 4: responding to change over following a plan.',
        },
        {
          key: 'p-delivery',
          term: 'Early and Continuous Delivery',
          text: 'The top priority is useful software delivered early and often, every couple of weeks or months, with the shorter time preferred.',
          hit: ['early delivery', 'continuous delivery', 'frequent delivery', 'early and continuous', 'often releases', 'useful software early'],
          hint: 'Principle 1: satisfy the customer through early, continuous delivery.',
        },
        {
          key: 'p-team',
          term: 'Motivated, Self-Organising Teams',
          text: 'Agile teams are small, motivated and self-organising. Give them support and trust, and they decide the work themselves.',
          hit: ['motivated individuals', 'self organizing', 'self organising', 'trust the team', 'small team', 'empowered team'],
          hint: 'Principles 5 and 9: motivated people who organise themselves.',
        },
        {
          key: 'p-comm',
          term: 'Face-to-Face Communication',
          text: 'Talking directly is the best way to share information. Developers and business people work together daily, face to face.',
          hit: ['face to face', 'talking to each other', 'daily communication', 'direct conversation', 'sit together', 'talk in person'],
          hint: 'Principles 4 and 6: daily teamwork, and face-to-face talk is best.',
        },
        {
          key: 'p-pace',
          term: 'Sustainable Development and Reflection',
          text: 'Keep a steady pace you can hold forever, with no all-night cramming. At regular intervals the team tunes how it works.',
          hit: ['sustainable', 'constant pace', 'steady pace', 'no overtime', 'regular reflection', 'tune and adjust'],
          hint: 'Principles 8 and 10: a constant pace, plus regular reflection and tuning.',
        },
        {
          key: 'p-simple',
          term: 'Simplicity and Self-Organising Design',
          text: 'Do the least work that still works, since work not done is the real saving. Good architecture and design grow from the team, and working software shows the progress.',
          hit: ['simplicity', 'simplest thing', 'least work', 'do less', 'working software is progress', 'measure of progress'],
          hint: 'Principles 7, 11 and 12: simplicity, progress by working software, self-formed design.',
        },
      ],
      mnemonic: {
        line: 'All Ideas Work, Customers Change, Delightful Teams Chat Peacefully, Simply',
      },
    },

    // ----------------------------------------------------------------- Q11
    {
      id: 'seap-q11',
      num: 11,
      topic: 'Scrum Framework',
      question:
        'Explain the Scrum framework, including its roles, artifacts, and events. Describe how a Scrum team uses these elements during a Sprint.',
      scene: {
        art: 'scrum',
        caption: 'Three rugby players passing a ball around a loop',
      },
      analogy: {
        title: 'A kitchen brigade on a service',
        body: 'One chef orders the dishes, one keeps everyone unblocked, the cooks make the food, and every few minutes they call out what is happening.',
      },
      definition:
        'Scrum is an Agile framework with three roles, three artifacts and five events. Every Sprint, of one to four weeks, the team produces a usable Increment.',
      ideas: [
        {
          key: 'scrum',
          term: 'Scrum',
          text: 'Scrum is a way of working where the team ships usable software at the end of every Sprint. A Sprint is time-boxed, usually one to four weeks.',
          hit: ['scrum', 'scrum framework', 'time boxed', 'timeboxed', 'one to four weeks', 'short sprint'],
          hint: 'Scrum delivers in short, time-boxed Sprints of one to four weeks.',
        },
        {
          key: 'po',
          term: 'Product Owner',
          text: 'One person owns the Product Backlog and decides what gets built first and why. This is the only decision maker for value.',
          hit: ['product owner', 'po', 'owns the backlog', 'decides what to build', 'orders the backlog', 'prioritises the work'],
          hint: 'The Product Owner owns the backlog and sets the priority.',
        },
        {
          key: 'sm',
          term: 'Scrum Master',
          text: 'The Scrum Master clears blockers and keeps the process healthy. They do not order the work and do not manage the team.',
          hit: ['scrum master', 'clears blockers', 'removes obstacles', 'impediments', 'keeps the process', 'does not assign work'],
          hint: 'The Scrum Master removes blockers and protects the process.',
        },
        {
          key: 'dev',
          term: 'Developers',
          text: 'The developers decide how to build it and organise themselves. They turn backlog items into a working Increment.',
          hit: ['developers', 'development team', 'self organise', 'self organize', 'decides how', 'how to build'],
          hint: 'There are exactly three roles. Developers decide how to build it.',
        },
        {
          key: 'product-backlog',
          term: 'Product Backlog',
          text: 'The ordered list of everything wanted in the product. It is never finished, only re-ordered as priorities change.',
          hit: ['product backlog', 'list of wants', 'ordered list', 'backlog of items', 'to do list', 'never complete'],
          hint: 'Artifact 1: the Product Backlog, an ordered list that is never finished.',
        },
        {
          key: 'sprint-backlog',
          term: 'Sprint Backlog',
          text: 'The slice the team picked for this Sprint, plus the Sprint Goal and the plan for coming days.',
          hit: ['sprint backlog', 'this sprint only', 'sprint goal', 'selected items', 'plan for the days', 'commitment for the sprint'],
          hint: 'Artifact 2: the Sprint Backlog with the Sprint Goal.',
        },
        {
          key: 'increment',
          term: 'Increment',
          text: 'The usable slice of product added at the end of the Sprint. It must meet the Definition of Done to count as done.',
          hit: ['increment', 'usable slice', 'working product', 'shippable', 'done product', 'definition of done'],
          hint: 'Artifact 3: the Increment, which must meet the Definition of Done.',
        },
        {
          key: 'planning',
          term: 'Sprint Planning',
          text: 'At the start of the Sprint the team picks items from the backlog and agrees what it can realistically finish.',
          hit: ['sprint planning', 'planning event', 'agree the work', 'picks items', 'decides the sprint', 'what to finish'],
          hint: 'Event: Sprint Planning, where the team picks and sizes the work.',
        },
        {
          key: 'daily',
          term: 'Daily Scrum',
          text: 'Fifteen minutes every day to say what was done, what is next and what is in the way. Same time, same place.',
          hit: ['daily scrum', '15 minutes', 'fifteen minutes', 'every day', 'short daily meeting', 'stand up'],
          hint: 'Event: the 15-minute Daily Scrum, same time and place.',
        },
        {
          key: 'review-retro',
          term: 'Sprint Review and Retrospective',
          text: 'The Review shows the working product to the customer and takes feedback. The Retrospective looks at how the team worked and improves it.',
          hit: ['sprint review', 'retrospective', 'demo', 'feedback from customer', 'improve the process', 'what went well'],
          hint: 'Events: Review demos the product, Retrospective improves the team.',
        },
      ],
      mnemonic: {
        line: 'Scrum People Share, Develop Plans, Sprint Increment, Plan Daily, Reflect',
      },
    },

    // ----------------------------------------------------------------- Q15
    {
      id: 'seap-q15',
      num: 15,
      topic: 'DevOps, DevSecOps and SSDLC',
      question:
        'Explain the DevOps lifecycle and the concept of DevSecOps. How does Secure Software Development Lifecycle (SSDLC) integrate security throughout software development and delivery?',
      scene: {
        art: 'testing',
        caption: 'A loop of gears with a padlock in the middle',
      },
      analogy: {
        title: 'A restaurant that cooks and serves together',
        body: 'The cook who made the dish walks out to the table, and the security guard checks the recipe at the start instead of at the door.',
      },
      definition:
        'DevOps joins development and operations so software ships continuously. DevSecOps and the SSDLC make security a shared, built-in part of every stage instead of a final gate.',
      ideas: [
        {
          key: 'devops',
          term: 'DevOps',
          text: 'DevOps joins development and operations into one team. The wall between writing the code and running it comes down.',
          hit: ['devops', 'dev and ops', 'development and operations', 'one team', 'break the wall', 'bridge dev and ops'],
          hint: 'DevOps brings developers and operations together as one team.',
        },
        {
          key: 'lifecycle',
          term: 'DevOps Lifecycle',
          text: 'Work flows around a loop: plan, code, build, test, release, deploy, operate, monitor, and then back to plan with what you learned.',
          hit: ['lifecycle', 'devops lifecycle', 'plan code build', 'infinity loop', 'continuous loop', 'plan build test release'],
          hint: 'List the lifecycle stages: plan, code, build, test, release, deploy, operate, monitor.',
        },
        {
          key: 'ci',
          term: 'Continuous Integration (CI)',
          text: 'Developers push their code to the shared branch often, and an automated build and test runs on every push.',
          hit: ['continuous integration', 'ci', 'merge code often', 'push code', 'automated build', 'merge often'],
          hint: 'CI means merging often and building and testing automatically.',
        },
        {
          key: 'cd',
          term: 'Continuous Delivery / Deployment',
          text: 'Every build that passes tests can go live quickly and safely, either automatically or with one click.',
          hit: ['continuous delivery', 'continuous deployment', 'cd', 'deploy quickly', 'release often', 'one click'],
          hint: 'Continuous delivery ships passing builds quickly and safely.',
        },
        {
          key: 'iac',
          term: 'Infrastructure as Code (IaC)',
          text: 'Servers and setup are described in versioned text files instead of being hand-clicked, so infrastructure is repeatable and reviewable.',
          hit: ['infrastructure as code', 'iac', 'code for servers', 'versioned config', 'infrastructure files', 'scripted setup'],
          hint: 'IaC manages servers with versioned files, not manual clicks.',
        },
        {
          key: 'monitoring',
          term: 'Monitoring and Feedback',
          text: 'Logs, metrics and alerts from the live system go straight back to the developers, so problems are seen while they are still small.',
          hit: ['monitoring', 'logs', 'metrics', 'alerts', 'feedback from users', 'production feedback'],
          hint: 'Monitoring sends live feedback from operations back to development.',
        },
        {
          key: 'devsecops',
          term: 'DevSecOps',
          text: 'Security is not a final check by a separate team. Everyone owns security, and the security tools sit right inside the pipeline.',
          hit: ['devsecops', 'dev sec ops', 'shared responsibility', 'everyone owns security', 'security is everybody', 'security part of the team'],
          hint: 'DevSecOps makes security everyone\'s job inside the pipeline.',
        },
        {
          key: 'shift-left',
          term: 'Shift Left',
          text: 'Security moves to the early part of the work instead of the end. A hole found before launch costs far less to close.',
          hit: ['shift left', 'early security', 'security early', 'at the start', 'left side', 'from the beginning'],
          hint: 'Shift left means doing security early, not at the finish.',
        },
        {
          key: 'ssdlc',
          term: 'SSDLC',
          text: 'The SSDLC is a secure software development life cycle. Security activities are built into every stage, from design through to deployment.',
          hit: ['ssdlc', 'secure software development lifecycle', 'security in the lifecycle', 'secure sdlc', 'security across stages', 'built into development'],
          hint: 'SSDLC = security built into every stage of development.',
        },
        {
          key: 'practices',
          term: 'Security Practices',
          text: 'In practice this means threat modelling, SAST and DAST scans, dependency checks, and a security-minded code review.',
          hit: ['threat modelling', 'threat modeling', 'sast', 'dast', 'dependency check', 'secure code review'],
          hint: 'Name the security practices: threat modelling, SAST, DAST, dependency checks, secure review.',
        },
      ],
      mnemonic: {
        line: 'Develop Life Cycles Continue, Integrate, Monitor, Detect, Secure, Support, Perfect',
      },
    },
  ],
};