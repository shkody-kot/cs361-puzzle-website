# CS361-Microservice
Microservice for sending and receiving images through python socket.

Process to request data:
1. Connect to socket and send message with the line "Profile Request"
2. Microservice will receive line and open file dialogue box for user.

Process to receive data:
1. After sending "Profile Request", wait for user to select photos. Once they have, a response will be send through the socket.
2. The first line given by the socket will be the number of images that the socket is sending.
3. The next lines will be the file paths to those images.
![image](https://user-images.githubusercontent.com/92469515/220484168-caf95bdf-fd09-43f9-8a51-b0961982442b.png)
