import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../../lib/utils";

// --- Data ---

const sections = [
  { id: "intro", title: "Introduction" },
  { id: "auth", title: "Authentication" },
  { id: "users", title: "Users" },
  { id: "projects", title: "Projects" },
  { id: "resources", title: "Resources" },
  { id: "availability", title: "Availability" },
  { id: "bookings", title: "Bookings" },
  { id: "errors", title: "Errors" },
];

const content = {
  intro: {
    title: "Introduction",
    body: (
      <>
        <p className="mb-4">
          dispo.now is a <strong>headless booking kernel</strong> designed for developers. 
          It handles the complex logic of availability, capacity, and scheduling so you don't have to.
        </p>
        <p className="mb-4">
          The flow is strictly hierarchical: 
          <code className="bg-zinc-800 px-1 py-0.5 rounded mx-1 text-sm">Project</code> → 
          <code className="bg-zinc-800 px-1 py-0.5 rounded mx-1 text-sm">Resource</code> → 
          <code className="bg-zinc-800 px-1 py-0.5 rounded mx-1 text-sm">Booking</code>.
        </p>
        <p>
          We provide an official Node.js SDK to simplify integration:
          <br/>
          <code className="bg-zinc-800 px-1 py-0.5 rounded text-sm text-emerald-400 mt-2 inline-block">npm install @riv0manana/dispo-now-sdk</code>
        </p>
      </>
    ),
    codes: null
  },
  auth: {
    title: "Authentication",
    body: (
      <>
        <p className="mb-4">
          dispo.now supports two authentication mechanisms:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-2 text-zinc-400">
          <li>
            <strong className="text-white">Bearer Token (JWT)</strong>: Used for management operations (Creating Projects, listing all resources). 
            Obtained via the <code>/api/users/login</code> endpoint.
          </li>
          <li>
            <strong className="text-white">API Key (x-api-key)</strong>: Used for runtime operations (Creating Resources, Bookings). 
            Scoped to a specific Project.
          </li>
        </ul>
        <p>
          For most server-side integrations, you will use the <code>x-api-key</code> header.
        </p>
      </>
    ),
    codes: [
      {
        lang: "bash",
        title: "Curl / Headers",
        content: `// Management (Bearer)
Authorization: Bearer <your_jwt_token>

// Runtime (API Key)
x-api-key: <your_project_api_key>`
      },
      {
        lang: "typescript",
        title: "Node.js SDK",
        content: `import { DispoClient } from '@riv0manana/dispo-now-sdk';

// Initialize with API Key (Runtime)

const dispo = new DispoClient({
  apiKey: 'sk_live_...'
});

// Or with Bearer Token (Management)
const admin = new DispoClient({
  bearerToken: 'ey...'
});`
      }
    ]
  },
  users: {
    title: "Users",
    body: (
      <>
        <p className="mb-4">
          Manage user accounts for accessing the platform.
        </p>
        <h3 className="text-lg font-bold text-white mt-6 mb-2">Create Account</h3>
        <p className="mb-4">Register a new user account.</p>
        
        <h3 className="text-lg font-bold text-white mt-6 mb-2">Login</h3>
        <p className="mb-4">Authenticate to receive a JWT token.</p>
      </>
    ),
    codes: [
      {
        lang: "json",
        title: "JSON Payload",
        content: `// POST /api/users (Register)
{
  "email": "dev@example.com",
  "password": "securepassword"
}

// POST /api/users/login (Login)
{
  "email": "dev@example.com",
  "password": "securepassword"
}

// Response (Login)
{
  "token": "ey..."
}`
      },
      {
        lang: "typescript",
        title: "Node.js SDK",
        content: `// Register
const user = await client.register(
  'dev@example.com', 
  'securepassword'
);

// Login
const { token } = await client.login(
  'dev@example.com', 
  'securepassword'
);`
      }
    ]
  },
  projects: {
    title: "Projects",
    body: (
      <>
        <p className="mb-4">
          Projects are isolated tenants for your bookings. Each project has its own API Key and resources.
        </p>
        <h3 className="text-lg font-bold text-white mt-6 mb-2">Operations</h3>
        <ul className="list-disc pl-5 space-y-2 text-zinc-400">
          <li><strong>POST /api/projects</strong>: Create a new project. Returns API Key.</li>
          <li><strong>GET /api/projects</strong>: List all your projects.</li>
          <li><strong>PATCH /api/projects/:id</strong>: Update project details.</li>
          <li><strong>DELETE /api/projects/:id</strong>: Delete a project.</li>
        </ul>
      </>
    ),
    codes: [
      {
        lang: "json",
        title: "JSON Payload",
        content: `// POST /api/projects
{
  "name": "My SaaS Tenant",
  "metadata": { "plan": "premium" }
}

// Response (201 Created)
{
  "id": "proj_123",
  "name": "My SaaS Tenant",
  "apiKey": "sk_live_..." // Save this!
}`
      },
      {
        lang: "typescript",
        title: "Node.js SDK",
        content: `// Create Project
const project = await admin.createProject(
  'My SaaS Tenant',
  { plan: 'premium' }
);

console.log(project.apiKey); // sk_live_...

// List Projects
const projects = await admin.getProjects();`
      }
    ]
  },
  resources: {
    title: "Resources",
    body: (
      <>
        <p className="mb-4">
          Resources are the bookable assets belonging to a Project.
        </p>
        <h3 className="text-lg font-bold text-white mt-6 mb-2">Operations</h3>
        <ul className="list-disc pl-5 space-y-2 text-zinc-400">
          <li><strong>POST /api/resources</strong>: Create a resource.</li>
          <li><strong>PATCH /api/resources/:id</strong>: Update a resource.</li>
          <li><strong>DELETE /api/resources/:id</strong>: Delete a resource.</li>
        </ul>
      </>
    ),
    codes: [
      {
        lang: "json",
        title: "JSON Payload",
        content: `// POST /api/resources
{
  "name": "Conference Room A",
  "defaultCapacity": 10,
  "metadata": { "floor": 2 },
  "bookingConfig": {
    "daily": { "start": "09:00", "end": "17:00" },
    "weekly": { "availableDays": [1, 2, 3, 4, 5] }
  }
}`
      },
      {
        lang: "typescript",
        title: "Node.js SDK",
        content: `const resource = await dispo.createResource({
  name: 'Conference Room A',
  defaultCapacity: 10,
  metadata: { floor: 2 },
  bookingConfig: {
    daily: { start: '09:00', end: '17:00' },
    weekly: { availableDays: [1, 2, 3, 4, 5] }
  }
});`
      }
    ]
  },
  availability: {
    title: "Availability",
    body: (
      <>
        <p className="mb-4">
          Query the availability of a resource over a specific time range.
        </p>

        <h3 className="text-lg font-bold text-white mt-6 mb-2">Configuration Logic</h3>
        <p className="mb-4">
          Availability is calculated by intersecting the requested time range with the resource's <code>bookingConfig</code>.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-2 text-zinc-400">
          <li>
            <strong className="text-white">Daily Schedule</strong>: Slots must fall within <code>daily.start</code> and <code>daily.end</code> (e.g. "09:00" to "17:00").
          </li>
          <li>
            <strong className="text-white">Weekly Schedule</strong>: Slots must fall on days listed in <code>weekly.availableDays</code> (0=Sun, 1=Mon, etc.).
          </li>
          <li>
            <strong className="text-white">Capacity</strong>: Remaining slots = <code>defaultCapacity</code> - <code>confirmed bookings</code>.
          </li>
        </ul>
        <p className="mb-4 text-amber-400 text-sm border-l-2 border-amber-500 pl-3">
          Note: If a resource has no <code>bookingConfig</code>, it is considered available 24/7.
        </p>

        <h3 className="text-lg font-bold text-white mt-6 mb-2">Get Slots</h3>
        <p className="mb-4">
          Returns a list of time slots with their remaining capacity.
        </p>
      </>
    ),
    codes: [
      {
        lang: "json",
        title: "REST / Curl",
        content: `GET /api/resources/:id/availability
?start=2024-01-01T00:00:00Z
&end=2024-01-01T23:59:59Z
&slotDurationMinutes=60

// Response (200 OK)
[
  {
    "start": "2024-01-01T09:00:00Z",
    "end": "2024-01-01T10:00:00Z",
    "available": 5
  },
  {
    "start": "2024-01-01T10:00:00Z",
    "end": "2024-01-01T11:00:00Z",
    "available": 2 // 5 - 3 = 2
  }
]`
      },
      {
        lang: "typescript",
        title: "Node.js SDK",
        content: `const slots = await dispo.getAvailability(
  'resource_123',
  '2024-01-01T00:00:00Z',
  '2024-01-01T23:59:59Z',
  60 // slot duration in minutes
);`
      }
    ]
  },
  bookings: {
    title: "Bookings",
    body: (
      <>
        <p className="mb-4">
          Bookings reserve a quantity of a Resource for a specific TimeRange.
        </p>
        <h3 className="text-lg font-bold text-white mt-6 mb-2">Create Booking</h3>
        <p className="mb-4">
          Attempt to reserve a slot. Fails if capacity is exceeded or outside operating hours.
          Requires <code>x-api-key</code>.
        </p>
        <p className="mb-4 text-amber-400 text-sm border-l-2 border-amber-500 pl-3">
          Note: Dates must be valid ISO 8601 strings in UTC.
        </p>

        <h3 className="text-lg font-bold text-white mt-8 mb-2">Create Group Booking</h3>
        <p className="mb-4">
          Atomically create multiple bookings in a single transaction. If any booking fails (e.g. capacity exceeded), none are created.
        </p>

        <h3 className="text-lg font-bold text-white mt-8 mb-2">Create Recurring Booking</h3>
        <p className="mb-4">
          Create a series of bookings based on a recurrence pattern (Daily, Weekly, Monthly). 
          Like group bookings, this is atomic: if any slot in the series is unavailable, the entire request fails.
        </p>
      </>
    ),
    codes: [
      {
        lang: "json",
        title: "JSON Payload",
        content: `// POST /api/bookings (Single)
{
  "resourceId": "res_456",
  "start": "2024-01-01T10:00:00Z",
  "end": "2024-01-01T11:00:00Z",
  "quantity": 1,
  "metadata": { "bookedBy": "user@example.com" }
}

// POST /api/bookings/group (Atomic Batch)
{
  "bookings": [
    {
      "resourceId": "res_A",
      ...
    },
    {
      "resourceId": "res_B",
      ...
    }
  ]
}`
      },
      {
        lang: "typescript",
        title: "Node.js SDK",
        content: `// Single Booking
await dispo.createBooking({
  resourceId: 'res_456',
  start: '2024-01-01T10:00:00Z',
  end: '2024-01-01T11:00:00Z',
  quantity: 1,
  metadata: { bookedBy: 'user@example.com' }
});

// Group Booking (Atomic)
await dispo.createGroupBooking({
  projectId: 'proj_123',
  bookings: [
    { resourceId: 'res_A', ... },
    { resourceId: 'res_B', ... }
  ]
});`
      }
    ]
  },
  errors: {
    title: "Errors",
    body: (
      <>
        <p className="mb-4">
          Common error responses you might encounter.
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-red-400">409 Conflict</h4>
            <p className="text-sm text-zinc-400"><code>CapacityExceeded</code> - The resource does not have enough availability for the requested time/quantity.</p>
          </div>
          <div>
            <h4 className="font-bold text-amber-400">400 Bad Request</h4>
            <p className="text-sm text-zinc-400">
              <code>InvalidTimeRange</code> - Start time is after end time, or duration is zero.<br/>
              <code>DayNotAllowed</code> - Booking attempts to start/end on a closed day.<br/>
              <code>StartTimeOutsideConfig</code> - Start time is outside daily operating hours.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-zinc-400">401 Unauthorized</h4>
            <p className="text-sm text-zinc-400">Missing or invalid API Key / Token.</p>
          </div>
        </div>
      </>
    ),
    codes: [
      {
        lang: "json",
        title: "Error Response",
        content: `{
  "error": "CapacityExceeded"
}`
      }
    ]
  }
};

function CodeBlock({ codes }: { codes: { lang: string, title: string, content: string }[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  
  const activeCode = codes[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden bg-[#1e1e1e] border border-zinc-800 shadow-2xl">
      <div className="flex items-center bg-[#252526] border-b border-zinc-800">
        {codes.map((code, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setActiveTab(index)}
            className={cn(
              "px-4 py-2 text-xs font-mono border-r border-zinc-800 transition-colors",
              activeTab === index 
                ? "bg-[#1e1e1e] text-emerald-400 border-b-2 border-b-emerald-400 -mb-px" 
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
            )}
          >
            {code.title}
          </button>
        ))}
        <div className="flex-1"></div>
        <button onClick={handleCopy} className="p-2 text-zinc-500 hover:text-white transition-colors">
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto min-h-[150px]">
        <pre className="font-mono text-sm leading-relaxed text-zinc-300">
          <code className="table w-full">
            {activeCode.content.split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell text-zinc-700 select-none pr-4 text-right w-8 align-top">{i + 1}</span>
                <span className="table-cell align-top">
                  <span dangerouslySetInnerHTML={{__html: (line || ' ')
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/\b(import|from|const|await|new|return|export|default|function|class)\b/g, '<span class="text-purple-400">$1</span>')
                  }} />
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

export function DocsRoute() {
  const [activeSection, setActiveSection] = useState("intro");

  // Simple scroll spy effect (mocked for now)
  useEffect(() => {
    const handleScroll = () => {
      // Logic to determine active section based on scroll position
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-zinc-300 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-zinc-800 flex items-center px-6 z-50">
        <Link to="/" className="font-mono font-bold text-lg text-white tracking-tight mr-8">
          dispo.now
        </Link>
        <div className="h-6 w-px bg-zinc-800 mx-4"></div>
        <span className="text-sm font-medium text-zinc-400">Documentation</span>
        <div className="ml-auto flex items-center gap-4">
            <Link to="/dashboard" className="text-sm text-white hover:text-emerald-400 transition-colors">
                Dashboard
            </Link>
        </div>
      </header>

      <div className="flex pt-16 max-w-[1440px] mx-auto">
        {/* Sidebar */}
        <nav className="w-64 fixed top-16 bottom-0 left-0 overflow-y-auto border-r border-zinc-800 bg-[#0F0F0F] hidden lg:block">
          <div className="p-6 space-y-1">
            {sections.map((section) => (
              <a 
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  activeSection === section.id 
                    ? "bg-zinc-900 text-emerald-400" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                )}
              >
                {section.title}
              </a>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 lg:pl-64">
          <div className="max-w-5xl mx-auto">
            {sections.map((section) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const data = (content as any)[section.id];
              if (!data) return null;

              return (
                <section key={section.id} id={section.id} className="grid lg:grid-cols-2 border-b border-zinc-800 min-h-[50vh]">
                  {/* Left: Prose */}
                  <div className="p-16 pr-12">
                    <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">{data.title}</h2>
                    <div className="text-lg leading-relaxed text-zinc-400">
                      {data.body}
                    </div>
                  </div>

                  {/* Right: Code */}
                  <div className="py-16 px-8 bg-[#09090b] border-l border-zinc-800/50">
                    {data.codes && (
                      <div className="sticky top-24">
                        <CodeBlock codes={data.codes} />
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
            
            {/* Footer */}
            <div className="p-16 text-center text-zinc-500 text-sm">
                Built with <span className="text-emerald-500">♥</span> for Developers.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
