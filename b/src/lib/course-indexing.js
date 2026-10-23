export function isCourseIndexPageIndexable(teaching) {
  return teaching?.meta?.indexable === true;
}

export function isCourseIndexable(course) {
  return course?.indexable === true;
}

export function isLessonIndexable(course, lesson) {
  return isCourseIndexable(course) && lesson?.indexable === true;
}
