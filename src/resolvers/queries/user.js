const { prisma } = require("../../generated/prisma-client")

const userQueries = {
  userDetail (root, { id }, { prisma }) {
    return prisma.user({ id: id })
  },
  users (root, args, { prisma }) {
    return prisma.users({ where: { } })
  },
  currentUser (root, args, { req }) {
    if (req.user) {
      return prisma.user({ id: req.user.id })
    }
    return null
  }
}

module.exports = userQueries