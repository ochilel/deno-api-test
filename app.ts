import { Application, isHttpError } from 'https://deno.land/x/oak/mod.ts';
import router from './router.ts';
import { HOST, PORT } from './config/config.ts';

const app = new Application();

app.use(async (context, next) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      switch (err.status) {
        case 404:
          context.response.status = 404;
          context.response.body = { msg: 'Not found' };
          break;
        default:
          context.response.status = 400;
          context.response.body = { msg: 'Request can not be processed' };
      }
    } else {
      context.response.status = 500;
      context.response.body = { msg: 'Something went wrong' };
    }
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on port: ${PORT}`);

await app.listen(`${HOST}:${PORT}`);
