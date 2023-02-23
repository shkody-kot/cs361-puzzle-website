import socket

HOST = "127.0.0.1" 
PORT = 62313

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    # connect to server
    s.connect((HOST, PORT))
    # send request for images and wait for response
    s.sendall(b"Image Request")
    # receive number of images and send confirmation
    numImages = s.recv(1024)
    print(numImages.decode())
    s.sendall(b"Number Received")
    # receive images, sending confirmation after each
    for i in range(int(numImages)):
        data = s.recv(1024)
        print(data.decode())
        s.sendall(b"Image Received")
   
