import { ResumesService } from '../services/resumes.service.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class ResumesController {
  resumesService = new ResumesService();

  createResume = async (req, res, next) => {
    try {
      // 사용자 정보와 요청 정보를 가져오기
      const { id: userId } = req.user;
      const { title, content } = req.body;

      // 이력서 데이터 생성
      const createdResume = await this.resumesService.createResume(userId, title, content);

      // 반환 정보
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.RESUMES.CREATE.SUCCEED,
        data: createdResume,
      });

      // 에러 처리
    } catch (error) {
      next(error);
    }
  };

  getResumeList = async (req, res, next) => {
    try {
      // 사용자 정보와 요청 정보를 가져오기
      const { id: userId, role } = req.user;
      let { sort, status } = req.query;

      // 조건에 맞는 이력서 찾기
      const resumes = await this.resumesService.getResumeList(userId, role, status, sort);

      // 반환 정보
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
        data: resumes,
      });
    } catch (error) {
      next(error);
    }
  };

  getResumeById = async (req, res, next) => {
    try {
      // 사용자 정보와 요청 정보 가져오기
      const { id: userId, role } = req.user;
      const { resumeId } = req.params;

      // 이력서 조회
      const resume = await this.resumesService.getResumeById(userId, role, resumeId);

      // 반환 정보
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
        data: resume,
      });

      // 에러 처리
    } catch (error) {
      next(error);
    }
  };

  updateResume = async (req, res, next) => {
    try {
      // 1. 사용자 정보와 요청 정보 가져오기
      const { id: userId } = req.user;
      const { resumeId } = req.params;
      const { title, content } = req.body;

      // 이력서 데이터 수정
      const updatedResume = await this.resumesService.updateResume(userId, resumeId, title, content);

      // 반환 정보
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.UPDATE.SUCCEED,
        data: updatedResume,
      });

      // 에러 처리
    } catch (error) {
      next(error);
    }
  };

  deleteResume = async (req, res, next) => {
    try {
      // 사용자 정보와 요청 정보를 가져오기
      const { id: userId } = req.user;
      const { resumeId } = req.params;

      // 해당 이력서 삭제 요청
      await this.resumesService.deleteResume(userId, resumeId);

      // 반환 정보
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.DELETE.SUCCEED,
        data: { resumeId: Number(resumeId) },
      });

      // 에러 처리
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req, res, next) => {
    try {
      // 사용자 정보와 요청 정보를 가져오기
      const { id: recruiterId } = req.user;
      const { resumeId } = req.params;
      const { applicationStatus: newStatus, reason } = req.body;

      // 이력서 지원 상태 변경
      const resumeLog = await this.resumesService.updateStatus(resumeId, recruiterId, newStatus, reason);

      // 반환 정보
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.UPDATE_STATUS.SUCCEED,
        data: resumeLog,
      });

      // 에러 처리
    } catch (error) {
      next(error);
    }
  };

  getResumeLogs = async (req, res, next) => {
    try {
      // 요청 정보 가져오기
      const { resumeId } = req.params;

      // 해당 이력서의 이력서 로그 찾기
      const resumeLogs = await this.resumesService.getResumeLogs(resumeId);

      // 반환 정보
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_LOGS.SUCCEED,
        data: resumeLogs,
      });

      // 에러 처리
    } catch (error) {
      next(error);
    }
  };
}
