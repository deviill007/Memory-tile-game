A fun and interactive memory-matching game with authentication, leaderboards, and level-based challenges! Built with Next.js, MobX, PostgreSQL, and Sequelize.

Features
• User Authentication (Login/Signup with cookies)
• Multiple Levels (Easy, Medium, Hard)
• Leaderboard (Sorted by best time, paginated)
• User Score Tracking (View all your past scores)


Tech Stack
• Frontend: Next.js, MobX, CSS
• Backend: Node.js, Express.js, PostgreSQL, Sequelize
• Authentication: HTTP Cookies

Installation & Setup
• Clone the Repository
    git clone https://github.com/deviill007/Memory-tile-game.git
    cd memory-tile-game
(1) Backend Setup
    npm install
    Create a .env File with the following:
    PORT=5000
    DATABASE_URL=postgres://your-username:your-password@localhost:5432/memory_tile_game
    JWT_SECRET=your_secret_key
• Run Database Migrations
    npx sequelize-cli db:migrate
• Start the Backend Server
    npm start
• Your backend will run on http://localhost:5000.

(2) Frontend Setup
    cd ../client
    npm install
• Start the Frontend
    npm run dev
• Your frontend will be available at http://localhost:3000.


Usage
• Register/Login
• Select a Level & Play the Game
• View Scores & Leaderboards


API Endpoints
Method	    Endpoint	                Description
POST	    /api/signup	                Register a new user
POST	    /api/login	                Login a user
POST	    /api/logout	                Logout user
GET	        /api/auth/check-auth	    Check if user is logged in
POST	    /api/score	                Submit a game score
GET	        /api/leaderboard	        Get leaderboard data