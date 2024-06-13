import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { APPLICATION_STATUSES } from '../constants/resume.constant.js';
import { resumeFlatter, resumeLogFlatter } from '../utils/resume.util.js';

export class ResumeService {
  constructor(resumeRepository) {
    this.resumeRepository = resumeRepository;
  }

  createResume = async (authorId, title, content) => {
    const createdResume = await this.resumeRepository.createResume(authorId, title, content);
    return createdResume;
  };

  getResumeList = async (userId, role, status, sort) => {
    // 역할이 'RECRUITER'인 경우 모든 이력서,'APPLICANT' 인 경우 작성자 본인의 이력서만 조회 가능
    const authorId = role !== 'RECRUITER' ? userId : undefined;

    // status 값이 유효한 지원상태인 경우 제외하고 모든 상태의 이력서를 조회
    const filterOption =
      status && APPLICATION_STATUSES.includes(status.toUpperCase()) ? status.toUpperCase() : undefined;

    // sort 값이 'asc'인 경우 제외하고 'desc' (최신순) 정렬
    const sortOption = sort && sort.toLowerCase() === 'asc' ? 'asc' : 'desc';

    // 이력서 조회
    const resumes = await this.resumeRepository.findAllResumes(authorId, filterOption, sortOption);

    // 평탄화
    const flattedResumes = resumes ? resumes.map((resume) => resumeFlatter(resume)) : [];
    return flattedResumes;
  };

  getResumeById = async (userId, role, resumeId) => {
    // 이력서 조회
    const resume = await this.resumeRepository.findResumeById(resumeId);
    if (!resume) throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);

    // 이력서 작성자인지 확인
    if (role !== 'RECRUITER' && userId !== resume.authorId) {
      throw new HttpError.Forbidden(MESSAGES.RESUMES.COMMON.NO_ACCESS_RIGHT);
    }

    // 평탄화
    const flattedResume = resumeFlatter(resume);
    return flattedResume;
  };

  updateResume = async (userId, resumeId, title, content) => {
    // 이력서 조회
    const resume = await this.resumeRepository.findResumeById(resumeId);
    if (!resume) throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);

    // 이력서 작성자인지 확인
    if (userId !== resume.authorId) throw new HttpError.Forbidden(MESSAGES.RESUMES.COMMON.NO_ACCESS_RIGHT);

    // 해당 이력서 수정
    const updatedResume = await this.resumeRepository.updateResume(resumeId, title, content);
    return updatedResume;
  };

  deleteResume = async (userId, resumeId) => {
    // 이력서 조회
    const resume = await this.resumeRepository.findResumeById(resumeId);
    if (!resume) throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);

    // 이력서 작성자인지 확인
    if (userId !== resume.authorId) throw new HttpError.Forbidden(MESSAGES.RESUMES.COMMON.NO_ACCESS_RIGHT);

    // 해당 이력서 데이터 삭제
    await this.resumeRepository.deleteResume(resumeId);
  };

  updateStatus = async (resumeId, recruiterId, newStatus, reason) => {
    // resumeId로 이력서 조회
    const resume = await this.resumeRepository.findResumeById(resumeId);

    // 해당 이력서가 존재하지 않을 때
    if (!resume) throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);

    // 변경할 지원 상태가 이전과 동일 할 때
    const prevStatus = resume.applicationStatus;
    if (newStatus === prevStatus) {
      throw new HttpError.BadRequest(MESSAGES.RESUMES.COMMON.STATUS.NOT_CHANGED);
    }

    // 지원 상태 변경 후 로그 반환
    const resumeLog = await this.resumeRepository.updateStatus(resumeId, recruiterId, prevStatus, newStatus, reason);
    return resumeLog;
  };

  getResumeLogs = async (resumeId) => {
    // 이력서 로그 조회
    const resumeLogs = await this.resumeRepository.findResumeLogs(resumeId);

    // 평탄화
    const flattedResumeLogs = resumeLogs ? resumeLogs.map((log) => resumeLogFlatter(log)) : [];
    return flattedResumeLogs;
  };
}
