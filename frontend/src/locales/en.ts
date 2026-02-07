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
    features: {
      header: {
        title: "Built for <1>CTOs</1> who scale, and <3>Devs</3> who ship.",
        subtitle: "Stop reinventing scheduling logic. dispo.now provides the primitives you need to build complex booking flows without the headache."
      },
      cards: {
        resource: {
          title: "Resource Agnostic",
          subtitle: "Flexible by Design.",
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
          subtitle: "Flexible by Design.",
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
