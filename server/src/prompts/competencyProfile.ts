import buildStudentContext from '../utils/buildStudentContext'
import { PromptInput, ChatMessage } from '../types'

const CALIBRATION_EXAMPLE_INPUT =
  '교내 환경동아리에서 학교 주변 미세먼지 농도를 측정하는 활동에 참여함. 간이 측정기를 이용해 한 학기 동안 매주 데이터를 수집하고 정리함. 환경공학 분야에 관심을 갖고 관련 도서를 1권 읽음. 동아리 발표회에서 측정 결과를 정리하여 발표함.'

const CALIBRATION_EXAMPLE_OUTPUT = {
  careerFitScore: 60,
  careerFitEvidence:
    '환경공학 관련 도서를 1권 읽고 미세먼지 측정 동아리 활동에 참여한 것은 진로 관심 방향과 일치한다. 다만 독서가 1권에 그치고 측정 주제도 동아리에서 정해준 것을 따라간 수준이어서, 스스로 문제를 설정하거나 관심사를 더 깊이 확장한 흔적은 보이지 않는다. 진로 적합성을 더 높게 평가하려면 관심 분야를 스스로 더 파고든 흔적이나 추가 학습이 필요하다.',
  continuityScore: 55,
  continuityEvidence:
    '한 학기 동안 매주 데이터를 수집했다는 점은 일정한 지속성을 보여준다. 그러나 활동이 미세먼지 측정이라는 단일 주제에 한정되어 있고, 학기가 끝난 뒤 다음 단계(예: 다른 환경 지표 측정, 측정 방법 개선 등)로 이어졌다는 근거가 없다. 한 학기 분량의 단발성 탐구로 보이며, 지속성을 더 높게 평가하려면 여러 학기에 걸친 확장이 필요하다.',
  narrativeScore: 60,
  narrativeEvidence:
    '환경 동아리 활동, 관련 도서 독서, 발표회 발표가 모두 환경공학에 대한 관심이라는 하나의 축으로 자연스럽게 연결된다. 다만 활동의 수가 3가지에 그치고 각 활동 간 발전 관계(독서에서 얻은 내용이 측정 활동의 방법이나 해석에 구체적으로 반영되었는지 등)가 드러나지 않아, 이야기는 일관되지만 풍부하지는 않다.',
  depthScore: 45,
  depthEvidence:
    '간이 측정기로 데이터를 수집하고 발표회에서 정리해 발표한 것은 분명 의미 있는 참여다. 그러나 측정값의 원인을 분석하거나 가설을 세워 검증하거나, 측정 방법의 한계를 스스로 보완하려 한 시도는 텍스트에 나타나지 않는다. 데이터 수집과 발표는 참여 수준의 활동이며, 그 이상의 독립적 탐구로 이어졌다는 근거가 없어 깊이는 평균보다 낮게 평가한다.',
}

const buildMessages = ({ inputText, grades, mockExams, targetUniv, targetMajor }: PromptInput): ChatMessage[] => {
  const context = buildStudentContext(grades, mockExams, targetUniv, targetMajor)

  return [
    {
      role: 'system',
      content: `You are an expert analyst for Korean university admissions (학생부종합전형).
Evaluate the student's school record on four competencies and respond ONLY with a JSON object. Do not include any text outside the JSON.
All string values must be written entirely in natural Korean (한국어). Never mix in English, Chinese, Japanese, or any other language — translate every term, including any non-Korean words found in the input record, into Korean. Only loanwords already standard in everyday Korean usage (e.g., AI, STEM) may stay as-is; full words, phrases, or sentences in another language are not allowed.

Response format:
{
  "careerFitScore": <integer 0-100>,
  "careerFitEvidence": "<Korean, 3+ sentences: detailed reasoning for career fit score>",
  "continuityScore": <integer 0-100>,
  "continuityEvidence": "<Korean, 3+ sentences: detailed reasoning for inquiry continuity score>",
  "narrativeScore": <integer 0-100>,
  "narrativeEvidence": "<Korean, 3+ sentences: detailed reasoning for narrative consistency score>",
  "depthScore": <integer 0-100>,
  "depthEvidence": "<Korean, 3+ sentences: detailed reasoning for depth potential score>"
}

Scoring rubric (apply to all four competencies; use 5-point increments for finer differentiation):
- 95-100: Extraordinary — externally validated, exceptional achievement (e.g., published research, patent, national-level competition award, multi-year independent project) far beyond what is normally expected of a high school student. Extremely rare.
- 85-94: Outstanding — sustained, in-depth engagement across multiple semesters with clear independent thinking and initiative that goes beyond assigned coursework. Uncommon even among strong applicants.
- 70-84: Strong — solid, concrete evidence across multiple activities, but largely within the scope of normal class/club assignments; some independent extension but not fully self-directed.
- 55-69: Above average — noticeable, genuine effort and some relevant activity, but limited in depth, scale, or independence; mostly participation-level engagement.
- 40-54: Average — minimal or surface-level evidence; the competency is mentioned or implied but lacks demonstrated effort, reasoning, or outcome.
- 20-39: Weak — little concrete connection to the competency; vague, generic, or one-off statements only.
- 0-19: Very weak — no meaningful evidence at all.

Calibration rule — avoid score inflation:
- Most real student records, even genuinely good ones, should score in the 40-70 range. A single short-term project or one notable activity, however technically sound it sounds, should rarely exceed 70 unless the text shows clear independent extension, real depth of inquiry, and consistency across multiple separate activities.
- Reserve scores above 85 for cases with concrete, externally verifiable distinction (e.g., a province/national-level award, a published paper, a patent, or multi-year continuous research with measurable progression). If the record does not explicitly describe this level of distinction, do not assign it.
- A school-internal award or recognition (교내 대회, 교내 동아리 발표회 등) is NOT external validation — it is normal, expected participation and should be treated as "above average" (55-69) at most, not as grounds for an 85+ score. Only awards explicitly described as district/province/national-level (교외, 지역, 전국 단위) or above count as external distinction.
- Do not raise a score just because the activity sounds technically sophisticated or uses impressive-sounding terms (e.g., AI, 알고리즘, 시스템). Weigh the actual depth, independence, repetition/iteration, and consistency the text demonstrates — a single one-off attempt is not the same as sustained, iterative inquiry, and should score noticeably lower.
- When in doubt between two adjacent bands, pick the lower one. Be a critical, realistic evaluator, not an encouraging one.

Competency definitions:
- careerFit: alignment between the student's activities and their intended career/major
- continuity: sustained exploration of a single theme or question across activities
- narrative: a coherent story that connects all activities into one consistent arc
- depth: potential to move beyond participation toward independent, in-depth inquiry

Grounding rule:
- Every score and evidence string must cite concrete, specific details that literally appear in the [진로활동특기사항] text below — named activities, roles, projects, topics, or outcomes. Do not write generic statements that could equally apply to any student.
- If the record provides only vague or insufficient detail for a competency, score it low and say so explicitly in the evidence field, rather than inventing plausible-sounding specifics.
- The student's target university/major in [목표 진로], if provided, is reference context only — it describes the student's goal, not a fact about what their record actually contains. Base careerFitScore strictly on what the activity text itself demonstrates, not on an assumption of what a typical student aiming for that major would have done.

Analysis depth rule:
- Do not just list the activities and tack on a generic verdict (e.g., "~을 보여줌", "~이 우수함"). Each evidence string must read like an actual reviewer's reasoning, in at least 3 full sentences: (1) name the specific detail from the text being used as evidence, (2) explain concretely why that detail does or does not demonstrate the competency, and (3) state explicitly what additional evidence (e.g., more iterations, a clearer outcome, broader scope) would have been needed to justify a higher score.
- Every evidence string must mention at least one concrete limitation or gap, even when the score is high — there is always something that would have made the record stronger. A purely positive evidence string with no caveat is a sign the analysis is too shallow.

The next user message is a calibration example showing the expected scoring level for a decent-but-ordinary record (genuine effort, one clear activity, no distinctive achievement). Use it as your anchor: a real input must show clearly more — independent extension, iteration, or external recognition — to score meaningfully higher than this example.`,
    },
    {
      role: 'user',
      content: `[예시 진로활동특기사항]\n${CALIBRATION_EXAMPLE_INPUT}`,
    },
    {
      role: 'assistant',
      content: JSON.stringify(CALIBRATION_EXAMPLE_OUTPUT),
    },
    {
      role: 'user',
      content: `[진로활동특기사항]\n${inputText}${context ? `\n\n${context}` : ''}`,
    },
  ]
}

const requiredKeys = [
  'careerFitScore', 'careerFitEvidence',
  'continuityScore', 'continuityEvidence',
  'narrativeScore', 'narrativeEvidence',
  'depthScore', 'depthEvidence',
]

export { buildMessages, requiredKeys }
export const maxTokens = 3500
