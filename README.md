<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/MatthewPress/travel-tracker">
    <img src="./src/images/pilgram-logo.png" alt="Logo" width="80" height="80"> 
  </a>

<!-- HEADER -->
  <h3 align="center">Pilgram</h3>
  <p align="center">
    A Travel Tracker Web Application
    <br />
    <a href="https://github.com/MatthewPress/travel-tracker"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Visit the Deployed Site »</strong></a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#setup">Setup</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#notes">Notes</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

[![Pilgram Demo][product-demo]](./src/images/pilgram-demo.gif)

This is a web application built for a travel agency and its customers to book trips and track their past, future, and pending trips. It was created for the Turing School of Software and Design's Module 2 final solo project. The overall goal was to demonstrate what we have learned after 3 months in the program.

The project specs can be found [here](https://frontend.turing.edu/projects/travel-tracker.html).

### Built With

* ![JavaScript][JavaScript-shield]
* ![CSS][CSS-shield]
* ![HTML5][HTML-shield]
* ![Mocha][Mocha-shield]
* ![Chai][Chai-shield]
* ![NPM][NPM-shield]
* ![DayJS][DayJS-shield]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Setup

- Option 1: Visit the deployed site
- Option 2: 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Traveler login information
- Username: traveler50 (or any number between 1-50)
- Password: travel

[![Book Trip Demo][book-trip-demo]](./src/images/book-trip-demo.gif)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Notes

I have worked on this project for roughly a week. In developing the project, I adhered to TDD and OOP principles and considered UI/UX in the design. 

Network requests are made with the fetch API. Error handling has been added in the event that the server is down and form data is being validated to ensure usable, safe data is being sent to the server.

### Functionality includes...
- Validating the user login information
- Getting the user's profile information and trips from a server
- Allowing the user to create a new trip and sending the trip data back to the server
- Calculating a trip's estimated cost
- Calculating a user's trip expenses for all trips in the current year

### Wins:

* I like how quickly the project came together and I didn't feel like I got hung up on anything for too long. This could also be bad because it means I didn't get out of my comfort zone, but since the goal of this project was to demonstrate what I already know about front-end development, I'm not too concerned. 

### Challenges:

* Trying to decide what methods each class should have was a puzzler. I'm still not sure if I properly split behavior between the class methods and the functions in the main scripts file (scripts.js).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Add a way for an Admin to login, view information about travelers, and modify their trips or the destinations the travelers can choose.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Matthew Press | [![LinkedIn][linkedin-shield]][linkedin-url] | [![GMail][gmail-shield]][gmail-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[product-demo]: ./src/images/pilgram-demo.gif
[book-trip-demo]: ./src/images/book-trip-demo.gif

[JavaScript-shield]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[CSS-shield]: https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[HTML-shield]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[Mocha-shield]: https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=Mocha&logoColor=white
[Chai-shield]: https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=chai&logoColor=white
[NPM-shield]: https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white
[DayJS-shield]: https://img.shields.io/badge/-DayJS-green?style=for-the-badge&logo=DayJS&logoColor=white

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/matthew-press-813961246/
[gmail-shield]: https://img.shields.io/badge/Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white
[gmail-url]: mailto:press.matt14@gmail.com