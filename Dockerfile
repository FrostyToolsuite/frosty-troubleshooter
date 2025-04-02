FROM denoland/deno

EXPOSE $PORT

WORKDIR /app

ADD . /app

CMD ["run", "--allow-net", "--allow-env", "main.ts"]