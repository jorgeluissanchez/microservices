import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/application/service/users.service';
import { UserRepository } from '../../src/infrastructure/repository/user.repository';
import { getModelToken } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from '../../src/domain/entity/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { CreateUserDTO } from '../../src/application/dto/create-user.dto';
import { UnprocessableEntityException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

// --- Mock del Modelo de Mongoose ---
// En una prueba de integración real, nos conectaríamos a la DB de Docker.
// Para simplicidad y velocidad en este ejemplo, usaremos una base de datos en memoria.

describe('UsersService Integration Tests', () => {
  let service: UsersService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<UserDocument>;

  beforeAll(async () => {
    // Usar mongodb-memory-server para pruebas rápidas y aisladas.
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    // Usamos UserDocument.name y UserSchema directamente del archivo de esquema
    userModel = mongoConnection.model(UserDocument.name, UserSchema);

    // Compilar el módulo de NestJS para la prueba
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UserRepository,
        // Nos aseguramos de pedir el token con el nombre correcto de la clase del documento
        { provide: getModelToken(UserDocument.name), useValue: userModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  // Limpiar la base de datos después de cada prueba
  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });


  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un usuario y guardarlo en la base de datos con contraseña hasheada', async () => {
      const createUserDto: CreateUserDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      const createdUser = await service.create(createUserDto);

      // 1. Verificar que el servicio retorna el usuario sin la contraseña
      expect(createdUser).toBeDefined();
      expect(createdUser.email).toEqual(createUserDto.email);
      expect(createdUser.password).toBeUndefined();

      // 2. Verificar directamente en la base de datos
      const userInDb = await userModel.findById(createdUser._id).exec();
      expect(userInDb).not.toBeNull();
      expect(userInDb.email).toEqual(createUserDto.email);
      
      // 3. Verificar que la contraseña está hasheada
      expect(userInDb.password).not.toEqual(createUserDto.password);
      const isPasswordMatching = await bcryptjs.compare(createUserDto.password, userInDb.password);
      expect(isPasswordMatching).toBe(true);
    });

    it('debería lanzar una excepción si el email ya existe', async () => {
      const createUserDto: CreateUserDTO = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      // Creamos el primer usuario
      await service.create(createUserDto);

      // Intentamos crear el segundo con el mismo email
      await expect(service.create(createUserDto)).rejects.toThrow(
        new UnprocessableEntityException('Email already exists'),
      );
    });
  });

  // ... Aquí podrías añadir pruebas para verifyUser, getUser, etc.
});

