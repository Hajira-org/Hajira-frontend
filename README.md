![Vercel Deploy](https://deploy-badge.vercel.app/vercel/hajira-org?name=Hajira.org%2Fvercel)
![Netlify Deploy](http://img.shields.io/netlify/0868acae-7f5d-4997-af37-dce357af9582?logo=netlify&label=Hajira%2Fnetlify)
[![Auto Changelog](https://github.com/Hajira-org/Hajira-frontend/actions/workflows/changelog.yml/badge.svg)](https://github.com/Hajira-org/Hajira-frontend/actions/workflows/changelog.yml)
#  Hajira — A local Micro-Job Platform

Hajira is an African **community-driven micro-job platform** where people can post or claim small, hyperlocal jobs (e.g., deliveries, tutoring, translation, repairs).  
The platform focuses on **trust, safety, and accessibility** while enabling secure, small-scale transactions. 

For the live site visit //http://hajira-org.vercel.app/ if the link isnt working, it may be due to downtimes visit http://hajira-org.netlify.app/ 

## Our Vision
- Empower local communities through micro-jobs  
- Provide quick, reliable, and verified services  
- Support individuals in finding work or helpers instantly  

## Tech Stack
- **Frontend:** React / Next.js, Tailwind CSS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Authentication:** JWT / (Google login planned)
- **Real Time Communication**: Socket.io 
- **Hosting:** Netlify and vercel.
- **Maps:** Leaflet.js (locator system )( Google Maps API Planned for when scaling the application)  

## Screenshots

Hajira's Landing Page.


![Landing](https://github.com/user-attachments/assets/4a752e1b-ef9b-4c65-8777-9ff3e84853b1)

---

Sign in page.


![signin](https://github.com/user-attachments/assets/d0f29bd5-ff00-413c-a88e-b29855cbbfba)

---

Job posters dashboard showing "My jobs"


![myjobs](https://github.com/user-attachments/assets/14e4050e-d41a-47c6-ba1b-83de8783c47c)


---
Job Seeker's Dashboard Showing All available Jobs in a map view. (The map view may be inacurate due to usage of openmaps api, google maps API couldnt be used untill the application is scaled further and enough funds for the API are raised).


![seekerlocations](https://github.com/user-attachments/assets/36ab989a-f7e4-47fa-9b1c-c406272933af)


---

Hajira AI developed by prompting groq AI to follow the given parameters, tweaked to also fetch job data from the database which is isolated from the users therefore ensuring privacy, for more details on the backend structure follow this !link[https://www.github.com/hajira-org/hajira-backend]

![AI](https://github.com/user-attachments/assets/baa0c40f-56a8-4767-88b8-fbbe69b46273)


---

##  Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.


##  License
[MIT License](LICENSE)

##  Changelog
All notable changes are documented in the [CHANGELOG.md](./CHANGELOG.md).
