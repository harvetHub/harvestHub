## 🌾 HarvestHub
HarvestHub is a Next.js 15 application bootstrapped with create-next-app. It serves as an integrated online agricultural marketplace, providing a platform for farmers and buyers with Department of Agriculture as an overseeing body. The app leverages Supabase for backend services, including authentication, database management, and API functionalities. 

## 🚀 Features
⚡ Built with Next.js App Router for modern routing and server components.

🎨 Uses next/font with Geist for optimized typography.

🔐 Integrated with Supabase for authentication, database, and API services.

📦 PNPM for fast, disk-efficient package management.

🌍 Ready for deployment on Vercel.

## 🛠️ Getting Started
1. Clone the repository
```bash
git clone https://github.com/HarvestHubIloilo/harvestHub.git
```
cd <your-repo>
2. Install dependencies
```bash
pnpm install
```
3. Set up environment variables
Create a .env.local file in the root directory and add the following:

env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret
MAILER_AUTOCONFIRM=true
⚠️ Never commit .env.local to version control.

4. Run the development server
bash
pnpm run dev
Open http://localhost:3000 to view the app. The page auto-updates as you edit files (e.g., app/page.tsx).

## 📦 Build for Production
```bash
pnpm run build
pnpm start
```
This runs next build to generate an optimized production build and serves it with next start.

## 🌐 Deployment
The easiest way to deploy is via Vercel, the creators of Next.js:

Push your code to GitHub.

Import the repo into Vercel.

Add your environment variables in the Vercel dashboard.

Deploy 🚀

For more details, see the Next.js deployment docs.

## 📚 Learn More
Next.js Documentation – features, API, and guides.

Learn Next.js – interactive tutorial.

Supabase Docs – database, auth, and storage.


## 📄 License
This project is licensed under the MIT License. See the LICENSE file for details.