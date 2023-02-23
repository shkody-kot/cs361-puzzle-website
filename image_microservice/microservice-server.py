import os
import tkinter as tk 
from tkinter import filedialog 

import asyncio
from websockets import serve

HOST = "127.0.0.1" 
PORT = 62313

if os.environ.get('DISPLAY','') == '':
    print('no display found. Using :0.0')
    os.environ.__setitem__('DISPLAY', ':0.0')

#create the websocket server
async def echo(websocket):
    async for message in websocket:
        if message == "Image Request":
            root = tk.Tk() 
            root.withdraw()
            root.attributes("-topmost", True)
            filePaths = filedialog.askopenfilenames() 
            fileList = list(filePaths)
            # send the number of images in the list, so client knows what they will receive
            #(avoids multiple images being sent in the same line)
            print("Sending " + fileList[0])
            image = fileList[0].encode()
            print("Connecion closed")
            
            await websocket.send(image)
        else: 
            await websocket.send(":)".encode())

async def main():
    async with serve(echo, HOST, PORT):
        await asyncio.Future() #run forever

asyncio.run(main())

'''
# print statements are there for debugging/visibility purposes
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    while True:
        # listen for connections and accept
        s.listen(1)
        conn, addr = s.accept()
        print(f"Connected by {addr}")
        data = conn.recv(2048)
        print(data)
        data = conn.recv(2048)
        # break if there's no connection sending data
        if not data:
            continue
        # if a profile request is sent, open the file dialogue window and send the images
        if (data):
            root = tk.Tk() 
            root.withdraw()
            root.attributes("-topmost", True)
            filePaths = filedialog.askopenfilenames() 
            fileList = list(filePaths)
            # send the number of images in the list, so client knows what they will receive
            #conn.sendall(str(len(fileList)).encode())
            #data = conn.recv(1024);
            for file in fileList:
                # send each image, waiting for client response before sending the next 
                #(avoids multiple images being sent in the same line)
                print("Sending " + file)
                conn.sendall((file.encode()))
            conn.close()
            print("Connecion closed")
            
            if (data.decode() == "Number Received"):
            for file in fileList:
                # send each image, waiting for client response before sending the next 
                #(avoids multiple images being sent in the same line)
                print("Sending " + file)
                conn.sendall((file.encode()))
                data = conn.recv(1024);'''
 
                
