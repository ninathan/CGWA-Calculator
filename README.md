# CGWA Calculator for NU Students 

A modern, open-source **Cumulative General Weighted Average (CGWA)** calculator designed specifically for National University (NU) students. Track your academic performance, calculate your CGWA with precision, and discover your academic honor eligibility.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15+-black)
![React](https://img.shields.io/badge/React-18+-61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)

##  Features

###  Core Functionality
- **Dynamic Year/Term Management**: Add up to 3 terms per year with unlimited years
- **Real-time CGWA Calculation**: Instant computation using the formula: `CGWA = ∑(GWA × units) / Total Units`
- **Academic Honor Detection**: Automatic classification into 4 honor tiers:
  - **Summa Cum Laude** - 3.75 and higher
  - **Magna Cum Laude** - 3.50 to 3.74
  - **Cum Laude** - 3.25 to 3.49
  - **No Academic Honor** - Below 3.25
- **Computation Breakdown**: View detailed calculations for each term

###  Design & UX
- **Brutalist UI Design**: Bold borders, chunky shadows, and striking aesthetics
- **Dark/Light Mode Toggle**: Seamless theme switching with animated sun/moon toggle
- **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **Modern Animations**: Smooth fade-ins, slide-ups, and floating blob effects
- **Interactive Elements**: Hover tooltips, animated buttons, and visual feedback

###  Data Persistence
- **Warning Dismissal**: localStorage-based persistence for disclaimer modal
- **Theme Preference**: Remembers your dark/light mode choice across sessions

###  User Experience
- **Input Validation**: Min/max constraints for GWA (1-5) and units
- **Intuitive Controls**: Easy add/remove buttons with confirmation
- **Accessibility**: Clean structure with semantic HTML and ARIA-friendly design

##  Tech Stack

### Framework & Libraries
- **[Next.js 15+](https://nextjs.org/)** - React framework with App Router
- **[React 18+](https://react.dev/)** - UI library with hooks (useState, useEffect)
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework

### Styling & Animation
- **Custom CSS Animations** - Keyframe animations for blobs, fades, and slides
- **Geist Fonts** - Modern font family from Vercel
- **Gradient Backgrounds** - Dynamic color schemes for light/dark modes

### Tools & Development
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization

##  Installation

### Prerequisites
- **Node.js** 18+ (recommended: 20+)
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Clone the Repository
```bash
git clone https://github.com/ninathan/CGWA-Calculator.git
cd cgwa-calculator
```

### Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Run Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production
```bash
npm run build
npm run start
```

##  Usage

### Adding Academic Data
1. **Add Years**: Click "ADD ANOTHER YEAR" to create new academic years
2. **Add Terms**: Use "ADD TERM" within each year (maximum 3 terms per year)
3. **Input Data**: Enter your GWA (1.0-5.0) and Units for each term
4. **View CGWA**: Your cumulative GWA updates automatically

### Viewing Academic Honor
- Click "SEE CURRENT ACADEMIC HONOR" button in the CGWA card
- View your honor classification based on current CGWA
- Color-coded badges indicate your achievement level

### Computation Breakdown
- Click the **?** button next to "Your CGWA"
- View term-by-term calculations
- See the complete formula breakdown

### Theme Switching
- Use the animated sun/moon toggle in the header
- Theme preference is saved automatically
- Smooth transitions between light and dark modes

##  Project Structure

```
cgwa-calculator/
├── src/
│   ├── app/
│   │   ├── globals.css         # Global styles, animations, theme variables
│   │   ├── layout.js           # Root layout with metadata
│   │   └── page.js             # Home page component
│   └── components/
│       └── Calculator.js       # Main calculator component with all logic
├── public/                     # Static assets
├── eslint.config.mjs          # ESLint configuration
├── next.config.mjs            # Next.js configuration
├── postcss.config.mjs         # PostCSS configuration
├── jsconfig.json              # JavaScript configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

##  Key Components

### Calculator Component (`src/components/Calculator.js`)
- **State Management**: Years, terms, modals, theme preference
- **Functions**:
  - `calculateCGWA()` - Weighted average computation
  - `getAcademicHonor()` - Honor tier determination
  - `addYear()`, `removeYear()` - Year CRUD operations
  - `addTerm()`, `removeTerm()`, `updateTerm()` - Term CRUD operations
  - `toggleTheme()` - Dark/light mode switching

### Global Styles (`src/app/globals.css`)
- **Animations**: fade-in, slide-up, slide-down, rotate-blobs
- **CTA Buttons**: Skewed design with 3-arrow animation
- **Theme Switch**: Sun/moon toggle with stars and clouds
- **Responsive Breakpoints**: Mobile-first design with sm, md, lg

##  Contributing

Contributions are welcome! This is an open-source project for NU students.

### How to Contribute
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Ideas
- Add export functionality (CSV, PDF, JSON)
- Implement data persistence (IndexedDB, backend API)
- Add semester GWA calculator
- Create grading scale presets for different NU programs
- Add print-friendly layout
- Implement data import from NU portals
- Add multi-language support

##  License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

##  Author

**Nathan Rabanal**
- 3rd Year BSIT-MI Student at NU Fairview
- GitHub: [@ninathan](https://github.com/ninathan)
- Facebook: [Nathan Rabanal](https://facebook.com/nat3tan)

##  Acknowledgments

- **National University (NU)** - For the academic framework and inspiration
- **Vercel** - For Next.js and Geist fonts
- **Tailwind CSS** - For the utility-first CSS framework
- **NU Students** - For feedback and feature suggestions

##  Disclaimer

This website is only a CGWA Calculator and is not a guaranteed spot for an academic honor, nor is it the actual CGWA of the student. It is a mere estimation of CGWA based on the student's GWA. Always refer to the **Student Handbook** for any questions or clarifications.


##  Links

- **GitHub Repository**: [https://github.com/nathangtg/cgwa-calculator](https://github.com/ninathan/CGWA-Calculator)

---

