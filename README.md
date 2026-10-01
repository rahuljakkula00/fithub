# FitLock AI — GitHub Pages Website

A beginner-friendly fitness planner prototype for a student portfolio.

## What is included

- Slide-by-slide onboarding instead of one long scrolling profile form
- Name → age → weight → height → goal → diet → activity → monthly budget
- Back/Continue buttons and progress indicator
- Beginner workout plan
- Add, remove-for-today and replace-exercise options
- YouTube exercise-guide search links
- Simple meal ideas for vegetarian, non-vegetarian, vegan and flexible diets
- Hydration target and bottle tracking
- FitPoints and consistency streak
- Local demo AI Guide
- Monthly expense estimate
- Privacy-first local browser storage
- Responsive mobile/desktop design
- No app-lock feature

## New ideas added

### 1. FitPoints
The prototype awards points for healthy consistency:
- Finished bottle: +40
- Exercise set: +20 (shown as the suggested reward)
- Planned reps: +50 (shown as the suggested reward)
- Workout completed: +100 (shown as the suggested reward)
- Balanced meal logged: +30 (shown as the suggested reward)
- 7-day consistency: +200 (shown as the suggested reward)

The current demo directly implements the bottle reward. The other values are displayed as the gamification design and can be connected to actual workout/meal buttons later.

### 2. Beginner-first onboarding
The setup is one question per slide. This makes the first-time experience easier on phones and for beginners.

### 3. Exercise alternatives
A user can remove an exercise for today or ask for another beginner exercise.

### 4. Consistency streak
The dashboard tracks the number of consecutive days on which the site was used.

## Run on your computer

1. Extract the ZIP.
2. Open the extracted folder.
3. Double-click `index.html`.

For the basic prototype, no installation is required.

For a better local development server, if Python is installed:

```bash
python -m http.server 5500
```

Then open:

`http://localhost:5500`

## Upload to GitHub Pages

1. Create a new GitHub repository, for example `fitlock-ai`.
2. Upload:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
   - `.gitignore`
   - `LICENSE`
3. Open repository **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save.
7. GitHub will give you the Pages URL.

## Important: this is a frontend prototype

GitHub Pages is static hosting. It cannot safely hold secret API keys or run a private server.

For a production version:
- Frontend: HTML/CSS/JS or React
- Authentication/database: Firebase or Supabase
- Backend: Node.js/Express, Python/FastAPI, or serverless functions
- AI: connect an approved AI API through the backend
- Exercise form verification: Android CameraX + ML Kit/MediaPipe or a suitable vision service
- Bottle verification: OCR/image checks plus live verification if exact consumption proof is needed
- Notifications: web notifications or Android notifications

Never put a private API key directly inside `app.js`.

## Data storage

This prototype uses browser `localStorage`, so data is stored on the device/browser used for the site. Clearing browser storage can remove it.

A production app should use authentication and a secure database with proper access rules.

## Health and safety

This is general wellness software, not medical advice. The numbers shown are simplified estimates.

For users under 18, avoid calorie restriction or aggressive weight-loss targets. Fitness and nutrition plans should be appropriate for age and discussed with a parent/guardian or qualified professional when needed.

Stop exercise if you feel pain, dizziness, faintness or otherwise unwell.

## Suggested next upgrades

1. Add login/signup.
2. Add a real database.
3. Add a real AI assistant through a backend.
4. Add workout completion buttons that award FitPoints.
5. Add a weekly progress chart.
6. Add badges such as Hydration Hero and Workout Warrior.
7. Add a calendar/history page.
8. Add PWA support so the website can be installed like an app.
9. Add accessibility improvements such as larger text controls and keyboard navigation.
10. Add an Android version for camera-based exercise verification.

## License

MIT
