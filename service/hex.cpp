//Microservice Project
//Reads a hexcode from a text file, converts it, and sends it back
#include <fstream>
#include <iostream>
#include <cstring>
#include <sys/stat.h>
#include <string>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char **argv, char **envp)
{
	//check if hex file exists
	//stat usage from documentation
	struct stat buffer;
	char file_contents[7];
	std::string file = "color-change.txt";
	
	char hexcode[17] = "0123456789abcdef";
	int	integer[17] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15};
		
	//set up an infinite loop to listen for file changes
	while (true)
	{
		for (int i = 0; i < 7; i++) { file_contents[i] = '\0'; }
		
		if (stat(file.c_str(), &buffer) == 0)
		{
			//if file exists, check its contents every second unless it's empty
			std::ifstream infile;
			std::ofstream outfile;
			bool changed = false;
			int red, green, blue, index;
			std::string color = "";
			
			while (!changed)
			{
				infile.open(file);
				infile >> file_contents;
				
				red = 0;
				green = 0;
				blue = 0;
				
				//std::cout << file_contents << " -- " << color << " strstr: " << strstr(file_contents, color.c_str()) << std::endl;
				
				//if file not empty
				if (strcmp(file_contents, "") != 0 && strstr(color.c_str(), file_contents) == NULL)
				{
					infile.clear();
					infile.close();
					
					color.clear();
					index = 1;
					
					std::cout << "processing" << std::endl;
					//if file contains hexcode
					for (int i = 0; i < 2; i++)
					{
						//std::cout << "red: " << file_contents[i] << " green: " << file_contents[i + 2] << " blue: " << file_contents[i + 4] << std::endl;
						//translate hexcode
						for (int j = 0; j < 17; j++)
						{
							if (file_contents[i] == hexcode[j]) 
							{ 
								if (index != 0) { red += integer[j] * index * 16; }
								else { red += integer[j]; }
							}
							if (file_contents[i + 2] == hexcode[j])
							{
								if (index != 0) { green += integer[j] * index * 16; }
								else { green += integer[j]; }
							}
							if (file_contents[i + 4] == hexcode[j])
							{
								if (index != 0) { blue += integer[j] * index * 16; }
								else { blue += integer[j]; }
							}
						}
						index--;
					}
					
					color.append(std::to_string(red));
					color.append(" ");
					color.append(std::to_string(green));
					color.append(" ");
					color.append(std::to_string(blue));
					
					outfile.open(file);
					outfile.clear();
					outfile << color;
					outfile.close();
					for (int i = 0; i < 7; i++) { file_contents[i] = '\0'; }
					sleep(3);
				}
				else { infile.close(); std::cout << "waiting " << std::endl; sleep(1); } //otherwise sleep for one second
			}
			changed = false;
		}
	}
}