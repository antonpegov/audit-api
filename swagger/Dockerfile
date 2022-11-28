FROM nginx

WORKDIR /usr/share/nginx/html

COPY ./swagger .

COPY ./swagger/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]