import express from 'express';
import { ResumesController } from '../controllers/resumes.controller.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { createResumeValidator } from '../middlewares/validators/create-resume-validator.middleware.js';
import { updateResumeValidator } from '../middlewares/validators/update-resume.validator.middleware.js';
import { updateStatusValidator } from '../middlewares/validators/update-status.validator.middleware.js';

const resumeRouter = express.Router();

// ResumesController의 인스턴스를 생성합니다.
const resumesController = new ResumesController();

// 이력서 생성 API
resumeRouter.post('/', requireRoles(['APPLICANT']), createResumeValidator, resumesController.createResume);

// 이력서 목록 조회 API
resumeRouter.get('/', resumesController.getResumeList);

// 이력서 상세 조회 API
resumeRouter.get('/:resumeId', resumesController.getResumeById);

// 이력서 수정 API
resumeRouter.patch('/:resumeId', requireRoles(['APPLICANT']), updateResumeValidator, resumesController.updateResume);

// 이력서 삭제 API
resumeRouter.delete('/:resumeId', requireRoles(['APPLICANT']), resumesController.deleteResume);

// 이력서 지원 상태 변경 API
resumeRouter.patch(
  '/:resumeId/status',
  requireRoles(['RECRUITER']),
  updateStatusValidator,
  resumesController.updateStatus,
);

// 이력서 로그 목록 조회 API
resumeRouter.get('/:resumeId/logs', requireRoles(['RECRUITER']), resumesController.getResumeLogs);

export { resumeRouter };
