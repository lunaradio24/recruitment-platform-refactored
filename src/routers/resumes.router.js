import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { ResumeRepository } from '../repositories/resumes.repository.js';
import { ResumeService } from '../services/resumes.service.js';
import { ResumeController } from '../controllers/resumes.controller.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { createResumeValidator } from '../middlewares/validators/create-resume-validator.middleware.js';
import { updateResumeValidator } from '../middlewares/validators/update-resume.validator.middleware.js';
import { updateStatusValidator } from '../middlewares/validators/update-status.validator.middleware.js';

const resumeRouter = express.Router();

const resumeRepository = new ResumeRepository(prisma);
const resumeService = new ResumeService(resumeRepository);
const resumeController = new ResumeController(resumeService);

// 이력서 생성 API
resumeRouter.post('/', requireRoles(['APPLICANT']), createResumeValidator, resumeController.createResume);

// 이력서 목록 조회 API
resumeRouter.get('/', resumeController.getResumeList);

// 이력서 상세 조회 API
resumeRouter.get('/:resumeId', resumeController.getResumeById);

// 이력서 수정 API
resumeRouter.patch('/:resumeId', requireRoles(['APPLICANT']), updateResumeValidator, resumeController.updateResume);

// 이력서 삭제 API
resumeRouter.delete('/:resumeId', requireRoles(['APPLICANT']), resumeController.deleteResume);

// 이력서 지원 상태 변경 API
resumeRouter.patch(
  '/:resumeId/status',
  requireRoles(['RECRUITER']),
  updateStatusValidator,
  resumeController.updateStatus,
);

// 이력서 로그 목록 조회 API
resumeRouter.get('/:resumeId/logs', requireRoles(['RECRUITER']), resumeController.getResumeLogs);

export { resumeRouter };
