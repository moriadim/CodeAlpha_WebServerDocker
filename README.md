🧠 MarkIt – A Simple Markdown Notes App
Hey! 👋

This is MarkIt, a minimal markdown note-taking app I built as part of Task 4 of the CodeAlpha DevOps Internship.

The idea was simple:
Build a cool little app → Dockerize it → Deploy it to the cloud.
And that’s exactly what I did. ✅

🚀 What MarkIt Does
MarkIt is a web app that lets you:

Write notes using Markdown

See a live preview of your content

Keep everything local to your browser (no login, no backend, just fast + simple)

It's great for writers, developers, or anyone who loves Markdown.

🛠 What I Used
Next.js – for building the frontend

Docker – to containerize the app

Google Cloud (Compute Engine) – to host it live

🐳 How to Run It (Locally with Docker)
If you want to try it out on your own machine:

bash
Copier
Modifier
git clone https://github.com/moriadim/CodeAlpha_WebServerDocker.git
cd CodeAlpha_WebServerDocker

# Build the image
docker build -t markit-nextjs .

# Run it
docker run -d -p 3000:3000 markit-nextjs
Then open your browser and go to:
👉 http://localhost:3000

🌐 Live Demo
You can check out the live version of the app here (hosted on a GCP VM):

👉 http://34.145.50.127


🙋‍♂️ About Me
Merzougui Abdellah El Ghazali
Intern at CodeAlpha | Passionate about web development, cloud, and DevOps
👉 github.com/moriadim

🏁 Final Thoughts
This task was a great opportunity to connect frontend development with DevOps and cloud hosting.
I learned a lot building, Dockerizing, and deploying MarkIt — and I’m excited to keep exploring!

Thanks to CodeAlpha for the opportunity! 🙌