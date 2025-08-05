# MountMix - Mountain-Inspired Cocktail Lounge

A modern, elegant website for a mountain-themed cocktail lounge, built with React, TypeScript, and Vite.

## 🏔️ Overview

MountMix is a sophisticated web application showcasing a mountain-inspired cocktail lounge. The website features a modern, responsive design with smooth animations and an elegant user interface that reflects the premium nature of the establishment.

## 🛠️ Tech Stack

- **Frontend Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide Icons
- **UI Components:** Custom components with shadcn/ui

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mountmix-vite.git
   cd mountmix-vite
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and visit `http://localhost:5173`

## 📁 Project Structure

```
mountmix-vite/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── sections/     # Main page sections
│   │   │   └── ui/          # Reusable UI components
│   │   ├── styles/          # Global styles
│   │   └── App.tsx          # Main application component
│   └── public/              # Static assets
├── package.json
└── README.md
```

## 🎨 Features

- Responsive design optimized for all devices
- Smooth animations and transitions
- Modern, mountain-inspired UI
- Interactive cocktail menu
- Custom glass-card effects
- Optimized image loading
- SEO-friendly structure

## 🛠️ Development


### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### __Test individual servers__

npm run mcp:contact
npm run mcp:quote
npm run mcp:calendar
npm run mcp:content

### __Test all servers__

**1) Use tsx**

```
# install tsx if needed
sudo npm install -g tsx

# test servers with tsx
tsx mcp-servers/test-servers.ts
```

**2) Use npx (or npm exec)**

```
npm run mcp:test:all
# or
npm exec tsx mcp-servers/test-servers.ts
# or
npx tsx mcp-servers/test-servers.ts
```

This will automatically look in `node_modules/.bin` and run the right version of tsx.

### __Start the full application__

```
npm run dev      # Next.js frontend
npm run server:dev  # Express backend
npm run mcp:dev     # All MCP servers
```


- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper type definitions
- Follow the established component structure
- Use Tailwind CSS for styling

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=your_api_url_here
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Images from Unsplash
- Icons from Lucide
- UI components inspired by shadcn/ui 