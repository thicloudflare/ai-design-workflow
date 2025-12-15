

export const phases = [
  {
    number: 1,
    title: "Discovery",
    description: "Understand the problem & users",
    sections: [
      {
        title: "A. PRD Review",
        tools: [
          {
            name: "CF1 PRD review Gemini Gem",
            icon: "gemini",
            url: "https://gemini.google.com/gem/1B2-wr6pucPK0sxQLnrqpWJmMTmAOcBmC?usp=sharing",
            description:
              "The Gemini Gem functions as a critical design analyst, converting the PRD into a structured, four-part critique (Frames) designed for immediate use in collaboration tools like Miro or FigJam.",
            coreOutputFocus: [
              {
                frame: "Overview",
                keyDeliverables:
                  "A 2-3 sentence summary of the biggest misalignment between requirements and user needs.",
                details: [
                  {
                    title: "Overview",
                    description:
                      "High-level synthesis of the problem, persona, and conflict",
                  },
                ],
              },
              {
                frame: "Pain points & JTBDs",
                keyDeliverables:
                  "The synthesized Core Job-to-be-Done (JTBD) statement and 3 critical questions for the Product Manager.",
                details: [
                  {
                    title: "Pain points & JTBDs",
                    description:
                      "Alignment between the stated problem and the user's job-to-be-done.",
                  },
                ],
              },
              {
                frame: "Business goals & metrics",
                keyDeliverables:
                  "Classification of the 2 main success metrics as either user-leading (user-centric) or lagging (business-centric) indicators.",
                details: [
                  {
                    title: "Business goals & metrics",
                    description: "Evaluation of success metrics.",
                  },
                ],
              },
              {
                frame: "Key design decisions",
                keyDeliverables:
                  "Validation of the 3 most complex features against user needs and an analysis of one major design trade-off",
                details: [
                  {
                    title: "Key design decisions",
                    description:
                      "Feature justification and implied trade-offs.",
                  },
                ],
              },
            ],
            instructions: [
              "1. Input the PRD: Paste or Upload: Copy the full text of the PRD into the Gemini chat window, or use the file upload feature if the document is a text-based file (e.g., DOCX, TXT).",
              '2. Initiate Review: Send the content along with a clear prompt (e.g., "Review this PRD and provide a structured critique focusing on clarity, completeness, and alignment.").',
              "3. Receive Output: The Gem will analyze the document and return a structured critique based on its training.",
              "4. Prepare for Collaboration: Copy the Output: Copy the text output of the Gem's critique.",
              "5. Integrate into Miro: Paste onto Board: Paste the critique onto your Discovery phase Miro board. Organize the points into sticky notes or a table for discussion.",
              "6. Discuss & Prioritize: Use the AI-generated findings as the agenda for your PRD review session. Tag and organize findings to align your team.",
            ],
          },
          {
            name: "Miro discovery board template",
            icon: "miro",
            url: "https://miro.com/app/board/uXjVKbryC1g=/?userEmail=cnemeth@cloudflare.com&track=true&utm_source=notification&utm_medium=email&utm_campaign=add-to-board&utm_content=go-to-board",
            description: "A structured Miro template for discovery phase work.",
          },
        ],
      },
      {
        title: "B. Customer Discovery",
        tools: [
          {
            name: "Meeting notes to test plan",
            icon: "gemini",
            url: "https://gemini.google.com/gem/18V6380tgwmlUAvL5Np166S2nQnye9L0E?usp=sharing",
            description: "Turning Gemini created or typed meeting notes and structures it into a test plan",
          },
        ],
      },
    ],
  },
  {
    number: 2,
    title: "Define",
    description: "Analyze findings & set strategy",
    sections: [
      {
        title: "A. Strategy Framework",
        tools: [
          {
            name: "User Journey Mapper",
            icon: "miro",
            url: "#",
            description: "Map user journeys to identify key touchpoints and opportunities for improvement.",
          },
          {
            name: "Problem Statement Generator",
            icon: "gemini",
            url: "#",
            description: "Generate clear, actionable problem statements based on discovery findings.",
          },
        ],
      },
      {
        title: "B. Prioritization",
        tools: [
          {
            name: "Impact/Effort Matrix",
            icon: "miro",
            url: "#",
            description: "Prioritize features and initiatives based on impact and effort.",
          },
        ],
      },
    ],
  },
  {
    number: 3,
    title: "Ideation",
    description: "Generate solutions & concepts",
    sections: [
      {
        title: "A. Concept Generation",
        tools: [
          {
            name: "CF1 workflow validation",
            icon: "gemini",
            url: "https://gemini.google.com/gem/1s-g0kNnGyyVVOXf0QvHHISPdccliNCrr?usp=sharing",
            description: "The Gemini Gem functions as a Zero Trust workflow consultant, rigorously evaluating organizational processes against the Jobs-to-be-Done (JTBD) framework for key Cloudflare One user personas.",
            coreOutputFocus: [
              {
                frame: "Core Output Focus",
                keyDeliverables: "A structured, five-part validation report for each workflow submitted",
                details: [
                  {
                    title: "Mapping",
                    description: "Which Cloudflare One products are utilized at each step.",
                  },
                  {
                    title: "Persona",
                    description: "Which user roles interact with the workflow.",
                  },
                  {
                    title: "Alignment Rating",
                    description: "A score (Strong, Moderate, Weak, Misaligned) indicating how well the workflow achieves the user's core Job-to-be-Done.",
                  },
                  {
                    title: "Gaps & Issues",
                    description: "Identification of friction points, security risks, or missing steps.",
                  },
                  {
                    title: "Recommendations",
                    description: "2-4 specific, actionable improvements using Cloudflare One features (Access policies, Gateway filtering, Tunnel configs).",
                  },
                ],
              },
            ],
          },
          {
            name: "AI Design Assistant",
            icon: "gemini",
            url: "#",
            description: "Generate multiple design concepts based on your requirements and constraints.",
          },
          {
            name: "Brainstorming Template",
            icon: "miro",
            url: "#",
            description: "Structured template for team brainstorming sessions.",
          },
        ],
      },
      {
        title: "B. Concept Refinement",
        tools: [
          {
            name: "Design Critique Framework",
            icon: "miro",
            url: "#",
            description: "Framework for structured design critiques and feedback.",
          },
        ],
      },
      {
        title: "C. Content Guide",
        tools: [
          {
            name: "PCX CLUE index",
            icon: "miro",
            url: "https://clue.cloudflarecontent.com/",
            description: "Write user-friendly UI, API, and email content. The CLUE Index evaluates content based on UX content best practices and Cloudflare's internal style guide.",
            coreOutputFocus: [
              {
                frame: "Core Output Focus",
                keyDeliverables: "Rate your content and give recommendations to match Cloudflare standards and guidelines.",
                details: [],
              },
            ],
          },
          {
            name: "Settings Label + Description Generator",
            icon: "gemini",
            url: "https://gemini.google.com/gem/f724748d9d57?usp=sharing",
            description: "Share details about new settings to generate outcome-oriented labels and descriptions",
          },
          {
            name: "Empty State Content",
            icon: "gemini",
            url: "https://gemini.google.com/gem/1kD58Sb0fvthDiq8CHb0CdMcWhLvsTmHO?usp=sharing",
            description: "Add your PRD or Product summary to create the content for an empty state",
          },
        ],
      },
    ],
  },
  {
    number: 4,
    title: "Test",
    description: "Validate solutions with users",
    sections: [
      {
        title: "A. Test Planning",
        tools: [
          {
            name: "Usability Test Plan Generator",
            icon: "gemini",
            url: "#",
            description: "Generate comprehensive usability test plans with scenarios and tasks.",
          },
          {
            name: "Test Session Template",
            icon: "miro",
            url: "#",
            description: "Template for organizing and conducting user testing sessions.",
          },
        ],
      },
      {
        title: "B. Analysis",
        tools: [
          {
            name: "Insights Synthesizer",
            icon: "gemini",
            url: "#",
            description: "Synthesize test findings into actionable insights and recommendations.",
          },
          {
            name: "Interim High-Level Research Observations",
            icon: "gemini",
            url: "https://gemini.google.com/gem/086c392136b9?usp=sharing",
            description: "Give interim findings of ongoing research to keep stakeholders in the loop on research initiatives. Please ensure all customer PII is cleaned from transcripts before submitting!",
          },
        ],
      },
    ],
  },
  {
    number: 5,
    title: "Implement",
    description: "Hand-off, launch, and refine",
    sections: [
      {
        title: "A. Hand-off",
        tools: [
          {
            name: "Design Spec Generator",
            icon: "gemini",
            url: "#",
            description: "Generate detailed design specifications for development teams.",
          },
          {
            name: "Component Library",
            icon: "miro",
            url: "#",
            description: "Organized library of reusable design components.",
          },
        ],
      },
      {
        title: "B. Launch & Monitor",
        tools: [
          {
            name: "Launch Checklist",
            icon: "miro",
            url: "#",
            description: "Comprehensive checklist to ensure successful product launch.",
          },
          {
            name: "Metrics Dashboard",
            icon: "miro",
            url: "#",
            description: "Track and monitor key performance metrics post-launch.",
          },
        ],
      },
    ],
  },
];
