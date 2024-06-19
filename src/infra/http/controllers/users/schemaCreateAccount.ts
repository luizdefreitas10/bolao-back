import { differenceInYears } from 'date-fns'
import { z } from 'zod'
export const createAccountBodySchema = z.object({
  fullName: z.string(),
  birthdate: z.coerce
    .date()
    .refine((date) => differenceInYears(new Date(), date) >= 14, {
      message: 'Usuário deve ter no mínimo 14 anos.',
    }),
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
