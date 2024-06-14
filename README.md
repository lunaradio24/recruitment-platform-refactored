# 채용 플랫폼 백엔드

### 개요
채용자 중심 이력서 관리 플랫폼

### 기능
- APPLICANT: 자신의 이력서 CRUD
- RECRUITER: 이력서 목록 조회, 상세 조회, 지원 상태 변경, 로그 조회

### 폴더 구조
```sh
.
├── __tests__
|   ├── __mocks__
|   │   └── bcrypt.js
│   ├── dummies
│   │   ├── resumes.dummy.js
│   │   └── users.dummy.js
│   └── unit
│       ├── controllers
│       │   ├── auth.controller.unit.spec.js
│       │   ├── resumes.controller.unit.spec.js
│       │   └── users.controller.unit.spec.js
│       ├── repositories
│       │   ├── resumes.repository.unit.spec.js
│       │   └── users.repository.unit.spec.js
│       └── services
│           ├── auth.service.unit.spec.js
│           └── resumes.service.unit.spec.js
├── node_modules // Git에는 올라가지 않습니다.
├── prisma
│   └── schema.prisma
├── src
│   ├── constants
│   │   ├── auth.constant.js
│   │   ├── env.constant.js
│   │   ├── http-status.constant.js
│   │   ├── message.constant.js
│   │   └── resume.constant.js
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── resumes.controller.js
│   │   └── users.controller.js
│   ├── errors
│   │   └── http.error.js
│   ├── middlewares
│   │   ├── validators
│   │   ├── error-handler.middleware.js
│   │   └── require-access-token.middleware.js
│   ├── repositories
│   │   ├── resumes.repository.js
│   │   └── users.repository.js
│   ├── routers
│   │   ├── auth.router.js
│   │   ├── index.js
│   │   ├── resumes.router.js
│   │   └── users.router.js
│   ├── services
│   │   ├── auth.service.js
│   │   └── resumes.service.js
│   ├── utils
│   │   └── prisma.util.js
│   └── app.js
├── .env // Git에는 올라가지 않습니다.
├── .env.example // Git에 올라갑니다. .env의 복사본으로 Key만 있고 Value는 삭제된 상태입니다.
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── jest.config.js
├── package.json
├── README.md
└── yarn.lock
```

### 실행 방법

- 필요한 패키지 설치

```sh
yarn
```

- 서버 실행 (배포용)

```sh
yarn start
```

- 서버 실행 (개발용)

```sh
yarn dev
```
