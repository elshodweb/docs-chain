import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { HistorySchema } from '../../schemas/history.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';
import { RecordActionDto } from './dto/record-action.dto';

@ApiTags('history')
@Controller('history')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post('record')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a document action' })
  @ApiBody({ type: RecordActionDto })
  @ApiResponse({
    status: 201,
    description: 'Action recorded successfully',
    type: HistorySchema,
  })
  async recordAction(
    @Body() recordActionDto: RecordActionDto,
    @Request() req,
  ): Promise<HistorySchema> {
    return this.historyService.recordAction(
      recordActionDto.documentId,
      req.user.id,
      recordActionDto.action,
    );
  }

  @Get('document/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get document history' })
  @ApiParam({
    name: 'id',
    description: 'Document ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Return document history',
    type: [HistorySchema],
  })
  async getDocumentHistory(
    @Param('id') id: string,
    @Request() req,
  ): Promise<HistorySchema[]> {
    return this.historyService.getDocumentHistory(id);
  }

  @Get('user')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get user history' })
  @ApiResponse({
    status: 200,
    description: 'Return user history',
    type: [HistorySchema],
  })
  async getUserHistory(@Request() req): Promise<HistorySchema[]> {
    return this.historyService.getUserHistory(req.user.id);
  }

  @Post('verify/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify document history' })
  @ApiParam({
    name: 'id',
    description: 'Document ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Return verification result',
    type: Boolean,
  })
  async verifyHistory(@Param('id') id: string): Promise<boolean> {
    return this.historyService.verifyHistory(id);
  }
}
