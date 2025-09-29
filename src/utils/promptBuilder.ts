export function buildSearchIntentPrompt(
  searchTerm: string,
  subjects: string[],
) {
  const systemContent = `You are analyzing a search term for a UK education platform.

The platform has the following available subject names:
${subjects.join(", ")}

Analyze the search term and identify which subject names are relevant, with confidence scores 1-5 (5 being most confident).

Rules:
- Only return subject names from the list above
- Use confidence scores: 1 (low) to 5 (high)  
- Be conservative with confidence scores
- Return max 3-4 most relevant subjects
- Focus on direct subject matches first

Return your response as a JSON object with this exact structure:
{"subjects": [{"name": "subject-name", "confidence": 1-5}]}

Examples:
- "maths" → {"subjects": [{"name": "maths", "confidence": 5}]}
- "shakespeare" → {"subjects": [{"name": "english", "confidence": 5}, {"name": "drama", "confidence": 3}]}
- "ww1" → {"subjects": [{"name": "history", "confidence": 5}]}
- "photosynthesis" → {"subjects": [{"name": "biology", "confidence": 5}, {"name": "science", "confidence": 4}]}

Analyze the user's search term:
`;

  return [
    {
      role: "system" as const,
      content: systemContent,
    },
    {
      role: "user" as const,
      content: `
        <retrieved-data>
        ${searchTerm}
        </retrieved-data>
        `,
    },
  ];
}
