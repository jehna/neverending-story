import Koa from "koa"
import koaStatic from "koa-static"

const app = new Koa()
app.use(koaStatic("public"))

app.listen(process.env.PORT)
