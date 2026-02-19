import { defineConfig } from "vitepress"

export default defineConfig({
  title: "solstice-calendar",
  description: "Headless, framework-agnostic calendar/date-time core",
  themeConfig: {
    nav: [
      { text: "Get Started", link: "/get-started/introduction" },
      { text: "Guides", link: "/guides/navigation-focus" },
      { text: "API", link: "/api/" },
      { text: "Troubleshooting", link: "/troubleshooting/common-pitfalls" },
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
        text: "Build Your First Picker",
        items: [
          { text: "Introduction", link: "/first-picker/" },
          { text: "Minimal Date Picker", link: "/first-picker/minimal-date-picker" },
          { text: "Add Time Selection", link: "/first-picker/add-time-selection" },
          { text: "Render Calendar Grid", link: "/first-picker/render-calendar-grid" },
          { text: "Wire Inputs", link: "/first-picker/wire-inputs" }
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
        text: "Guides",
        items: [
          { text: "Navigation and Focus", link: "/guides/navigation-focus" },
          { text: "Metadata and Disabled States", link: "/guides/metadata-disabled-states" },
          { text: "Accessibility", link: "/guides/accessibility" },
          { text: "Time Options", link: "/guides/time-options" }
        ]
      },
      {
        text: "Recipes",
        items: [
          { text: "Date-Only Picker", link: "/recipes/date-only-picker" },
          { text: "Date-Time Picker", link: "/recipes/date-time-picker" },
          { text: "Business Constraints", link: "/recipes/business-constraints" },
          { text: "Start-End Range Pattern", link: "/recipes/start-end-range-pattern" }
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
        text: "Troubleshooting",
        items: [
          { text: "Common Pitfalls", link: "/troubleshooting/common-pitfalls" },
          { text: "FAQ", link: "/troubleshooting/faq" }
        ]
      },
      {
        text: "Changelog",
        items: [
          { text: "Documentation Changelog", link: "/changelog/docs-changelog" }
        ]
      }
    ]
  }
})
