# [**dispo.now**](https://dispo-now.riv0manana.dev)
### The Self-Hosted Booking Infrastructure

![License](https://img.shields.io/badge/license-AGPL--v3-blue.svg)
![Status](https://img.shields.io/badge/status-stable-green.svg)
![Stack](https://img.shields.io/badge/stack-Deno_Hono_Postgres-green.svg)
![AI Ready](https://img.shields.io/badge/AI-Native_MCP-purple.svg)

**The Postgres of Booking Engines.**

[**dispo.now**](https://dispo-now.riv0manana.dev) is a self-hosted, high-performance booking infrastructure. It is not a SaaS API. It is a Docker container that you run in your own cloud.

Whether you are building a healthcare platform, a car rental service, or an **AI Agent**, `dispo.now` provides the **ACID guarantees** for time allocation that your database lacks.

---

## 🚀 Why dispo.now?

You have two choices today: **Build it yourself** (and deal with race conditions) or **pay a SaaS API** (and deal with per-request pricing and data leaks).

`dispo.now` is the third option: **Own the Infrastructure.**

### 1. Data Sovereignty
SaaS APIs like Timekit or Hapio require you to send your customer data to their cloud. For Healthcare and FinTech, this is a dealbreaker.
*   **dispo.now** runs in *your* VPC.
*   Your data never leaves your infrastructure.
*   Zero third-party leaks.

### 2. Cost Predictability
SaaS APIs charge per request. If your app succeeds, your bill explodes.
*   **dispo.now** is free and open-source (AGPLv3).
*   Scale to millions of bookings for $0 extra.
*   Pay for the server, not the API calls.

### 3. Atomic Correctness
Building booking logic is easy. Building *concurrency-safe* booking logic is hard.
*   **dispo.now** isn't just a calendar; it's an **ACID transaction engine for time**.
*   We use strict Postgres transactions to guarantee that multi-resource bookings (e.g., Doctor + Room) either fully succeed or fully fail.

### 4. AI Native (MCP)
The future is agentic. `dispo.now` implements the **Model Context Protocol (MCP)** out of the box.
*   Connect Claude, Cursor, or custom Agents directly to your booking engine.
*   Agents can "discover" resources and make bookings without hallucinations.
*   Zero-config integration: Just set `MCP_SERVER="enabled"`.

### Comparison

| Feature | SaaS APIs (Timekit, Hapio) | In-House Build | **dispo.now** |
| :--- | :--- | :--- | :--- |
| **Setup Time** | Instant | Months | **Minutes (Docker)** |
| **Cost** | High ($/Request) | Dev Salaries | **Free / License** |
| **Data Privacy** | Low (Shared Cloud) | High | **High (Self-Hosted)** |
| **Race Conditions** | Handled | Likely | **Guaranteed Solved** |
| **Customization** | Low (API Limits) | High | **High (Open Core)** |

---

## 💡 Use Cases

Our engine adapts to your domain model:

1.  **Healthcare**: Atomic booking of `Doctor` + `Treatment Room`.
2.  **Hospitality**: Hotel room management with daily/weekly availability rules.
3.  **Fleet Management**: Car rentals with strict 1-unit capacity.
4.  **Education**: Webinars and classes with high capacity (e.g., 50 seats).
5.  **Infrastructure**: Scheduling GPU instances or physical server maintenance.

---

## ☁️ Deployment

### One-Click Deploy
We provide optimized templates for popular self-hosted PaaS solutions.

#### Coolify
Use our [Coolify Compose File](./docker-compose.coolify.yml).
1. Create a new Service in Coolify.
2. Select "Docker Compose".
3. Copy/Paste the content of `docker-compose.coolify.yml`.
4. Deploy!

#### Dokploy
Use our standard [Dokploy Compose File](./docker-compose.dokploy.yml).
1. Ensure you have a `dokploy-network` (or remove the network config).
2. Create a new Application.
3. Select "Docker Compose".
4. Deploy!

#### Manual Docker
```bash
docker compose -f docker-compose.coolify.yml up -d
```

---

## 📚 Documentation

*   [**Main Concepts**](./MAIN.md): Understand the core philosophy and guarantees.
*   [**API Reference**](./API.md): Detailed endpoint documentation.
*   [**Developer Experience**](./DX.md): Integration guides and best practices.

### 📦 SDKs

*   **Node.js**: [`@riv0manana/dispo-now-sdk`](https://www.npmjs.com/package/@riv0manana/dispo-now-sdk)


---

## 📄 License & Commercial Use

**dispo.now** is open-source software licensed under the **GNU Affero General Public License v3.0 (AGPLv3)**.

*   **Open Source (AGPLv3)**: Free to use, modify, and distribute. However, if you modify the code and provide it as a network service (SaaS), you **must** open-source your modifications to the community.
*   **Commercial License**: Want to use `dispo.now` in your proprietary SaaS without open-sourcing your code? Or need enterprise features (SSO, Audit Logs, SLA)? [Contact us](mailto:contact@riv0manana.dev) for a Commercial License.

### Contributor License Agreement (CLA)
To ensure we can continue to offer dual-licensing options, all contributors must sign a Contributor License Agreement (CLA) granting us the right to license their contributions under the Commercial License.

---

## 🤝 Sponsorship & Contribution

[**dispo.now**](https://dispo-now.riv0manana.dev) is an open-source project born from the need for a robust, generic booking primitive.

### Support the Project
Building and maintaining a concurrency-safe engine takes time and coffee. If `dispo.now` saves you weeks of development time, consider supporting us!
I'd love to be fully self-sustained, so any sponsorship would be greatly appreciated.

*   [**Github Sponsor**](https://github.com/sponsors/riv0manana)
*   [**Buy Me a Coffee**](https://buymeacoffee.com/riv0manana)

### Contributing
We welcome contributions! Whether it's fixing a bug, adding a new database adapter, or improving documentation.

1.  Fork the repository.
2.  Create your feature branch.
3.  Submit a Pull Request.

---

*Built with ❤️ for builders.*
