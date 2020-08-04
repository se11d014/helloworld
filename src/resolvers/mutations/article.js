const projectMutations = {
  createArticle (root, args, { req, prisma }) {
    let userId = null
    if (req.user) {
      userId = req.user.id
    }
    return prisma.createArticle({ ...args, userId: userId })
  },
  updateArticle (root, { id, ...args }, { prisma }) {
    return prisma.updateArticle({ 
      where: { id: id},
      data: { ...args }
    })
  },
  deleteArticle (root, { id }, { prisma }) {
    return prisma.deleteArticle({ id: id })
  }
}

module.exports = projectMutations