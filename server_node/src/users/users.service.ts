import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { BoardsService } from '../boards/boards.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => BoardsService))
    private readonly boardService: BoardsService,
  ) {}

  async createAndReturn(
    createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const { username, name, email, password } = createUserDto;
    let user = await this.findOneByUsername(username);
    if (user) {
      throw new ConflictException('User already exists');
    }
    user = await this.userRepository.create(createUserDto);
    return this.toReturn(await this.userRepository.save(user));
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ username: username });
  }

  async findOneByUsernameAndReturn(username: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ username: username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toReturn(user);
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.update(user.id, updateUserDto);
  }

  async remove(username: string) {
    await this.findOneByUsername(username).then(async (user) => {
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      await this.boardService.removeAll(username).then(async () => {
        // await this.boardService.updateTeamMembers(username).then(async () => {
        await this.userRepository.delete(user.id);
        // });
      });
    });
  }

  toReturn(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    };
  }
}
