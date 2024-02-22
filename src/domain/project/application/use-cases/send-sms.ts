import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface SendSmsUseCaseRequest {
  url: string
  token: string
  code: string
  phone: string
}

type SendSmsUseCaseResponse = Either<null, null>

@Injectable()
export class SendSmsUseCase {
  async execute({
    url,
    token,
    code,
    phone,
  }: SendSmsUseCaseRequest): Promise<SendSmsUseCaseResponse> {
    const message = `Seu código de verificação na Esportes da Sorte é: ${code}`

    const payload = {
      numero: phone,
      servico: 'short',
      mensagem: message,
      codificacao: '8',
    }
    try {
      const response = await fetch(url, {
        method: 'post',
        headers: new Headers({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.error(
          `Erro na requisição: ${response.status} - ${response.statusText}`,
        )
      } else {
        const responseData = await response.json()
        console.log('Resposta bem-sucedida:', responseData)
      }
    } catch (error) {
      console.error('Erro durante a solicitação:', error)
    }

    return right(null)
  }
}
