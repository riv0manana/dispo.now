export const en = {
  translation: {
    seo: {
      title: "dispo.now | The Self-Hosted Booking Infrastructure",
      description: "Stop paying the SaaS tax. The open-source, ACID-compliant booking infrastructure for developers. Own your data, scale unlimitedly, and eliminate race conditions.",
    },
    nav: {
      docs: "Docs",
      github: "GitHub",
      login: "Login"
    },
    hero: {
      badge: "Open Source & Self-Hosted",
      title: {
        part1: "The Booking",
        part2: "Infrastructure."
      },
      subtitle: {
        line1: "Stop rebuilding booking logic.",
        line2: "Start shipping your product."
      },
      description: "We handle the complex logic of availability, capacity, and concurrency so you can focus on your User Experience.",
      cta: {
        readDocs: "Read the Docs",
        getApiKey: "Get API Key"
      }
    },
    workflow: {
      title: "dispo.now handles availability and booking.",
      subtitle: "You handle the product, payments, and experience.",
      nodes: {
        app: "Your App",
        booking: "Booking Scheduler",
        payment: "Payments",
        auth: "Auth",
        db: "Database"
      }
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          id: "what-is-dispo-now",
          question: "What is dispo.now?",
          answer: "dispo.now is an open-source availability and reservation infrastructure. It handles time, capacity, and booking consistency so you can focus on your product, payments, and user experience."
        },
        {
          id: "what-problems-does-it-solve",
          question: "What problems does dispo.now solve?",
          answer: "It solves the hardest parts of booking systems: availability calculation, conflict prevention, concurrency, and reservation consistency across complex scenarios like rentals, shared resources, and time-based bookings."
        },
        {
          id: "what-dispo-now-does-not-do",
          question: "What does dispo.now intentionally NOT do?",
          answer: "dispo.now does not handle authentication, payments, pricing logic, emails, or business-specific workflows. These concerns are left to your application by design."
        },
        {
          id: "who-is-it-for",
          question: "Who is dispo.now for?",
          answer: "dispo.now is built for developers and teams building custom products that require bookings or reservations, such as rentals, marketplaces, scheduling platforms, or internal tools."
        },
        {
          id: "is-it-a-saas",
          question: "Is dispo.now a SaaS?",
          answer: "No. dispo.now is self-hosted and open-source. You run it on your own infrastructure, with no per-booking fees, usage limits, or vendor lock-in."
        },
        {
          id: "how-does-it-compare-to-calendly",
          question: "How is dispo.now different from Calendly or similar tools?",
          answer: "Calendly-style tools are end-user products with opinionated workflows. dispo.now is infrastructure. It provides booking primitives and APIs so you can build your own workflows, UI, and logic."
        },
        {
          id: "how-does-it-compare-to-cal-com",
          question: "How is dispo.now different from Cal.com?",
          answer: "Cal.com focuses on scheduling meetings. dispo.now focuses on availability and reservations as a system component, supporting rentals, capacity-based bookings, shared resources, and custom business rules."
        },
        {
          id: "can-i-use-it-with-stripe",
          question: "Can I use dispo.now with Stripe?",
          answer: "Yes. dispo.now is commonly used alongside Stripe for payments. dispo.now handles availability and reservations, while Stripe handles pricing, payments, and billing."
        },
        {
          id: "can-i-use-my-own-auth",
          question: "Can I use my own authentication system?",
          answer: "Yes. dispo.now is auth-agnostic. You can use Clerk, Auth0, custom JWTs, or any authentication system that fits your architecture."
        },
        {
          id: "how-do-i-store-business-data",
          question: "Where should I store my business and domain data?",
          answer: "Your business data stays in your own database. dispo.now stores only what is required to manage availability and reservations."
        },
        {
          id: "does-it-support-multiple-projects",
          question: "Does dispo.now support multiple projects or tenants?",
          answer: "Yes. dispo.now supports project isolation, allowing you to manage multiple products, environments, or tenants from a single instance."
        },
        {
          id: "is-it-production-ready",
          question: "Is dispo.now production-ready?",
          answer: "Yes. dispo.now is designed to be deterministic, consistent, and safe under concurrent usage, making it suitable for production workloads."
        },
        {
          id: "can-i-extend-booking-types",
          question: "Can I create custom booking types?",
          answer: "Yes. dispo.now provides flexible primitives that allow you to model different booking types such as rooms, vehicles, items, time slots, or hybrid scenarios."
        },
        {
          id: "how-does-it-scale",
          question: "How does dispo.now scale?",
          answer: "dispo.now scales horizontally and can be deployed using Docker in modern cloud environments. You control performance, scaling, and infrastructure choices."
        },
        {
          id: "why-open-source",
          question: "Why is dispo.now open-source?",
          answer: "Because availability and booking logic is core infrastructure. Open-source ensures transparency, extensibility, and long-term control for teams building serious products."
        }
      ]
    },
    features: {
      header: {
        title: "Built for <1>CTOs</1> who scale, and <3>Devs</3> who ship.",
        subtitle: "Stop reinventing scheduling logic. dispo.now provides the primitives you need to build complex booking flows without the headache."
      },
      cards: {
        resource: {
          title: "Resource Agnostic",
          subtitle: "Flexible by design, strict by nature.",
          tagline: "Don't fight the framework.",
          description: "Book rooms, equipment, doctors, or server slots. Our domain model is abstract enough to handle any bookable entity, yet strict enough to enforce validity.",
          tags: ["Universal Model", "Custom Metadata", "Any Asset"]
        },
        capacity: {
          title: "Capacity Safe",
          subtitle: "Guaranteed Consistency.",
          tagline: "Sleep soundly at night.",
          description: "Strict ACID compliance with Postgres serialization. We handle the race conditions, locking strategies, and transaction isolation so you never double-book.",
          tags: ["ACID", "Postgres", "No Overbooking"]
        },
        dx: {
          title: "DX First",
          subtitle: "Integration in minutes.",
          tagline: "Because your time matters.",
          description: "Fully typed TypeScript SDKs, comprehensive OpenAPI documentation, and a developer dashboard that respects your workflow. Integration takes minutes, not weeks.",
          tags: ["TypeScript", "OpenAPI", "Webhooks"]
        }
      },
      cta: "Read the Architecture Docs"
    },
    useCases: {
      header: {
        title: "Built for any booking scenario",
        subtitle: "From atomic transactions to multi-tenant isolation, dispo.now adapts to your domain model."
      },
      tabs: {
        car: {
          label: "Car Rental",
          description: "Individual booking with strict 1-unit capacity. Ideal for fleets, rentals, and equipment."
        },
        health: {
          label: "Healthcare",
          description: "Atomic group bookings. Reserve a Doctor and a Room simultaneously. If one fails, both fail."
        },
        course: {
          label: "Digital Course",
          description: "High capacity resources. Manage webinars, events, or classes with automatic seat tracking."
        },
        saas: {
          label: "SaaS Platform",
          description: "Multi-tenant architecture. Isolate customer data using Projects. One API, infinite tenants."
        },
        recurring: {
          label: "Recurring Booking",
          description: "Create a series of bookings in one atomic request. Perfect for weekly meetings or monthly subscriptions."
        },
        availability: {
          label: "Availability Check",
          description: "Query availability for a specific range. Perfect for building calendars and scheduling UIs."
        }
      },
      visuals: {
        available: "Available Slots",
        left: "left",
        booked: "Booked",
        atomic: "ATOMIC TRANSACTION",
        capacity: "Webinar Capacity",
        isolation: "Strict Isolation",
        recurring: "Every Wednesday"
      }
    },
    mcp: {
      badge: "AI Native Protocol",
      title: {
        part1: "Ready for the",
        part2: "Agentic Future"
      },
      description: "dispo.now isn't just an API for humans. We implement the <1>Model Context Protocol (MCP)</1>, allowing AI agents (like Claude, Cursor, or custom LLMs) to discover resources and make bookings autonomously.",
      points: [
        "Standardized Tool Discovery",
        "Direct Context Injection",
        "Zero-Hallucination Booking Flows"
      ],
      status: "MCP Connected",
      chat: {
        user: "Find a meeting room for 5 people tomorrow at 2 PM.",
        ai: "I've booked Conference Room A for you tomorrow at 2 PM. Reference: #bk_987"
      }
    },
    comparison: {
      badge: "INFRASTRUCTURE VS SAAS",
      title: "Stop paying the \"SaaS Tax\".",
      description: "Why rent an API when you can own the infrastructure? dispo.now gives you the control of building in-house with the speed of a managed service.",
      problem: "The Problem",
      solution: "The Solution",
      ready: "Ready to deploy via Docker",
      items: {
        sovereignty: {
          title: "Data Sovereignty",
          saas: {
            title: "SaaS APIs (Timekit, Hapio)",
            desc: "Your customer data lives in their cloud.",
            points: ["GDPR/HIPAA headaches", "Data leaks possible", "Vendor lock-in"]
          },
          dispo: {
            desc: "Runs in your VPC. You own everything.",
            points: ["100% Data Ownership", "Zero 3rd party leaks", "Audit logging"]
          }
        },
        cost: {
          title: "Cost & Scale",
          saas: {
            title: "SaaS APIs",
            desc: "Pay per request. Success = Penalty.",
            points: ["Expensive at scale", "Usage limits", "Unpredictable bills"]
          },
          dispo: {
            desc: "Free & Open Source (AGPLv3).",
            points: ["Unlimited Bookings", "Flat infrastructure cost", "No 'Success Tax'"]
          }
        },
        correctness: {
          title: "Correctness",
          saas: {
            title: "Building In-House",
            desc: "Race conditions are inevitable.",
            points: ["Double bookings", "Corrupted state", "Maintenance nightmare"]
          },
          dispo: {
            desc: "ACID Transaction Engine.",
            points: ["Postgres Strictness", "Atomic Group Bookings", "Impossible to overbook"]
          }
        }
      }
    },
    company: {
      title: "Ready for <1>Production</1>?",
      description: "dispo.now is open source, but we offer a Commercial License for enterprises who need more.",
      features: [
        "Priority Support & SLA",
        "Audit Logs & SSO",
        "Webhook Events & Alerts",
        "Custom Feature Development"
      ],
      enterprise: {
        title: "Enterprise Edition",
        subtitle: "Self-hosted with batteries included",
        license: "License",
        commercial: "Commercial",
        support: "Support",
        dedicated: "24/7 Dedicated",
        deployment: "Deployment",
        custom: "Custom VPC / On-Prem"
      }
    },
    dashboard: {
      resources: "Resources",
      addResource: "Add Resource",
      bookingConfirmed: "Booking Confirmed",
      liveLogs: "Live Logs",
      created: "Created",
      checkingAvailability: "Checking availability..."
    },
    footer: {
      tagline: "The headless booking engine for modern developers.",
      copyright: "Copyright © {{year}}.",
      product: {
        title: "Product",
        docs: "Documentation",
        api: "API Reference"
      },
      company: {
        title: "Company",
        website: "riv0manana.dev",
        github: "GitHub"
      }
    }
  }
};
