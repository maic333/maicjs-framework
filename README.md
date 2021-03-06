# FaimJS framework

> A Flexible, Agile, Intuitive, Modern web service framework for Node.js with TypeScript

## Installation

```sh
npm install git+https://github.com/maic333/faimjs.git --save
```

## Usage

- [Creating the FaimJS app](#creating-the-faimjs-app)
- [Creating a controller](#creating-a-controller)
- [Dependency injection](#dependency-injection)
  * [Creating a service](#creating-a-service)
  * [Injecting a service into a controller](#injecting-a-service-into-a-controller)
  * [Injecting a service into another service](#injecting-a-service-into-another-service)
  * [Injecting a service into a custom file](#injecting-a-service-into-a-custom-file)
- [Loading controllers and services](#loading-controllers-and-services)
  * [Loading controllers and services from custom paths](#loading-controllers-and-services-from-custom-paths)
  * [Loading controllers and services from multiple paths](#loading-controllers-and-services-from-multiple-paths)
- [Injecting the Request, Response, Headers or Next function](#injecting-the-request-response-headers-or-next-function)
- [Authentication](#authentication)
  * [Creating a Guard](#creating-a-guard)
    * [BearerGuard example](#bearerguard-example)
    * [RequestGuard example](#requestguard-example)
  * [Register a Guard on a specific request and inject the authenticated user object into the route handler method](#register-a-guard-on-a-specific-request-and-inject-the-authenticated-user-object-into-the-route-handler-method)

### Creating the FaimJS app

```typescript
/**
* index.ts
*/

import { FaimApp } from 'faimjs';

const app = new FaimApp();
const port = 6543

app.listen(port)
  .then(() => {
    console.log(`App listening on http://localhost:${port}`);
  });
```

### Creating a controller

```typescript
/**
* controllers/hello-world.controller.ts
*/
import { ApiController, RouteResponse, ApiHttpMethod, ApiResponse, ApiRoute } from 'faimjs';

@ApiController()
class HelloWorldController {
  @ApiRoute('hello-world', ApiHttpMethod.GET)
  myMethod(
    @RouteResponse() res: ApiResponse
  ) {
    res.ok({
      hello: 'world'
    });
  }
}
```

### Dependency injection

#### Creating a service

Create service classes using the 'Injectable' decorator

```typescript
/**
* services/bike.service.ts
*/

import { Injectable } from 'faimjs';

@Injectable()
export class BikeService {
  getBikes() {
    return ['Yamaha', 'Kawasaki', 'Honda', 'Suzuki'];
  }
}
```

#### Injecting a service into a controller

```typescript
/**
* controllers/hello-world.controller.ts
*/
import { ApiController, RouteResponse, ApiHttpMethod, ApiResponse, ApiRoute } from 'faimjs';
import { BikeService } from '../services/bike.service';

@ApiController()
class HelloWorldController {
  constructor(
    private bikeService: BikeService
  ) {
  }
  
  @ApiRoute('hello-world', ApiHttpMethod.GET)
  myMethod(
    @RouteResponse() res: ApiResponse
  ) {
    res.ok(this.bikeService.getBikes());
  }
}
```

#### Injecting a service into another service

```typescript
/**
* services/reports.service.ts
*/

import { Injectable } from 'faimjs';
import { BikeService } from './bike.service';

@Injectable()
export class ReportsService {
  constructor(
    private bikeService: BikeService
  ) {
  }
  
  getBikesReport(): {bikes: string[], count: number} {
    const myBikes: string[] = this.bikeService.getBikes();
    return {
      bikes: myBikes,
      count: myBikes.length
    };
  }
}
```

#### Injecting a service into a custom file

```typescript
/**
* custom/my-module.ts
*/

import { DependencyInjector } from 'faimjs';
import { BikeService } from '../services/bike.service';

class MyModule {
  listBikes() {
    // inject the Bike service
    const bikeService = DependencyInjector.get(BikeService);
    const bikesList = bikeService.getBikes();
    
    console.log(`My bikes: ${bikesList.join(', ')}`);
  }
}
```

### Loading controllers and services

By default, FaimApp automatically registers the controllers from 'controllers' directory and services from 'services' directory, relative to the entrypoint file (e.g. index.js).
So, the default file structure would be:

    my-project
    ├── controllers                   # Directory containing Controllers
    ├── services                      # Directory containing Services
    ├── index.ts                      # Entrypoint file where FaimJS app is created
    
#### Loading controllers and services from custom paths

```typescript
/**
* index.ts
*/

import { FaimApp } from 'faimjs';
import * as path from 'path';

const app = new FaimApp({
  controllersPath: path.resolve(__dirname, 'custom/controllers/path'),
  servicesPath: path.resolve(__dirname, 'custom/services/path')
});
const port = 6543

app.listen(port)
  .then(() => {
    console.log(`App listening on http://localhost:${port}`);
  });
```

#### Loading controllers and services from multiple paths

```typescript
/**
* index.ts
*/

import { FaimApp } from 'faimjs';
import * as path from 'path';

const app = new FaimApp({
  controllersPath: path.resolve(__dirname, 'custom/controllers/path'),
  servicesPath: path.resolve(__dirname, 'custom/services/path')
});

app.loadFrameworkFiles(path.resolve(__dirname, 'other/controllers/path'))
app.loadFrameworkFiles(path.resolve(__dirname, 'other/services/path'))
app.loadFrameworkFiles(path.resolve(__dirname, 'some-module/other-services-and-controllers'))
```

### Injecting the Request, Response, Headers or Next function

```typescript
/**
* controllers/hello-world.controller.ts
*/
import { ApiController, RouteResponse, ApiHttpMethod, ApiResponse, ApiRoute, RouteRequest, ApiRequest, RouteHeaders, ApiHeaders, RouteNext } from 'faimjs';
import { NextFunction } from 'express';

@ApiController()
class HelloWorldController {
  @ApiRoute('hello-world', ApiHttpMethod.GET)
  myMethod(
    @RouteResponse() res: ApiResponse,
    @RouteRequest() req: ApiRequest,
    @RouteHeaders() headers: ApiHeaders,
    @RouteNext() next: NextFunction
  ) {
    // ...
  }
}
```

### Authentication

#### Creating a Guard

In order to create a Guard, you have to create an injectable service that extends one of the built-in abstract guards:
- AbstractRequestGuard
- AbstractBearerGuard

##### BearerGuard example

```typescript
import { AbstractBearerGuard } from 'faimjs/authentication';
import { Injectable } from 'faimjs';

@Injectable()
export class AuthGuard extends AbstractBearerGuard {
  validate(token: string) {
    // return the user object or a promise that resolves with the user object
    return db.findUserByToken(token);
  }
}
```

##### RequestGuard example

```typescript
import { AbstractRequestGuard } from 'faimjs/authentication';
import { Injectable, ApiRequest } from 'faimjs';

@Injectable()
export class AuthGuard extends AbstractRequestGuard {
  validate(req: ApiRequest) {
    const authToken = req.header('Authorization');
    
    if (authToken) {
      return db.findUserByToken(token);
    }
    
    // throw error or simply return false
    return false;
  }
}
```

#### Register a Guard on a specific request and inject the authenticated user object into the route handler method

Use the `UseGuard` decorator to register a Guard on a specific request.

Inject the authenticated user object into the request handler method with the `AuthenticatedUser` decorator.

```typescript
/**
* controllers/hello-world.controller.ts
*/
import { ApiController, RouteResponse, ApiHttpMethod, ApiResponse, ApiRoute, UseGuard, AuthenticatedUser } from 'faimjs';
import { AuthGuard } from '../services/auth-guard';

@ApiController()
class HelloWorldController {
  @ApiRoute('hello-world', ApiHttpMethod.GET)
  @UseGuard(AuthGuard)
  myMethod(
    @RouteResponse() res: ApiResponse,
    @AuthenticatedUser() user: UserModel,
  ) {
    res.ok(user);
  }
}
```

## License

ISC
