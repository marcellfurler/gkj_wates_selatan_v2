#FROM nginx:alpine

#RUN rm -rf /usr/share/nginx/html/*
#COPY dist /usr/share/nginx/html

#EXPOSE 80

FROM nginx:alpine

# hapus config default nginx
RUN rm /etc/nginx/conf.d/default.conf

# copy config SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy hasil build react
RUN rm -rf /usr/share/nginx/html/*
COPY dist /usr/share/nginx/html

EXPOSE 80

