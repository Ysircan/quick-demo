// /components/ai/generatePromptForUpload.ts

export function generatePromptForUpload(
  inputText: string,
  filePrompt: string,
  style: string
): string {
  return `
You are an expert in educational content creation. Below is the raw material uploaded by a teacher. Please generate questions based on the content.

📝 Source Material:
${inputText}

🎯 Objective:
${filePrompt || 'Decide the best angle for question generation based on content. Stay neutral in tone.'}

🎨 Style:
${style || 'Default'}

📌 Requirements:
- Return an array of JSON questions
- Each question should contain "question", "options" (if applicable), and "answer"
- Stick closely to the given content
- Do not invent facts beyond the material

Begin now.
`.trim();
}
