import { defineConfig } from "vitepress"

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1]
const isGitHubActions = process.env.GITHUB_ACTIONS === "true"
const base = isGitHubActions && repositoryName ? `/${repositoryName}/` : "/"

export default defineConfig({
  base,
  title: "solstice-calendar",
  description: "Headless, framework-agnostic calendar/date-time core",
  themeConfig: {
    nav: [
      { text: "Get Started", link: "/get-started/introduction" },
      { text: "Core Concepts", link: "/core-concepts/value-model" },
      { text: "API", link: "/api/" },
      { text: "FAQ", link: "/troubleshooting/faq" },
      { text: "GitHub", link: "https://github.com/Moulyy/solstice-calendar" }
    ],
    sidebar: [
      {
        text: "Overview",
        items: [
          { text: "Introduction", link: "/get-started/introduction" },
          { text: "Installation", link: "/get-started/install" },
          { text: "Quick Start", link: "/get-started/quick-start" }
        ]
      },
      {
        text: "Core Concepts",
        items: [
          { text: "Value Model", link: "/core-concepts/value-model" },
          { text: "Controlled vs Uncontrolled", link: "/core-concepts/controlled-vs-uncontrolled" },
          { text: "Constraints", link: "/core-concepts/constraints" },
          { text: "Input Policy", link: "/core-concepts/input-policy" },
          { text: "Formatter", link: "/core-concepts/formatter" }
        ]
      },
      {
        text: "API Reference",
        items: [
          { text: "Overview", link: "/api/" },
          { text: "Date and Time Values", link: "/api/date-time-values" },
          { text: "Calendar Math", link: "/api/calendar-math" },
          { text: "Constraints API", link: "/api/constraints" },
          { text: "Time Options API", link: "/api/time-options" },
          { text: "DateTimePicker API", link: "/api/date-time-picker" },
          { text: "Public Types", link: "/api/public-types" }
        ]
      },
      {
        text: "FAQ",
        items: [
          { text: "FAQ", link: "/troubleshooting/faq" }
        ]
      }
    ]
  }
})
