const queries = require('./queries/index')
const mutations = require('./mutations/index')

const resolvers = {
  Query: {
    ...queries
  },
  Mutation: {
    ...mutations
  },
  User: {
    articles (root, args, { prisma }) {
      return prisma.user({ id: root.id }).articles({ })
    }
  },
  Article: {
    user (root, args, { prisma }) {
      if (root.userId) {
        return prisma.user({ id: root.userId })
      }
      return null
    }
  },
}

module.exports = resolvers