# Student Progress Management System

A comprehensive system for tracking and managing student progress on Codeforces, featuring real-time data synchronization, progress visualization, and automated engagement features.

## Features

### Student Table View

- Complete student listing with key information:
  - Name
  - Email
  - Phone Number
  - Codeforces Handle
  - Current Rating
  - Max Rating
- CRUD operations for student management
- CSV export functionality
- Quick access to detailed student profiles

### Student Profile View

#### Contest History

- Filterable contest data (30/90/365 days)
- Interactive rating graph
- Detailed contest performance metrics:
  - Rating changes
  - Contest ranks
  - Unsolved problems tracking

#### Problem Solving Analytics

- Time-based filtering (7/30/90 days)
- Key metrics:
  - Most difficult problem solved
  - Total problems solved
  - Average rating
  - Daily problem-solving rate
- Visual analytics:
  - Rating bucket distribution chart
  - Submission heat map

### Codeforces Data Sync

- Automated daily data synchronization
- Configurable sync schedule
- Real-time updates on handle changes
- Last update timestamp display

### Inactivity Detection

- 7-day inactivity monitoring
- Automated email reminders
- Reminder history tracking
- Per-student reminder toggle

### UI/UX Features

- Responsive design for mobile and tablet
- Light/dark mode support
- Intuitive navigation
- Clean, modern interface

## Technical Stack

- Frontend:

  - React
  - TypeScript
  - Tailwind CSS
  - shadcn-ui
  - Chart.js/D3.js for visualizations

- Backend:

  - Node.js
  - Express
  - MongoDB/PostgreSQL
  - Redis for caching

- DevOps:
  - Docker
  - GitHub Actions
  - Automated testing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB/PostgreSQL
- Redis (optional, for caching)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd student-progress-management

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

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
