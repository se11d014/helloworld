const projectQueries = {
  articleDetail (root, { id }, { prisma }) {
    return prisma.article({ id: id })
  },
  articles (root, args, { prisma }) {
    return prisma.articles({ where: { } })
  }
}

module.exports = projectQueries