import { Controller, Get } from '@nestjs/common'
import { Public } from '@/infra/auth/public'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('health')
@Controller('/health')
@Public()
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' }
  }
}
