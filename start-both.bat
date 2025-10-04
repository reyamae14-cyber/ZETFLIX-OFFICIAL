@echo off
echo Starting Movies Website...

echo Starting server...
cd server
start "Server" cmd /k "node working-server.js"
cd ..

echo Waiting 5 seconds for server to start...
timeout /t 5 /nobreak

echo Starting client...
cd client
start "Client" cmd /k "npm start"
cd ..

echo Both server and client are starting...
echo Server should be at: http://localhost:5000
echo Client should be at: http://localhost:3000
pause