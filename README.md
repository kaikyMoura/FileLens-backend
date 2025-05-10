<h2 align="center">Filelens API</h2>
<p align="center"><i>Repository for the Filelens API</i></p>

<div align="center">
  
![GitHub top language](https://img.shields.io/github/languages/top/kaikyMoura/FileLens-backend)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/ce1f958181d743b98107dbc70dfac5ed)](https://app.codacy.com/gh/kaikyMoura/FileLens-backend/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
![Repository size](https://img.shields.io/github/repo-size/kaikyMoura/FileLens-backend)
![Github last commit](https://img.shields.io/github/last-commit/kaikyMoura/FileLens-backend)
![License](https://img.shields.io/aur/license/LICENSE)
![Languages count](https://img.shields.io/github/languages/count/kaikyMoura/FileLens-backend)

</div>


### 1. About the Project

This project serve as the API implementation for the FileLens, responsible for user authentication, file management, and manipulation. Built with Express, Node.js, TypeScript and Prisma. FileLens enables efficient file processing by leveraging the GeminiAI API to extract data from files and images.



### 2. Key Features
- Allows users to upload and manage image files securely
- Performs real-time image recognition using Gemini AI
- Stores files efficiently using Google Cloud Storage
- Uses Prisma ORM for managing and querying a cloud-based database
- Built with Express and TypeScript, with clear and modular API structure
- Includes validation, error handling, and scalable architecture

### 3. Technologies
<div style="display: inline-block">
  <img alt="typescript-logo" width="48" style="margin-right: 20px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" />
  <img alt="express-logo" width="48" style="margin-right: 12px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original-wordmark.svg" />
  <img alt="prisma-logo" width="48" style="margin-right: 12px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" />
  <img alt="googlecloud-logo" width="48" style="margin-right: 12px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" />
  <img alt="nodejs-logo" width="48" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg" />
</div>

### 4. Installation and Virtual Environment Activation

### Prerequisites:
Before running the project, ensure that **Node.js** is installed on your machine. If not, you can download it from the [official Node.js website](https://nodejs.org/en/) (LTS version recommended).

To verify your Node.js installation, run:

```console
node -v
npm -v
```

#### Clone the repository to your local machine:

```console
git clone https://github.com/kaikyMoura/FileLens-backend.git
```

Navigate to the project's root directory:

```console
cd FileLens-backend
```

### Installing dependencies:
Use npm or yarn to install the project dependencies:

```console
npm install
# or
pnpm install
# or
yarn install
```

#### Running the Application:
Once the dependencies are installed, you can start the development server with:

```console
npm run dev
# or
pnpm run dev
# or
yarn dev
```

#### The application will be available on:

```console
http://localhost:8080
```

### 6. OpenApi Documentation
- Every new endpoint is automatically added to the documentation.
- You can access the documentation to learn how to use it:

```bash
http://localhost:8000/docs
```

### 7. Deployment
The deployment is done using Google Cloud Run and Cloud Build, which allows you to easily deploy your application to Google Cloud Platform.

- [Google Cloud Platform](https://cloud.google.com/)
- [Google Cloud Run](https://cloud.google.com/run)
- [Google Cloud Build](https://cloud.google.com/build)


#### Author 👨‍💻
Kaiky Tupinambá - Fullstack developer
