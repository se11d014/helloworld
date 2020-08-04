const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')
const resolvers = require('./resolvers/index')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const corsOptions = {
  credentials: true,
  origin: 'http://localhost:4000'
}

const currentUser = async (resolve, root, args, context, info) => {
  let token = context.req.cookies['auth-token']
  if (token) {
    const user = jwt.verify(token, 'login-secret')
    context.req.user = user
  }
  const result = await resolve(root, args, context, info)
  return result
}

const server = new GraphQLServer({
  typeDefs: './src/schema/schema.graphql',
  resolvers,
  context: ({ request, response }) => ({
    req: request,
    res: response,
    prisma,
  }),
  middlewares: [currentUser]
})

server.express.use(cookieParser())
server.express.use(cors(corsOptions))

server.start(() => console.log('Server is running on http://localhost:4000'))