# Upkaar Community Website

## Description

Upkaar is a community-driven website for the Indian diaspora in the tri-state area (Pennsylvania, New Jersey, and New York). The platform aims to connect the community by providing a space for events, a business directory, and classifieds.

## Features

*   **Events:** Find and share community events.
*   **Business Directory:** Discover local businesses owned and operated by members of the community.
*   **Classifieds:** Buy and sell goods and services within the community.
*   **User Authentication:** Secure login and registration using Google OAuth.

## Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS
*   **Backend:** Supabase (PostgreSQL, Authentication, Storage)
*   **Deployment:** Hosted on a standard web server (see `DEPLOYMENT.md` for details).

## Getting Started

### Prerequisites

*   Node.js (v18.x or higher)
*   npm / yarn / pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/upkaar-org/website.git
    cd website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables. See the `.env.example` file for a template.

    ```
    # Google OAuth Configuration
    VITE_GOOGLE_CLIENT_ID=your-google-client-id-here

    # Supabase Configuration
    VITE_SUPABASE_URL=your-supabase-url-here
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
    ```
    *Instructions for obtaining Google Client ID can be found in `.env.example`.*
    *Instructions for setting up Supabase can be found in `SUPABASE_SETUP.md`.*


### Running the application

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`.

## Available Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the codebase for errors.
*   `npm run preview`: Serves the production build locally for preview.
*   `npm run build:production`: Lints the code and builds the application for production.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
