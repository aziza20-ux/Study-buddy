# Study Buddy Application

This application is a study tool designed to help users review topics, find homework hints, test their knowledge with flashcards and multiple-choice quizzes, and browse the internet for study materials.

## Features

-   **Topic Review:** Select a subject (Math, Science, History, Geography) and get a brief overview.
-   **Homework Hints:** Input a question and receive helpful study tips.
-   **Flashcards:** Review key terms and concepts with interactive flashcards.
-   **Multiple Choice Quizzes:** Test your knowledge with dynamically generated quizzes.
-   **Internet Browsing:** Search Google directly within the application.

## Technologies Used

-   **HTML:** Structure of the web application.
-   **CSS:** Styling for the user interface.
-   **JavaScript (ES Modules):** Application logic and interactivity.
-   **External APIs:**
    -   **Open Trivia Database (opentdb.com):** For multiple-choice questions. [API Documentation](https://opentdb.com/api_docs.php)
    -   **Google Search API (RapidAPI):** For internet search functionality. [RapidAPI Google Search API](https://rapidapi.com/apigeek/api/google-search74/)

## Local Setup

1.  **Clone the Repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```
2.  **Open `index.html` in your web browser.**

# Part Two: Application Deployment and Load Balancing

This document outlines the deployment process of our application onto two web servers (Web01 and Web02) and the configuration of a load balancer (Lb01) to distribute traffic between them.

## Deployment Steps

### 1. Application Deployment to Web Servers (Web01 and Web02)

The application was deployed to both Web01 and Web02 using the following steps:

1.  **Transfer Application Files:**
    * The application files were transferred to the `/var/www/html/` directory on both Web01 and Web02 using `scp` or a similar file transfer method.
    * Example: `$ scp -r <application_directory> user@Web01:/var/www/html/`
    * Example: `$ scp -r <application_directory> user@Web02:/var/www/html/`

3.  **Configure Web Server:**
    * The web server (e.g., Apache, Nginx) was configured to serve the application files from the `/var/www/html/` directory.
    * For Apache, the virtual host configuration was adjusted in `/etc/apache2/sites-available/`.
    * For Nginx, the server block configuration was adjusted in `/etc/nginx/sites-available/`.
    * Ensure the web server is configured to correctly interpret and serve the application's files (e.g., PHP scripts, static assets).

4.  **Restart Web Server:**
    * The web server was restarted to apply the configuration changes.
    * Example (Apache): `$ sudo systemctl restart apache2`
    * Example (Nginx): `$ sudo systemctl restart nginx`

5.  **Verify Application on Individual Servers:**
    * The application was accessed directly via the IP addresses of Web01 and Web02 to ensure it was functioning correctly on each server.
    * Example: `http://<Web01_IP_Address>` and `http://<Web02_IP_Address>`

### 2. Load Balancer (Lb01) Configuration

The load balancer (Lb01) was configured to distribute traffic between Web01 and Web02 using the following steps:

1.  **Install and Configure Load Balancer Software:**
    * A load balancer software like HAProxy or Nginx was installed on Lb01.
    * For HAProxy, the configuration was done in `/etc/haproxy/haproxy.cfg`.
    * For Nginx, the configuration was done in `/etc/nginx/nginx.conf` or a separate configuration file in `/etc/nginx/sites-available/`.

2.  **Configure Backend Servers:**
    * The configuration file was edited to define the backend servers (Web01 and Web02) and their respective IP addresses and ports.
    * Example HAProxy configuration:
        ```
        frontend http-in
            bind *:80
            bind *:443 ssl crt /etc/letsencrypt/live/www.aziza24.tech/ca.pem
        mode http
            default_backend servers

        backend servers
            balance roundrobin
            server web01 <Web01_IP_Address>:80 check
            server web02 <Web02_IP_Address>:80 check
        ```
    * Example Nginx configuration:
        ```
        http {
            upstream backend {
                server <Web01_IP_Address>:80;
                server <Web02_IP_Address>:80;
            }

            server {
                listen 80;
                location / {
                    proxy_pass http://backend;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection 'upgrade';
                    proxy_set_header Host $host;
                    proxy_cache_bypass $http_upgrade;
                }
            }
        }
        ```
    * The `balance roundrobin` directive ensures that traffic is distributed evenly between the servers. The `check` directive in HAProxy enables health checks.

3.  **Restart Load Balancer:**
    * The load balancer service was restarted to apply the configuration changes.
    * Example (HAProxy): `$ sudo systemctl restart haproxy`
    * Example (Nginx): `$ sudo systemctl restart nginx`

### 3. Testing and Verification

The following tests were performed to verify the deployment and load balancing:

1.  **Access Application via Load Balancer:**
    * The application was accessed via the IP address of Lb01: `http://<Lb01_IP_Address>`.

2.  **Verify Load Balancing:**
    * Multiple requests were made to the application via the load balancer's address.
    * Tools like `curl` or browser developer tools were used to observe the server handling each request.
    * The server logs on Web01 and Web02 were monitored to ensure that traffic was being distributed evenly between the two servers.
    * The load balancer's statistics page (if available) was used to monitor the distribution of traffic and server health.

3.  **Simulate Server Failure:**
    * One of the web servers (Web01 or Web02) was temporarily taken offline to simulate a failure.
    * Requests were sent to the application via the load balancer to verify that the application remained accessible and that traffic was routed to the remaining online server.
    * The failed server was then brought back online, and the load balancer was verified to resume distributing traffic to it.

4.  **Performance Testing:**
    * Tools like `ab` (ApacheBench) or `wrk` were used to perform load testing and ensure the application's performance remained consistent under increased traffic.

By following these steps, we successfully deployed our application to two web servers and configured a load balancer to ensure high availability, scalability, and seamless user experience.
