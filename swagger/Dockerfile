FROM nginx

WORKDIR /usr/share/nginx/html

RUN mkdir -p /usr/share/nginx/html/files
RUN chmod a+rwx /usr/share/nginx/html/files

COPY ./swagger .
COPY ./swagger/nginx.conf /etc/nginx/conf.d/default.conf


CMD ["./copy-reports.sh"]
CMD ["nginx", "-g", "daemon off;"]