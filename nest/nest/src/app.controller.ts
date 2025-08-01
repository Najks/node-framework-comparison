import { Controller, Get, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

interface User {
  name: string;
  age: number;
  lastName: string;
  address: {
    country: string;
    city: string;
    postal: number;
  };
  hobbies: string[];
}

interface NestedResponse {
  user: User;
}

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): { message: string } {
    return { message: 'Hello World' };
  }

  @Get('json')
  getJson() {
    return { hello: 'world' };
  }
  
   @Get('nested')
  getNested() {
    return {
      user: {
        name: 'John',
        age: 30,
        lastName: 'Doe',
        address: {
          country: 'Slovenia',
          city: 'Ljubljana',
          postal: 1000
        },
        hobbies: ['cycling', 'reading']
      }
    };
  }
}