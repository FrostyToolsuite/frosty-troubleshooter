FROM denoland/deno

EXPOSE $PORT

WORKDIR /app

ADD . /app

ENTRYPOINT ["run", "--node-modules-dir=auto", "--allow-net", "--allow-env", "main.ts"]