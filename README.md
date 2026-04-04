# 🚨 Operation Keep Safe (OKS!)

<p>
  <strong>Enhancing Crisis Management and Emergency Response for De La Salle Lipa</strong>
</p>

**Live Demo:** [oks-web.vercel.app](https://oks-web.vercel.app)

## 📋 Overview
Operation Keep Safe (OKS!) is a centralized platform designed to streamline emergency responses, coordinate office communications, and ensure the safety of students and faculty during crisis situations on campus. 

The platform utilizes a strict **Role-Based Access Control (RBAC)** system to serve three distinct user types:
1. **Stakeholders (Students/Teachers):** Can view active crises, read official announcements, answer safety surveys, and send SOS Help Requests.
2. **Offices (ISESSO, CIO, ICTC):** Act as the Command Center. They can create crisis alerts, broadcast announcements, manage incoming help requests, and track safety surveys.
3. **System Admins:** Have top-level oversight to manage user accounts, register new office staff, and monitor system health.

## ✨ Features

- **🔒 Secure Role-Based Authentication:** Distinct portals and dashboards for Admins, Offices, and Stakeholders powered by Supabase Auth and secure cookies.
- **🚨 Active Crisis Tracking:** Real-time banners and maps displaying ongoing campus emergencies.
- **🆘 SOS & Help Requests:** Stakeholders can submit geo-tagged requests for medical, supply, or rescue assistance.
- **📢 Broadcast Announcements:** Offices can push high-priority updates directly to stakeholder feeds.
- **📋 Safety Surveys:** Dynamic forms to quickly assess the status and safety of the community post-incident.
- **📱 Responsive UI:** Mobile-first design for stakeholders (who are likely on their phones during an emergency) and desktop-optimized data tables for the Office Command Center.

## 🛠 Tech Stack

**Frontend**
- [Next.js 14+](https://nextjs.org/) (App Router & Server Actions)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (Styling)
- [shadcn/ui](https://ui.shadcn.com/) (Component Library)
- [Lucide React](https://lucide.dev/) (Icons)

**Backend & Infrastructure**
- [Supabase](https://supabase.com/) (PostgreSQL Database, Authentication, Row Level Security)
- [Vercel](https://vercel.com/) (Hosting & CI/CD)

## 📂 Project Structure

The Next.js App Router is organized by role to ensure strict separation of concerns and prevent UI conflicts:

```text
app/
├── (auth)/                  # Public login/signup pages for all roles
├── (protected)/
│   ├── office/              # Command Center UI (Sidebar layout, data tables)
│   └── stakeholder/         # Student/Faculty UI (Mobile-friendly, bottom nav)
├── portal/                  # Restricted Admin Dashboard (System oversight)
├── actions/                 # Next.js Server Actions (Database writes/mutations)
├── api/                     # Route handlers
└── ...
````

*Note: Shared UI elements (like buttons and forms) are kept in the root `components/` directory.*

## 💻 Local Development

### Prerequisites

  - Node.js 18+
  - npm, yarn, or pnpm
  - A Supabase Project (for your database and auth)

### Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/luisantonioj/oks.git](https://github.com/luisantonioj/oks.git)
    cd oks
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
    SUPABASE_SERVICE_ROLE_KEY=
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

## 🗄️ Database Schema Summary

The PostgreSQL database is fully normalized to handle polymorphic users:

  - `admin`, `office`, `stakeholder`: Extended user profile tables linked to `auth.users`.
  - `crisis`: Core table tracking emergency events.
  - `help_request`: Linked to a specific stakeholder and crisis.
  - `announcement`: Official broadcasts linked to an office and crisis.
  - `survey` & `survey_response`: For safety checks.
