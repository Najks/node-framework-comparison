import { Controller, Get, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

// Create uploads directory
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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

  // Serve Sample-report.pdf (2457 KB)
  @Get('pdf/1')
  servePdf1(@Res() res: Response) {
    try {
      const filePath = path.join(uploadsDir, 'Sample-report.pdf');
      
      if (!fs.existsSync(filePath)) {
        throw new HttpException('Sample-report.pdf not found', HttpStatus.NOT_FOUND);
      }

      const stats = fs.statSync(filePath);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', stats.size);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

    } catch (error) {
      throw new HttpException({
        error: 'Failed to serve Sample-report.pdf',
        details: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Serve Large-doc.pdf (37686 KB)
  @Get('pdf/2')
  servePdf2(@Res() res: Response) {
    try {
      const filePath = path.join(uploadsDir, 'Large-doc.pdf');
      
      if (!fs.existsSync(filePath)) {
        throw new HttpException('Large-doc.pdf not found', HttpStatus.NOT_FOUND);
      }

      const stats = fs.statSync(filePath);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', stats.size);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

    } catch (error) {
      throw new HttpException({
        error: 'Failed to serve Large-doc.pdf',
        details: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Serve Small WebP image (500 KB)
  @Get('webp/1')
  serveWebp1(@Res() res: Response) {
    try {
      const filePath = path.join(uploadsDir, 'sample-image.webp');
      
      if (!fs.existsSync(filePath)) {
        throw new HttpException('sample-image.webp not found', HttpStatus.NOT_FOUND);
      }

      const stats = fs.statSync(filePath);
      
      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Content-Length', stats.size);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

    } catch (error) {
      throw new HttpException({
        error: 'Failed to serve sample-image.webp',
        details: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Serve Large WebP image (2000 KB)
  @Get('webp/2')
  serveWebp2(@Res() res: Response) {
    try {
      const filePath = path.join(uploadsDir, 'large-image.webp');
      
      if (!fs.existsSync(filePath)) {
        throw new HttpException('large-image.webp not found', HttpStatus.NOT_FOUND);
      }

      const stats = fs.statSync(filePath);
      
      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Content-Length', stats.size);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

    } catch (error) {
      throw new HttpException({
        error: 'Failed to serve large-image.webp',
        details: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}