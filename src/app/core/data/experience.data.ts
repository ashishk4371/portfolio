import { Education, Experience } from '../models';

export const EXPERIENCES: readonly Experience[] = [
  {
    id: 'hub',
    company: 'HUB Platform Technologies',
    // companyUrl: 'https://example.com',
    role: 'Senior Software Engineer',
    type: 'Full-time',
    startDate: '2024-01-08',
    endDate: null,
    location: 'Gurugram · Hybrid',
    summary: '',
    highlights: [
      'Identified reliability gaps in the existing reporting pipeline and led the design of a configurable data orchestration framework from scratch, enabling real-time processing and daily generation of 50K+ financial reports.',
      "Drove technical design and build of a multi-asset Matching Platform for asset managers, reducing confirmation oversight cost by 35%; platform was selected to represent HUB's flagship trade capability at the Symphony Innovate Conference.",
      'Recognized that ad-hoc coordination across ingestion pipelines and distributed services was causing diﬃculty in maintaining consistency, and led the design and build of a Temporal + SignalR-based orchestration system that became the standard pattern for real-time coordination across Hub Platform services.',
      'Led consolidation of 120+ fragmented ETL pipelines into a unified framework, making the case for the migration, driving execution across teams, and improving reliability, traceability, and throughput by 70%.',
      'Designed and shipped a self-service analytics platform with automated SQL-based computations, eliminating manual analysis work and saving 15+ hours per report across teams.',
      'Mentored engineers through code and design reviews on the orchestration and ETL systems, established error-handling conventions adopted across our reviews.',
    ],
    stack: [
      'Java',
      'Spring Boot',
      'Snowflake DB',
      'PostgreSQL',
      'Azure',
      'Kafka',
      'Temporal',
      'SignalR',
      'Angular',
      'TypeScript',
    ],
  },
  {
    id: 'monster',
    company: 'FoundIt (Formerly Monster.com)',
    role: 'Software Engineer',
    type: 'Full-time',
    startDate: '2021-01-01',
    endDate: '2023-03-31',
    location: 'Noida · Hybrid',
    summary: '',
    highlights: [
      'Re-architected core Seeker Platform services to millisecond latency using Java microservices, Elasticsearch, and Kafka-based event pipelines, supporting scale to 500,000+ users.',
      'Owned the Resume Builder microservice end-to-end — architecture, on-call, and roadmap — maintaining 99.99% uptime while scaling to 250,000+ monthly downloads and driving 35% engagement growth.',
      'Designed real-time job recommendation pipelines using Kafka consumers, delivering personalized results to 40,000+ daily active users.',
      'Built a dynamic PDF generation and routing module using Thymeleaf, improving retention by 20%.',
    ],
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka', 'Docker'],
  },
  {
    id: 'avizva',
    company: 'Avizva Solutions',
    role: 'Software Engineer',
    type: 'Full-time',
    startDate: '2020-10-08',
    endDate: '2022-05-12',
    location: 'Gurugram · Remote',
    summary:
      'Software Engineer specializing in scalable enterprise integrations, high-throughput automated rule engines, and technical team enablement.',
    highlights: [
      'Led development of a scalable rule engine for insurance claims auditing, processing 250,000+ transactions monthly and integrated advanced validations and exception management in the Javelina-System, improving data quality by 35%.',
      'Automated Electronic Data Interchange (EDI) generation for the GBAS system, ensuring multi-format compatibility (FFD, CSV, EDI, TXT) across 14 downstream integrations and reducing manual input by 80%.',
      'Orchestrated a MuleSoft community of practice, enabling 10+ developers to cross-train on new API modules and become certified, thus improving overall team agility and responsiveness.',
    ],
    stack: ['Java', 'Mulesoft', 'PostgreSQL', 'Drools', 'Angular', 'TypeScript', 'AWS'],
  },
];

export const EDUCATION: readonly Education[] = [
  {
    id: 'btech',
    institution: 'Amity School of Engineering & Technology',
    qualification: 'B.Tech, Computer Science & Engineering',
    startYear: 2016,
    endYear: 2020,
    detail: 'Graduated with distinction. Final-year work on distributed cache invalidation.',
  },
];
