import { blogs as initialBlogs, type BlogPost } from './blogs'
import { projects as initialProjects } from './projects'

export interface ProjectItem {
  id: string
  title: string
  tagline: string
  category: string
  year: string
  description: string
  longDescription: string
  tech: string[]
  image: string
  gallery: string[]
  github: string
  live: string
  featured: boolean
  gradient?: string
  stats: { label: string; value: string }[]
  highlights: string[]
}

export interface ExperienceItem {
  id: number
  period: string
  role: string
  company: string
  type: string
  description: string
  highlights: string[]
  stack: string[]
  tone: string
  companyUrl?: string
}

export interface EducationItem {
  period: string
  degree: string
  field: string
  institution: string
  desc: string
  tone: string
}

export interface CertificationItem {
  name: string
  issuer: string
  year: string
}

export interface SkillProficiency {
  name: string
  level: number
  delay: number
}

export interface SkillCategory {
  title: string
  tone: string
  skills: string[]
}

export interface ProfileData {
  name: string
  firstName: string
  lastName: string
  brandName: string
  brandHighlight: string
  navTaglines: string[]
  heroBadge: string
  heroGreeting: string
  heroSubtitle: string
  heroBio: string
  roles: string[]
  stats: { value: string; label: string }[]
  aboutTitle: string
  aboutHighlight: string
  aboutBio1: string
  aboutBio2: string
  aboutQuote: string
  avatarImage?: string
  aboutImage: string
  aboutImageQuote: string
  currentRole: string
  currentCompany: string
  currentCompanyUrl: string
  yearsExperience: string
  email: string
  phonePrimary: string
  phoneSecondary: string
  location: string
  address: string
  companyBadge: string
  website: string
  linkedin: string
  github: string
  twitter: string
  facebook: string
}

export interface PortfolioDatabase {
  profile: ProfileData
  projects: ProjectItem[]
  blogs: BlogPost[]
  experiences: ExperienceItem[]
  education: EducationItem[]
  certifications: CertificationItem[]
  educationStats: { value: string; label: string }[]
  proficiencies: SkillProficiency[]
  skillCategories: SkillCategory[]
  specializations: { title: string; desc: string }[]
}

export const DEFAULT_DB: PortfolioDatabase = {
  profile: {
    name: 'Md Mehedi Hasan',
    firstName: 'Mehedi',
    lastName: 'Hasan',
    brandName: 'mehedi',
    brandHighlight: '.ai',
    navTaglines: [
      'AGENTIC AI · LLM ARCHITECT',
      'MULTI-AGENT · HYBRID RAG',
      'PRODUCTION AI SYSTEMS',
    ],
    heroBadge: 'Available for new AI & LLM projects · Dhaka, BD',
    heroGreeting: "// Hello, I'm",
    heroSubtitle: '— architecting deterministic production systems with autonomous agents & AI',
    heroBio:
      'Senior AI/LLM Engineer with 5+ years building production AI systems and scalable Python backends. Specialised in LLM-powered multi-agent systems, hybrid RAG pipelines, agent orchestration, and automated AI evaluation frameworks.',
    roles: [
      'Senior AI/LLM Engineer',
      'Multi-Agent Systems Architect',
      'Agent Orchestration & RAG Expert',
      'AI Evals & Guardrails Specialist',
      'Scalable Python Backend Craftsman',
    ],
    stats: [
      { value: '5+', label: 'Yrs Exp' },
      { value: '40+', label: 'Projects' },
      { value: '99%', label: 'Client Sat' },
    ],
    aboutTitle: 'Senior AI/LLM Engineer &',
    aboutHighlight: 'Systems Architect',
    aboutBio1:
      'Based in Dhaka, Bangladesh, I specialize in building production AI systems and scalable Python backends with over 5+ years of hands-on engineering experience.',
    aboutBio2:
      'Specialised in LLM-powered multi-agent systems, RAG pipelines, agent orchestration, and AI evaluation frameworks. Experienced in designing tool-enabled agents, hybrid retrieval systems, provider-agnostic LLM architectures, guardrails, observability, regression testing, and production deployment.',
    aboutQuote:
      'Engineering resilient, non-deterministic AI pipelines into deterministic, high-throughput production realities.',
    avatarImage: '/images/professional-mehedi.png',
    aboutImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=85&auto=format',
    aboutImageQuote: 'Transforming ideas into intelligent systems.',
    currentRole: 'Senior LLM Engineer',
    currentCompany: 'MYai Robotics',
    currentCompanyUrl: 'https://www.facebook.com/MYai-Robotics-1058509204012017/',
    yearsExperience: '5+',
    email: 'mehediswpu@gmail.com',
    phonePrimary: '+8801339-388329',
    phoneSecondary: '+8801521-333362',
    location: 'Savar, Dhaka, BD',
    address: '99/1, Noyabari, Radio Colony, BPATC, Savar, Dhaka',
    companyBadge: 'CEO, StyleBuzzBD',
    website: 'mehediswpu.vercel.app',
    linkedin: 'https://www.linkedin.com/in/mehedihasan555552/',
    github: 'https://github.com/mehedihasan555552',
    twitter: 'https://x.com/ridoy123439',
    facebook: 'https://www.facebook.com/mehedihasan555552/',
  },
  projects: initialProjects,
  blogs: initialBlogs,
  experiences: [
    {
      id: 0,
      period: 'Mar 2026 – Present',
      role: 'Senior LLM Engineer',
      company: 'MYai Robotics',
      type: 'Full-time',
      description:
        'Working at the forefront of Human AI teammate development — building intelligent agents that augment workforce capabilities across industries. Contributing to advanced search engine applications that deliver clarity in authentication and amplify unfiltered insights to guide business strategies and inform public policy.',
      highlights: [
        'Engineering advanced LLM-powered agents that act as Human AI teammates across enterprise workflows',
        'Building intelligent search engine applications for authentication clarity and business strategy insights',
        'Designing multi-agent systems that amplify workforce capabilities and automate complex decision-making',
        'Contributing to AI infrastructure powering public policy insight and real-time data intelligence',
      ],
      stack: ['LLMs', 'LangChain', 'LangGraph', 'RAG', 'FastAPI', 'Python', 'Vector DB', 'OpenAI'],
      tone: 'var(--c-1)',
      companyUrl: 'https://www.facebook.com/MYai-Robotics-1058509204012017/',
    },
    {
      id: 5,
      period: '2023 – Present',
      role: 'CEO & Full-Stack Developer',
      company: 'StyleBuzzBD',
      type: 'Founder',
      description:
        'Founded and leading StyleBuzzBD as CEO while hands-on developing the full-stack platform. Overseeing product vision, team management, and technical architecture to build a thriving fashion-tech brand in Bangladesh.',
      highlights: [
        'Founded and scaled StyleBuzzBD from concept to a live fashion-tech platform',
        'Architected and built the full-stack platform with React frontend and Django backend',
        'Leading product strategy, brand direction, and business development as CEO',
        'Managing a cross-functional team across design, development, and marketing',
      ],
      stack: ['React', 'Next.js', 'Django', 'PostgreSQL', 'Tailwind CSS', 'Python', 'Stripe'],
      tone: 'var(--c-5)',
    },
    {
      id: 1,
      period: '2024 – Present',
      role: 'Python Backend & AI Developer',
      company: 'SoftwareBari',
      type: 'Full-time',
      description:
        'Building intelligent backend systems with Python Django and integrating AI/ML models into production pipelines. Leading architecture decisions and deploying scalable, high-performance applications for enterprise clients.',
      highlights: [
        'Designed AI-powered REST APIs serving 10K+ requests/day with sub-100ms response',
        'Integrated LLM models (GPT-4, Claude) into live web applications with streaming responses',
        'Built end-to-end ML pipelines with TensorFlow & PyTorch, deployed via Docker + CI/CD',
        'Led backend architecture decisions for 5+ client projects from scoping to production',
      ],
      stack: ['Python', 'Django', 'FastAPI', 'TensorFlow', 'Docker', 'PostgreSQL', 'Redis'],
      tone: 'var(--c-3)',
    },
    {
      id: 2,
      period: 'Nov 2021 – May 2023',
      role: 'Python Backend Developer',
      company: 'Automation Solutionz',
      type: 'Full-time',
      description:
        'Developed and maintained robust Python Django applications, REST APIs, and intelligent automation scripts. Collaborated closely with frontend teams to deliver complete, production-ready web solutions.',
      highlights: [
        'Built and maintained 15+ Django REST API applications across diverse industries',
        'Automated critical business workflows reducing manual processing time by 60%',
        'Integrated Stripe, SSL Commerz payment gateways and 10+ third-party API services',
        'Optimized complex PostgreSQL queries cutting average response time by 40%',
      ],
      stack: ['Python', 'Django', 'REST API', 'Celery', 'Redis', 'MySQL', 'Nginx'],
      tone: 'var(--c-6)',
    },
    {
      id: 3,
      period: 'May 2021 – Oct 2021',
      role: 'Full-Stack Developer',
      company: 'DevHub Tech',
      type: 'Full-time',
      description:
        'Built complete web applications from design to deployment, handling both React frontend and Python Django backend. Delivered polished, responsive products in a fast-paced agile team environment.',
      highlights: [
        'Delivered 8+ full-stack web applications end-to-end within tight deadlines',
        'Implemented pixel-perfect responsive UIs using React.js and Tailwind CSS',
        'Developed RESTful APIs and seamlessly integrated them with React frontend',
        'Participated in daily agile standups, sprint planning, and peer code reviews',
      ],
      stack: ['React', 'Python', 'Django', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
      tone: 'var(--c-2)',
    },
    {
      id: 4,
      period: '2021 – Present',
      role: 'Freelance AI/ML Consultant',
      company: 'Freelancer.com',
      type: 'Freelance',
      description:
        'Providing expert AI/ML consulting and development services to international clients across 10+ countries. Building custom ML models, NLP solutions, computer vision systems, and intelligent web applications that deliver real business value.',
      highlights: [
        'Delivered 30+ successful freelance projects with 5-star ratings from global clients',
        'Built custom NLP pipelines for sentiment analysis, text classification & summarization',
        'Developed computer vision solutions with OpenCV for defect detection and recognition',
        'Created LLM-powered chatbots and RAG systems for enterprise knowledge bases',
      ],
      stack: ['Python', 'TensorFlow', 'PyTorch', 'LangChain', 'NLP', 'OpenCV', 'Scikit-learn'],
      tone: 'var(--c-4)',
    },
  ],
  education: [
    {
      period: '2021–2024',
      degree: "Master's Degree",
      field: 'Computer Science & Engineering',
      institution: 'Southwest Petroleum University',
      desc: 'Focused on ML, Deep Learning, and Advanced Algorithms. Thesis on NLP applications.',
      tone: 'var(--c-1)',
    },
    {
      period: '2017–2021',
      degree: "Bachelor's Degree",
      field: 'Computer Science & Engineering',
      institution: 'Southwest Petroleum University',
      desc: 'Study of CS fundamentals, software engineering, data structures, algorithms, and web development.',
      tone: 'var(--c-2)',
    },
    {
      period: '2013–2015',
      degree: 'Higher Secondary (HSC)',
      field: 'Science',
      institution: 'Jahangirnagar University School & College',
      desc: 'Higher secondary with focus on Science, Mathematics, and Physics.',
      tone: 'var(--c-3)',
    },
    {
      period: '2003–2013',
      degree: 'Secondary School (SSC)',
      field: 'Science',
      institution: 'Radio Colony Model School & College',
      desc: 'Completed secondary education with distinction, building a strong foundation in Science, Mathematics, and Bengali literature.',
      tone: 'var(--c-5)',
    },
  ],
  certifications: [
    { name: 'Machine Learning Specialization', issuer: 'Coursera / Stanford', year: '2023' },
    { name: 'Deep Learning Specialization', issuer: 'deeplearning.ai', year: '2023' },
    { name: 'Python for Data Science', issuer: 'IBM / Coursera', year: '2022' },
    { name: 'AWS Cloud Fundamentals', issuer: 'Amazon Web Services', year: '2022' },
  ],
  educationStats: [
    { value: '7+', label: 'Years Study' },
    { value: '4', label: 'Institutions' },
    { value: '4', label: 'Certifications' },
  ],
  proficiencies: [
    { name: 'Python & Async Backends', level: 96, delay: 0 },
    { name: 'Multi-Agent Orchestration', level: 94, delay: 110 },
    { name: 'Advanced RAG & Hybrid Search', level: 93, delay: 220 },
    { name: 'AI Evals & Regression Testing', level: 90, delay: 330 },
    { name: 'LLM Gateways & Guardrails', level: 89, delay: 440 },
    { name: 'Docker, DevOps & CI/CD', level: 85, delay: 550 },
  ],
  skillCategories: [
    { title: 'Agentic AI', tone: 'var(--c-1)', skills: ['LangGraph', 'Multi-Agent DAG', 'Supervisor Pattern', 'Tool Calling', 'Pydantic V2', 'State Machines', 'AutoGen'] },
    { title: 'RAG & Search', tone: 'var(--c-2)', skills: ['Hybrid Retrieval', 'BM25', 'Dense Vectors', 'Cohere Rerank', 'Qdrant', 'Pinecone', 'Parent-Child RAG', 'Embeddings'] },
    { title: 'Evals & Security', tone: 'var(--c-5)', skills: ['Ragas', 'LLM-as-a-Judge', 'NeMo Guardrails', 'PII Redaction', 'Prompt Injection Defense', 'Langfuse', 'TruLens'] },
    { title: 'Backend', tone: 'var(--c-3)', skills: ['Python', 'FastAPI', 'AsyncIO', 'Django / DRF', 'Celery', 'Redis Streams', 'SSE Streaming', 'WebSockets'] },
    { title: 'DevOps & MLOps', tone: 'var(--c-4)', skills: ['Docker', 'vLLM', 'GitHub Actions CI/CD', 'Nginx', 'AWS EC2', 'Ubuntu Linux', 'Uvicorn'] },
    { title: 'Databases', tone: 'var(--c-6)', skills: ['PostgreSQL', 'Qdrant', 'Redis', 'Pinecone', 'MongoDB', 'MySQL', 'SQLite'] },
  ],
  specializations: [
    { title: 'Multi-Agent Systems', desc: 'Supervisor, Cyclic State Graphs' },
    { title: 'Advanced Hybrid RAG', desc: 'BM25 + Dense + Cohere Rerank' },
    { title: 'Tool-Enabled Agents', desc: 'Pydantic V2, Self-Healing Loops' },
    { title: 'Provider-Agnostic Gateways', desc: 'LiteLLM, Resilient Failovers' },
    { title: 'AI Evals & CI/CD', desc: 'Ragas, LLM-as-a-Judge, PR Gating' },
    { title: 'Guardrails & Security', desc: 'Prompt Injection, PII Masking' },
  ],
}
