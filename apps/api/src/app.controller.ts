import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SupabaseService } from './supabase/supabase.service';

@Controller()
@ApiTags('health')
export class AppController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get(['', 'health'])
  health() {
    return { status: 'ok', storageConfigured: this.supabase.isConfigured };
  }
}
