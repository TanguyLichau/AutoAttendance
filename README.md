# AutoAttendance

Thank you [Sacha](https://github.com/Sacha924) for contributing and helping with the project.

This project is a simple JS project using Puppeteer. The goal is to mark yourself as present automatically.

First we connect to the attendance platform to receive the authentification cookies. We also grab the schedule and the corresponding class_ids.

We then wait for the start of the class to try and mark the student present. If the request is not conclusive we wait a certain amount of time before trying again. When the request finaly goes through we can exit the loop and wait for the next class to start.  
When all the classes are done, the program stops.

---

## Requirements

You need to modify the .env.example file and fill it with your current credentials for the [leonard-de-vinci](https://www.leonard-de-vinci.net) site.

## Installation

    git clone https://github.com/TanguyLichau/AutoAttendance.git
    cd AutoAttendance
    npm install

After installation you can run the project with

```
node index.js
```
