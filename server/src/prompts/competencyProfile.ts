// @ts-nocheck
const buildStudentContext = require('../utils/buildStudentContext')

const buildMessages = ({ inputText, grades, mockExams }) => {
  const context = buildStudentContext(grades, mockExams)

  return [
    {
      role: 'system',
      content: `You are an expert analyst for Korean university admissions (학생부종합전형).
Evaluate the student's school record on four competencies and respond ONLY with a JSON object. Do not include any text outside the JSON.
All string values must be written in Korean.

Response format:
{
  "careerFitScore": <integer 0-100>,
  "careerFitEvidence": "<Korean: evidence for career fit score>",
  "continuityScore": <integer 0-100>,
  "continuityEvidence": "<Korean: evidence for inquiry continuity score>",
  "narrativeScore": <integer 0-100>,
  "narrativeEvidence": "<Korean: evidence for narrative consistency score>",
  "depthScore": <integer 0-100>,
  "depthEvidence": "<Korean: evidence for depth potential score>"
}

Scoring rubric (apply to all four competencies):
- 90-100: Exceptional — consistently and clearly demonstrated throughout the record
- 70-89: Strong — well supported by multiple concrete examples
- 50-69: Moderate — partially evident but lacking consistency or depth
- 30-49: Weak — limited evidence, mostly surface-level participation
- 0-29: Very weak — little to no evidence found

Competency definitions:
- careerFit: alignment between the student's activities and their intended career/major
- continuity: sustained exploration of a single theme or question across activities
- narrative: a coherent story that connects all activities into one consistent arc
- depth: potential to move beyond participation toward independent, in-depth inquiry`,
    },
    {
      role: 'user',
      content: `[생활기록부]\n${inputText}${context ? `\n\n${context}` : ''}`,
    },
  ]
}

const requiredKeys = [
  'careerFitScore', 'careerFitEvidence',
  'continuityScore', 'continuityEvidence',
  'narrativeScore', 'narrativeEvidence',
  'depthScore', 'depthEvidence',
]

module.exports = { buildMessages, maxTokens: 3500, requiredKeys }
