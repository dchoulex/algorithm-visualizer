#! /bin/bash
cp /var/www/algorithmVisualizer/algorithmVisualizer.service /etc/systemd/system
##add exceutable permissions to express app
sudo chmod +x /var/www/algorithmVisualizer/server.js
##Allows any users to write the app folder. Useful if using fs within the app
sudo chmod go+w /var/www/algorithmVisualizer
##Launches the express app
sudo systemctl daemon-reload
sudo systemctl start algorithmVisualizer
sudo systemctl enable algorithmVisualizer