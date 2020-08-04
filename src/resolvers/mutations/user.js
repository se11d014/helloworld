const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userMutations = {
  createUser: async (root, args, { prisma }) => {
    const user = await prisma.user({ email: args.email })

    if (user) {
      throw new Error("Duplicated email")
    }

    const hashPassword = await bcrypt.hash(args.password, 10)

    return prisma.createUser({ ...args, password: hashPassword })
  },
  updateUser: async (root, { id, ...args }, { prisma }) => {
    const user = await prisma.users({ 
      where: { email: args.email, id_not: id },
    })

    if (user.length > 0) {
      throw new Error("Duplicated email")
    }
    const hashPassword = await bcrypt.hash(args.password, 10)

    return prisma.updateUser({ 
      where: { id: id},
      data: { ...args, password: hashPassword }
    })
  },
  deleteUser (root, { id }, { prisma }) {
    return prisma.deleteUser({ id: id })
  },
  register: async (root, { email, password }, { prisma }) => {
    const user = await prisma.user({ email: email })

    if (user) {
      throw new Error("Duplicated email")
    }

    const hashPassword = await bcrypt.hash(password, 10)
    return prisma.createUser({ email: email, password: hashPassword })
  },
  login: async (root, { email, password }, { res, prisma }) => {
    const user = await prisma.user({ email: email })

    if (!user) {
      throw new Error("Invalid login")
    }

    const comparePassword = await bcrypt.compare(password, user.password)

    if(!comparePassword) {
      throw new Error("Invalid login")
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      'login-secret',
      {
        expiresIn: '1d'
      }
    )

    const oneDay = 1 * 24 * 3600 * 1000; // 1 day

    const option = {
      httpOnly: true,
      maxAge: oneDay,
      secure: false
    }

    res.cookie('auth-token', token, option)

    return { token, user }
  },
  logout (root, args, { res }) {
    res.clearCookie('auth-token')
    return 'loggedout'
  }
}

module.exports = userMutations