FROM node:10.16

COPY docker/.npmrc /root/.npmrc

RUN npm install --unsafe-perm --global @microverse-network/tracker

ENTRYPOINT ["microverse-tracker"]

EXPOSE 80
