import { PropertyType } from '.prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { homeSelect, HomeService } from './home.service';

const mockHomes = [
  {
    id: 1,
    address: '2345 William Str',
    city: 'Toronto',
    price: 1500000,
    propertyType: PropertyType.RESIDENTIAL,
    image: 'img1',
    numberOfBedrooms: 3,
    numberOfBathrooms: 2.5,
    images: [
      {
        url: 'img1',
      },
    ],
  },
];

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockHomes),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getHomes', () => {
    const filters = {
      city: 'Toronto',
      price: {
        gte: 1000000,
        lte: 1500000,
      },
      propertyType: PropertyType.RESIDENTIAL,
    };

    it('should call prisma to get homes by filter', async () => {
      const prismaFindManyHomes = jest.fn().mockReturnValue(mockHomes);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(prismaFindManyHomes);

      await service.getHomes(filters);

      expect(prismaFindManyHomes).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: filters,
      });
    });
  });
});
