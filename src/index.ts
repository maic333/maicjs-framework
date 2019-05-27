import 'reflect-metadata';

// export core modules
import FaimApp from './core/faim-app';
export { FaimApp };
import ApiRoute from './core/http/decorators/api-route';
export { ApiRoute };
import ApiController from './core/http/decorators/api-controller';
export { ApiController };
import RouteRequest from './core/http/decorators/route-request';
export { RouteRequest };
import RouteResponse from './core/http/decorators/route-response';
export { RouteResponse };
import ApiRequest from './core/http/types/api-request';
export { ApiRequest };
import ApiResponse from './core/http/types/api-response';
export { ApiResponse };
import ApiHttpMethod from './core/http/types/api-http-method';
export { ApiHttpMethod };

// export DI modules
import Injectable from './dependency-injection/injectable';
export { Injectable };
import DependencyInjector from './dependency-injection/dependency-injector';
export { DependencyInjector };
