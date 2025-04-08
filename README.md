##PROJECT OVERVIEW

This project integrates the Spotify Web API to allow users to conduct a search for musical artists, albums, and songs. There will be both a front end and back end function to this project. We will use JSON web tokens to allow users to login safely to their account to perform these search features.

##PREREQUISITES

NodeJS >= v22.x
Yarn >= 1.22.19
npm >= 11.2.0
Brew >= 4.4.28 (if MacOS)
MySQL Server >=
Chrome/Firefox/Safari/Edge >= latest 2 major versions

##GETTING STARTED

--Setup your environment variables in the .env file.

--Install yarn globally and make sure your node_modules have loaded.

--You will need to open two separate bash sessions, one for the front end and one for the back end.

##LINKS

http://localhost:8000 - Link to the front end, the primary user interface for the Spotify application
http://localhost:8001 - Link to the backend API.
http://localhost:8001/spotify/v1 - Link tot he Spotify API middleware.
http://localhost:8001/spotify/v1/status - Endpoint to check JWT status.
http://localhost:8001/spotify/v1/login - Endpoint to request new JWT from Spotify through the authorization workflow.
http://localhost:8001/spotify/v1/search - Endpoint for general/global search through Spotify with a JSON web response.