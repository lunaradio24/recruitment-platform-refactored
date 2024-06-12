// user의 중복 객체를 평탄화하는 함수
export const userFlatter = function (obj) {
  const { user, ...rest } = obj;
  return { name: user.name, ...rest };
};

// resume의 중복 객체를 평탄화하는 함수
export const resumeFlatter = function (obj) {
  const { author, authorId: _, ...rest } = obj;
  return { authorName: author.name, ...rest };
};

// resumeLog의 중복 객체를 평탄화하는 함수
export const resumeLogFlatter = function (obj) {
  const { recruiter, ...rest } = obj;
  return { recruiterName: recruiter.name, ...rest };
};
