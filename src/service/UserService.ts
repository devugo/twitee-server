import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user-dto';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../dto/jwt-payload';
import { JWT_EXPIRE_DURATION, JWT_SECRET } from '../config';
import { emailTransporter } from '../helper/email-transporter';

export class UserService {
  private userRepository = getRepository(User);

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const name = email.split('@')[0];

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
      const user = this.userRepository.create({
        email,
        password: hashPassword,
        name,
      });
      await this.userRepository.save(user);
      // Send Email
      this.sendOnBoardingEmail(email);
      return await this.getOne(email);
    } catch (err) {
      throw err;
    }
  }

  async login(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    try {
      const user = await this.userRepository.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        const payload: JwtPayload = { email };
        const accessToken = await jwt.sign(payload, JWT_SECRET, {
          expiresIn: JWT_EXPIRE_DURATION,
        });
        return {
          accessToken,
          email: user.email,
          name: user.name,
          id: user.id,
        };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      throw err;
    }
  }

  async retain(email: string) {
    try {
      const user = await this.userRepository.findOne({ email });
      if (user) {
        return {
          email: user.email,
          name: user.name,
          id: user.id,
        };
      } else {
        throw new Error('Not Found');
      }
    } catch (err) {
      throw err;
    }
  }

  async getOne(email: string) {
    try {
      const query = this.userRepository.createQueryBuilder('user');
      query
        .select(['user.id', 'user.name', 'user.email', 'user.createdAt'])
        .where('user.email = :email', { email });
      const user = await query.getOne();
      if (user) {
        return user;
      }
      throw new Error(`User with email ${email} does not exist`);
    } catch (err) {
      throw err;
    }
  }

  private sendOnBoardingEmail(email: string) {
    emailTransporter.sendMail({
      to: email,
      from: 'devugo@getnada.com',
      subject: 'Welcome to Twitee',
      html: '<h1>You successfully signed up</h1>',
    });
  }
}
