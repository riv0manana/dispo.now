# dispo.now
### The Headless Booking engine for your product

![License](https://img.shields.io/badge/license-AGPL--v3-blue.svg)
![Status](https://img.shields.io/badge/status-beta-orange.svg)
![Stack](https://img.shields.io/badge/stack-Deno_Hono_Postgres-green.svg)

**Stop rebuilding booking logic. Start shipping your product.**

`dispo.now` is a self-hosted, high-performance booking engine designed to be the invisible backbone of your application. Whether you are booking doctors, parking spots, server clusters, or hotel rooms, `dispo.now` handles the complex logic of availability, capacity, and concurrency so you can focus on your User Experience.

---

## 🚀 Why dispo.now?

Most booking systems are built for **meetings** (Calendly, Cal.com). They are great if you want to schedule a call, but they struggle when you need to model complex real-world resources.

`dispo.now` is different. It is **Resource Agnostic**. It doesn't know what a "meeting" is. It only knows that *Resource X* has *Capacity Y* at *Time Z*.

### ⚡ For Developers
*   **Headless Architecture**: We provide the API. You build the UI. No fighting with iframe styles.
*   **Atomic Transactions**: Need to book a Doctor AND a Room at the same time? We handle the atomicity. If one fails, both fail.
*   **Developer Experience**: Typed API, OpenAPI specs, and a simple hierarchical model (Project -> Resource -> Booking).

### 🏢 For Companies
*   **100% Data Ownership**: Self-hosted. Your customer data never leaves your infrastructure.
*   **White-Label Ready**: Since it's headless, your customers never see our brand. It looks and feels exactly like your product.
*   **Multi-Tenant by Design**: Built to power SaaS platforms. Isolate your customers (tenants) with strict project-level boundaries.

---

## 🆚 Comparison

| Feature | **dispo.now** | Cal.com / Calendly | Custom Build |
| :--- | :--- | :--- | :--- |
| **Primary Focus** | **Generic Resources** (Assets, Rooms, API Usage, Time) | **Meetings** (People & Calendars) | Anything |
| **User Interface** | **Headless** (100% Customizable) | Pre-built (Rigid) | You build it |
| **Logic** | **Capacity & Concurrency** | Scheduling & Availability | You write it (Hard) |
| **Deployment** | **Self-Hosted / Docker** | SaaS / Open Core | Self-Hosted |
| **Multi-Tenant** | **Native** (Projects) | Enterprise / Teams | You build it |
| **Speed to Market** | ⚡ **Fast** | ⚡ Fast (for meetings) | 🐢 Slow |

**Choose dispo.now if:**
*   You are building a marketplace (e.g., "Airbnb for X").
*   You need to manage physical inventory (rentals, equipment).
*   You are building a vertical SaaS (e.g., for Salons, Gyms, Clinics).
*   You need complex transaction rules (Group Bookings).

**Choose Cal.com if:**
*   You just need a link to schedule Zoom calls.
*   You want a ready-made UI that you don't have to code.

---

## 💡 Use Cases

Our engine adapts to your domain model:

1.  **Healthcare**: Atomic booking of `Doctor` + `Treatment Room`.
2.  **Hospitality**: Hotel room management with daily/weekly availability rules.
3.  **Fleet Management**: Car rentals with strict 1-unit capacity.
4.  **Education**: Webinars and classes with high capacity (e.g., 50 seats).
5.  **Infrastructure**: Scheduling GPU instances or physical server maintenance.

---

## 📚 Documentation

*   [**Main Concepts**](./MAIN.md): Understand the core philosophy and guarantees.
*   [**API Reference**](./API.md): Detailed endpoint documentation.
*   [**Developer Experience**](./DX.md): Integration guides and best practices.

---

## 📄 License & Commercial Use

**dispo.now** is open-source software licensed under the **GNU Affero General Public License v3.0 (AGPLv3)**.

*   **Open Source (AGPLv3)**: Free to use, modify, and distribute. However, if you modify the code and provide it as a network service (SaaS), you **must** open-source your modifications to the community.
*   **Commercial License**: Want to use `dispo.now` in your proprietary SaaS without open-sourcing your code? Or need enterprise features (SSO, Audit Logs, SLA)? [Contact us](mailto:contact@riv0manana.dev) for a Commercial License.

### Contributor License Agreement (CLA)
To ensure we can continue to offer dual-licensing options, all contributors must sign a Contributor License Agreement (CLA) granting us the right to license their contributions under the Commercial License.

---

## 🤝 Sponsorship & Contribution

`dispo.now` is an open-source project born from the need for a robust, generic booking primitive.

### Support the Project
Building and maintaining a concurrency-safe engine takes time and coffee. If `dispo.now` saves you weeks of development time, consider supporting us!
I'd love to be fully self-sustained, so any sponsorship would be greatly appreciated.

*   **GitHub Sponsors**: [Become a Sponsor](https://github.com/sponsors/riv0manana)
*   **BTC**: 1MandaXbY4FqSaKxHnWuakmCC8JpBZAoAG
*   **ETH**: 0xe592DDAF3e69BC213eA62cA698C68D449bbBe4D9
*   ****

### Contributing
We welcome contributions! Whether it's fixing a bug, adding a new database adapter, or improving documentation.

1.  Fork the repository.
2.  Create your feature branch.
3.  Submit a Pull Request.

---

*Built with ❤️ for builders.*
