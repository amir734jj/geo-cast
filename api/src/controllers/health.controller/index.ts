import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  type HealthCheckResult,
  TypeOrmHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator
} from '@nestjs/terminus';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor (
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  @ApiOkResponse({
    description: 'Successfully returned health response'
  })
  async check (): Promise<HealthCheckResult> {
    return await this.health.check([
      async () => await this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      async () => await this.db.pingCheck('database'),
      async () =>
        await this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
      async () => await this.memory.checkHeap('memory_heap', 150 * 1024 * 1024)
    ]);
  }
}
