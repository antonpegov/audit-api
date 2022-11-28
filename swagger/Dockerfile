FROM nginx

WORKDIR /usr/share/nginx/html

RUN mkdir -p /usr/share/nginx/html/files
RUN chmod a+rwx /usr/share/nginx/html/files

COPY ./swagger/index.html .
COPY ./swagger/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./swagger/start.sh .

RUN chmod a+rx ./start.sh

ENTRYPOINT [ "./start.sh" ]