# Celestial Chronicles

![Celestial Chronicles Banner](https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

Welcome to **Celestial Chronicles**, an interactive web application designed for space enthusiasts to explore the history of cosmic exploration, track celestial events, and engage with the universe in a personalized and gamified way.

---

## 🚀 Website Functionality and Unique Features

Celestial Chronicles offers a rich, multi-faceted experience that combines historical data with interactive elements to make space exploration accessible and fun.

### Key Features:

* **On This Day in Space**: The homepage presents users with significant space events that occurred on the current date throughout history, providing a daily dose of cosmic knowledge.
* **Interactive Event Calendar**: A full calendar view allows users to select any day of the year to discover historical space events, complete with event details and imagery.
* **3D Solar System Visualization**: Explore a real-time, interactive 3D model of our solar system, powered by NASA's official "Eyes on the Solar System" application.
* **Personalized Cosmic Timeline**: By entering their birthdate, users can generate a unique timeline that showcases all the major space events that have happened in their lifetime, creating a personal connection to the history of space exploration.
* **FutureSight™ Upcoming Events**: Look ahead with a curated list of upcoming celestial events, such as meteor showers, eclipses, and rocket launches, personalized to the user's location.
* **Explore Hub - Games & Quizzes**:
    * **Categorized Space Quiz**: Test your knowledge with a multiple-choice quiz featuring categories like "Planets & Moons," "Space History," and "Cosmology."
    * **Asteroid Smasher Game**: Take control of a spaceship in a fun, retro-style arcade game. Features include a lives system, power-ups, and progressive difficulty.
    * **Cosmic Facts**: Discover interesting, bite-sized facts about space every time you visit the Explore hub.
* **Gamification & Progress System**:
    * Earn points for interacting with different parts of the application.
    * Unlock a wide variety of badges for completing collections, viewing events, and reaching milestones.
    * Track your progress on a dedicated Achievements dashboard.

---

## 🛠️ Installation and Setup Instructions

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
* **npm**
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/your-username/celestial-chronicles.git](https://github.com/your-username/celestial-chronicles.git)
    ```
2.  **Navigate to the project directory**
    ```sh
    cd celestial-chronicles
    ```
3.  **Install NPM packages**
    ```sh
    npm install
    ```
4.  **Install specific `three.js` version**
    *This project requires a specific version of `three.js` to ensure compatibility with its 3D components.*
    ```sh
    npm install three@0.152.2
    ```

### Configuration

**IMPORTANT**: This application uses NASA's public APIs to fetch space-related data. You must provide your own free API key.

1.  **Get a NASA API Key**: Go to [https://api.nasa.gov/](https://api.nasa.gov/), enter your information, and get your free API key.
2.  **Add the API Key to the project**: Open the file at `src/services/nasaApi.ts` and replace the placeholder `'YOUR_NASA_API_KEY_HERE'` with the key you just generated.

    ```typescript
    // src/services/nasaApi.ts
    const NASA_API_KEY = 'YOUR_NASA_API_KEY_HERE'; 
    // ... rest of the file
    ```

### Running the Application

1.  **Run the development server**
    ```sh
    npm run dev
    ```
2.  Open [http://localhost:5173](http://localhost:5173) (or the address shown in your terminal) to view the application in your browser.

---

## 📦 Dependencies

This project is built with a modern tech stack, leveraging the power of the following key libraries and frameworks:

* **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
* **[Vite](https://vitejs.dev/)**: A next-generation front-end tooling that provides a faster and leaner development experience.
* **[TypeScript](https://www.typescriptlang.org/)**: A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
* **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapidly building custom designs.
* **[Framer Motion](https://www.framer.com/motion/)**: A production-ready motion library for React to create fluid animations.
* **[Lucide React](https://lucide.dev/)**: A beautiful and consistent icon toolkit.
* **[date-fns](https://date-fns.org/)**: A modern JavaScript date utility library for formatting and manipulating dates.
* **[three.js](https://threejs.org/)**: A cross-browser JavaScript library and API used to create and display animated 3D computer graphics in a web browser.

