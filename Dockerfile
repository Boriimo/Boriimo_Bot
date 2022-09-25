FROM aquabotwa/sanuwa-official:md-beta

RUN git clone https://github.com/Boriimo/Boriimo_Bot /root/boriimo
WORKDIR /root/boriimo/
ENV TZ=Europe/Istanbul
RUN yarn add supervisor -g
RUN yarn install --no-audit

CMD ["node", "index.js"]
