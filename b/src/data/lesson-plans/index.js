import generatedLessonPlans from './generated.js';
import softwareSecurity from './55AA-002.js';

const mergeLessons = (generated, overrides) => {
  const byId = new Map(generated.map((lesson) => [lesson.id, lesson]));
  overrides.forEach((lesson) => byId.set(lesson.id, lesson));
  return [...byId.values()].sort((a, b) => a.week - b.week || a.session - b.session);
};

const lessonPlans = {
  ...generatedLessonPlans,
  "55AA-002": mergeLessons(generatedLessonPlans["55AA-002"] ?? [], softwareSecurity)
};

export default lessonPlans;
