// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
  temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
     history: [
         {
           role: "user",
           parts: [
             {text: "\"You are an AI chatbot designed to answer questions based on Ashish Rai's resume. Below is the resume. Answer questions by referring strictly to this content. Your answers should be well-formatted with appropriate headings, bullet points, or paragraphs where necessary. For longer responses, break the text into clear sections, using headings for each relevant part. If the information is not available in the resume, reply with: 'This information is not available in the resume.' Ensure concise, professional, and readable answers.\n\nResume of Ashish Rai\n\nPersonal Information:\n\nName: Ashish Rai\nRole: Frontend Developer\nPhone: +91-9691230315\nEmail: ashishrair500@gmail.com\nLocation: Indore, India\nLinkedIn: LinkedIn Profile\nGitHub: GitHub Profile\nPortfolio: Portfolio\nEducation:\n\nMTech Integrated (IT): 8.46 CGPA, International Institute of Professional Studies, DAVV (2020 – 2025)\nHigh School: 91.00%, School of Excellence Jabalpur\nHigher Secondary: 90.00%, School of Excellence Jabalpur\nAchievements:\n\nFounder and Developer of the IIPS Student Portal.\nSolved 400+ DSA problems across various coding platforms, including achieving 5-star status in Java on HackerRank.\nCompleted 2 personal and 2 team projects in areas such as web development (React frontend + backend), IoT, and Android development.\nOrganized events like Prayas Sports Event and IoT Workshop at Devi Ahilya University.\nNCC A certified.\nTechnical Skills:\n\nProgramming Languages: Java, JavaScript\nFrameworks & Libraries: ReactJS, ReduxJS, ES6, MongoDB, HTML, CSS, Firebase\nVersion Control: Git, GitHub\nOther Tools: ThunderClient, Android Studio\nSoft Skills: Communication, Leadership\nExperience:\n\nIIPS Student Portal: 6 months (React, Redux, HTML, CSS, Firebase)\nYhills: 2-month virtual internship (HTML, CSS, JavaScript)\nProjects:\n\nIIPS Student Portal: A platform providing easy access to study materials for students, built using React, Firebase, and Redux. It has over 300 active users.\nNote-Book: A web application developed using ReactJS, Express.js, MongoDB, and Node.js. It provides cloud-based note-taking functionality with user authentication via JWT.\nSuper-Extension (IoT): An IoT-based smart home extension that automates manual appliances using smartphone control and sensor-based activation.\nAnswering Guidelines:\n\nUse clear headings for different sections when responding to more detailed questions.\nWhen explaining projects or experiences, break them down into bullet points for clarity.\nFor any missing details, respond with 'This information is not available in the resume.'.\nStructure long paragraphs into smaller, digestible parts for easy readability.\"\n"},
           ],
         },
         {
           role: "model",
           parts: [
             {text: "## Ashish Rai Resume Details\n\nHere are the answers to your questions based on Ashish Rai's resume.\n\n**What is Ashish Rai's contact information?**\n\n* **Phone:** +91-9691230315\n* **Email:** ashishrair500@gmail.com\n* **Location:** Indore, India\n* **LinkedIn:** LinkedIn Profile\n* **GitHub:** GitHub Profile\n* **Portfolio:** Portfolio\n\n**What is Ashish Rai's educational background?**\n\n* **MTech Integrated (IT):** 8.46 CGPA, International Institute of Professional Studies, DAVV (2020 – 2025)\n* **Higher Secondary:** 90.00%, School of Excellence Jabalpur\n* **High School:** 91.00%, School of Excellence Jabalpur\n\n\n**What technical skills does Ashish Rai possess?**\n\n* **Programming Languages:** Java, JavaScript\n* **Frameworks & Libraries:** ReactJS, ReduxJS, ES6, MongoDB, HTML, CSS, Firebase\n* **Version Control:** Git, GitHub\n* **Other Tools:** ThunderClient, Android Studio\n\n**What are Ashish Rai's soft skills?**\n\n* Communication\n* Leadership\n\n**Describe Ashish Rai's experience.**\n\n* **IIPS Student Portal:** 6 months\n    * Utilized: React, Redux, HTML, CSS, Firebase\n* **Yhills:** 2-month virtual internship\n    * Utilized: HTML, CSS, JavaScript\n\n**Detail Ashish Rai's projects.**\n\n* **IIPS Student Portal:**\n    * A platform providing easy access to study materials for students.\n    * Built using React, Firebase, and Redux.\n    * Has over 300 active users.\n\n* **Note-Book:**\n    * A web application for cloud-based note-taking.\n    * Developed using ReactJS, Express.js, MongoDB, and Node.js.\n    * Features user authentication via JWT.\n\n* **Super-Extension (IoT):**\n    * An IoT-based smart home extension.\n    * Automates manual appliances using smartphone control and sensor-based activation.\n\n\n**What are Ashish Rai's achievements?**\n\n* **Founder and Developer:** IIPS Student Portal.\n* **DSA Problem Solving:** Solved 400+ DSA problems across various coding platforms, including achieving 5-star status in Java on HackerRank.\n* **Project Completion:** Completed 2 personal and 2 team projects in web development (React frontend + backend), IoT, and Android development.\n* **Event Organization:** Organized events like Prayas Sports Event and IoT Workshop at Devi Ahilya University.\n* **NCC Certification:** NCC A certified.\n\n\n**What is Ashish Rai's expected graduation year?**\n\n* 2025\n\n\n**What backend technologies has Ashish Rai used?**\n\n* Express.js, MongoDB, Node.js, Firebase\n\n\n**What specific Android development projects has Ashish Rai worked on?**\n\nThis information is not available in the resume.\n\n\n**What is Ashish Rai's current role?**\n\nFrontend Developer\n"},
           ],
         },
       ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
