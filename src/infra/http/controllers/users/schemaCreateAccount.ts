import { z } from 'zod'
export const createAccountBodySchema = z.object({
  fullName: z.string(),
  userName: z.string(),
  phone: z.string().refine(
    (telefone) => {
      const regex =
        // eslint-disable-next-line no-useless-escape
        /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/
      return regex.test(telefone)
    },
    {
      message: 'Formato inválido para número de telefone.',
    },
  ),
  password: z.string(),
  email: z.string().email().optional(),
})
