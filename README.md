# CodeTrackerPro

CodeTrackerPro is a comprehensive web application designed to help programming mentors and students track their progress on competitive programming platforms like Codeforces. It provides detailed analytics, visualizations, and management tools to monitor performance, identify areas for improvement, and stay motivated.

## ✨ Features

- **Student Dashboard**: A centralized view of all students with key metrics like current rating, last activity, and status.
- **Secure Authentication**: User sign-up and sign-in functionality powered by Supabase Auth.
- **Student Management**: Easily add, edit, and manage students in the dashboard.
- **Detailed Student Profiles**: A modal view for each student, featuring:
  - **Codeforces-Style Rating Graph**: A beautiful, interactive rating chart that visualizes contest performance over time, complete with accurate rating bands.
  - **Filterable Contest History**: View a student's contest history in a responsive, card-based layout. Filter contests by the last 30, 90, or 365 days.
  - **Problem Statistics**: In-depth analysis of solved problems, including a submission heatmap, solved counts by rating, and tag-based skill analysis.
- **Dark Mode**: A sleek, eye-friendly dark theme for comfortable viewing.
- **Responsive Design**: A fully responsive interface built with Tailwind CSS and shadcn/ui that works seamlessly on all devices.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Backend & Database**: Supabase (Auth, Postgres, Edge Functions)
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
      ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at `http://localhost:5173`.

## Supabase Backend

This project relies on Supabase for its backend services. You will need to set up the following:

- **Database Tables**: The application expects certain tables for students, contests, and problems. You can find the required schemas in the `supabase/migrations` directory.
- **Authentication**: The email-based magic link authentication should work out-of-the-box, but you may need to configure the Site URL in your Supabase project settings for production deployment.
- **Edge Functions**: The `supabase/functions` directory contains serverless functions for tasks like scheduled data syncs.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or open an issue in the repository.
