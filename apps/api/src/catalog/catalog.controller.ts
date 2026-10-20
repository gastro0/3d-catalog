import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  AuthenticatedRequest,
  SupabaseJwtGuard,
} from '../auth/guards/supabase-jwt.guard';
import { CatalogService } from './catalog.service';

@Controller('models')
@ApiTags('models')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  findAll() {
    return this.catalog.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalog.findOne(id);
  }

  @Get(':id/download')
  download(@Param('id') id: string) {
    return this.catalog.download(id);
  }

  @Post()
  @UseGuards(SupabaseJwtGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'name', 'category'],
      properties: {
        file: { type: 'string', format: 'binary' },
        name: { type: 'string', maxLength: 120 },
        description: { type: 'string', maxLength: 5000 },
        category: { type: 'string' },
        polygons: { type: 'integer', minimum: 0 },
      },
    },
  })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Record<string, unknown>,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.catalog.create(file, body, request.user.id);
  }

  @Delete(':id')
  @UseGuards(SupabaseJwtGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.catalog.remove(id, request.user.id);
  }
}
