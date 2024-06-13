import { Prisma } from '@prisma/client';

export class ResumeRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createResume = async (authorId, title, content) => {
    const createdResume = await this.prisma.resume.create({ data: { authorId, title, content } });
    return createdResume;
  };

  findAllResumes = async (authorId, filterOption, sortOption) => {
    const resumes = await this.prisma.resume.findMany({
      where: {
        authorId: authorId,
        applicationStatus: filterOption,
      },
      orderBy: {
        createdAt: sortOption,
      },
      include: {
        author: true,
      },
    });
    return resumes;
  };

  findResumeById = async (resumeId) => {
    const resume = await this.prisma.resume.findUnique({
      where: { id: Number(resumeId) },
      include: { author: true },
    });
    return resume;
  };

  updateResume = async (resumeId, title, content) => {
    const updatedResume = await this.prisma.resume.update({
      where: { id: Number(resumeId) },
      data: { title, content },
    });
    return updatedResume;
  };

  deleteResume = async (resumeId) => {
    await this.prisma.resume.delete({ where: { id: Number(resumeId) } });
  };

  updateStatus = async (resumeId, recruiterId, prevStatus, newStatus, reason) => {
    // 이력서 지원 상태 수정 & 이력서 로그 생성 (transaction으로 묶어서 실행)
    const resumeLog = await this.prisma.$transaction(
      async (txn) => {
        // Resumes 테이블에서 지원 상태 업데이트
        await txn.resume.update({
          where: { id: Number(resumeId) },
          data: { applicationStatus: newStatus },
        });
        // ResumeLogs 테이블에 지원 상태 변경 로그 생성
        return await txn.resumeLog.create({
          data: {
            resumeId: Number(resumeId),
            recruiterId: recruiterId,
            prevStatus: prevStatus,
            currStatus: newStatus,
            reason: reason,
          },
        });
      },
      {
        //격리 수준 설정
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );
    return resumeLog;
  };

  findResumeLogs = async (resumeId) => {
    const resumeLogs = await this.prisma.resumeLog.findMany({
      where: { resumeId: Number(resumeId) },
      orderBy: { changedAt: 'desc' },
      include: { recruiter: true },
    });
    return resumeLogs;
  };
}
