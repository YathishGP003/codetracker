# CodeTrackerPro

CodeTrackerPro is a comprehensive web application designed for programming mentors and students to track and analyze progress on competitive programming platforms, primarily Codeforces. It offers advanced analytics, visualizations, automation, and management tools to monitor performance, identify areas for improvement, and keep students engaged.

## ✨ Features

- **Student Dashboard**: Centralized view of all students with metrics like current rating, last activity, and status.
- **Secure Authentication**: User sign-up and sign-in powered by Supabase Auth.
- **Student Management**: Add, edit, and manage students, including Codeforces handle integration.
- **Detailed Student Profiles**:
  - **Codeforces-Style Rating Graph**: Interactive rating chart visualizing contest performance over time, with rating bands.
  - **Filterable Contest History**: View and filter a student's contest history by time period.
  - **Problem Statistics**: Submission heatmap, solved counts by rating, tag-based skill analysis, and language breakdown.
- **Automated Data Sync**:
  - **Scheduled Sync**: Automatic daily/weekly/hourly sync of Codeforces data for all students, configurable via UI.
  - **Real-Time Sync**: On-demand or interval-based sync for up-to-date student progress.
- **Automated Reminders**:
  - **Inactivity Detection**: Identify inactive students based on last submission.
  - **Smart Email Reminders**: Send automated or manual reminder emails to inactive students (requires email service integration).
  - **Notification Preferences**: Toggle email notifications per student.
- **Contest Calendar**:
  - **Upcoming Contests**: Aggregates contests from multiple platforms (Codeforces, LeetCode, CodeChef, etc.) using public APIs.
  - **Training Plan Scheduler**: Create and assign practice plans based on past contests.
- **CP Sheet**: Track progress on curated problem sets by rating.
- **Dark Mode**: Eye-friendly dark theme.
- **Responsive Design**: Works seamlessly on all devices (Tailwind CSS, shadcn/ui).

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts, Chart.js
- **Calendar**: FullCalendar
- **Backend & Database**: Supabase (Auth, Postgres, Edge Functions)
- **Automation**: Supabase Edge Functions for scheduled sync, reminders, and cron job management
- **Integrations**:
  - **Codeforces API**: Fetches contest and problem data
  - **CompeteAPI**: Fetches upcoming contests from multiple platforms
  - **(Optional) Email Service**: For sending reminders (e.g., Resend, SendGrid)
- **Linting/Formatting**: ESLint, Prettier

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or bun
- A Supabase account

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/codetrackerpro.git
    cd codetrackerpro
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    bun install
    ```

3.  **Set up environment variables:**

    - Create a new project on [Supabase](https://supabase.com/).
    - Inside your project, navigate to **Project Settings** > **API**.
    - Create a file named `.env` in the root of your project by copying the example file:
      ```bash
      cp .env.example .env
      ```
    - Find your **Project URL** and **anon public key** in your Supabase project's API settings.
    - Update the `.env` file with your credentials:
      ```
      VITE_SUPABASE_URL=YOUR_SUPABASE_URL
      VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
      VITE_SITE_URL=http://localhost:5173
      ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at `http://localhost:5173`.

## Supabase Backend & Automation

This project relies on Supabase for backend services and automation. You will need to set up the following:

- **Database Tables**: The application expects tables for students, contests, problems, sync logs, and app settings. Schemas are in `supabase/migrations`.
- **Authentication**: Email-based magic link authentication (configure Site URL in Supabase for production).
- **Edge Functions**:
  - `sync-codeforces-data`: Fetches and updates student contest/problem data from Codeforces.
  - `scheduled-sync`: Triggers periodic data syncs based on cron settings.
  - `send-reminders`: Sends inactivity reminder emails (requires email service integration).
  - `setup-cron-job`: Manages cron job scheduling for automated syncs.
- **Automation**:
  - **Scheduled Sync**: Uses cron settings stored in the database to trigger syncs automatically.
  - **Real-Time Sync**: Can be started/stopped and interval set from the dashboard.
  - **Reminders**: Detects inactive students and sends reminders (manual or automated).

## Integrations

- **Codeforces API**: For contest and problem data.
- **CompeteAPI**: For upcoming contest aggregation.
- **(Optional) Email Service**: For sending reminders (e.g., Resend, SendGrid). You must configure your own API key and integration in the reminder function.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email codetrackerpro-support@example.com or open an issue in the repository.
