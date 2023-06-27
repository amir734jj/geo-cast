import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  HttpStatus,
  UploadedFile,
  ParseFilePipeBuilder,
  Param,
  UseInterceptors,
  StreamableFile,
  Header,
  Query, ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import CreatePostDto, {CreatePostDtoType} from 'src/dto/create.post.dto';
import bytes from 'bytes';
import BoardService from 'src/services/board.service';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import RecordingPost from 'src/models/post.model';
import {FileInterceptor} from '@nestjs/platform-express';
import {FormDataBody, FormDataDtoValidator} from 'src/decorators/form-data.decorator';
import CreateUserDto from 'src/dto/create.user.dto';
import {TypeTransformer} from 'src/decorators/type-transformer.decorator';
import QueryPostDto from "../dto/query.post.dto";

@ApiTags('board')
@Controller('board')
@ApiBearerAuth()
export default class BoardController {
  constructor(private readonly boardService: BoardService) {
  }

  @Get('download/:recordingId')
  @ApiOkResponse({
    description: 'Successfully returned the recording file',
    type: StreamableFile
  })
  @ApiBadRequestResponse({description: 'Bad request.'})
  @Header('Cache-Control', 'none')
  @Header('Content-Disposition', 'attachment; filename=voice.wav')
  async download(@Param('recordingId') recordingId: string) {
    const {readable} = await this.boardService.downloadRecording(recordingId)
    return new StreamableFile(readable);
  }

  @Get('query')
  @ApiOkResponse({
    description: 'Successfully queried posts',
    type: RecordingPost,
    isArray: true
  })
  @ApiBadRequestResponse({description: 'Bad request.'})
  async query(@Query() query: QueryPostDto): Promise<RecordingPost[]> {
    return this.boardService.query(query.count, query.page, {longitude: query.longitude, latitude: query.latitude});
  }

  @UseGuards(JwtAuthGuard)
  @Post('like/:postId')
  @ApiOkResponse({
    description: 'Successfully liked the post',
    type: RecordingPost
  })
  @ApiBadRequestResponse({description: 'Bad request.'})
  async like(@Param('id') postId: number, @Request() req): Promise<RecordingPost> {
    return await this.boardService.like(req.user, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unlike/:postId')
  @ApiOkResponse({
    description: 'Successfully unlike the post',
    type: RecordingPost
  })
  @ApiBadRequestResponse({description: 'Bad request.'})
  async unlike(@Param('id') postId: number, @Request() req): Promise<RecordingPost> {
    return await this.boardService.unlike(req.user, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('recording')
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Successfully unlike the post',
    type: CreatePostDto
  })
  @UseInterceptors(FileInterceptor('file'))
  @FormDataDtoValidator()
  async createPost(
    @FormDataBody(CreateUserDto)
    @Body(new TypeTransformer(CreatePostDto)) post: CreatePostDtoType,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: bytes("5mb")
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true
        }),
    )
      recording: Express.Multer.File,
    @Request() req
  ): Promise<RecordingPost> {
    return await this.boardService.createPost(req.user, post, recording);
  }
}
