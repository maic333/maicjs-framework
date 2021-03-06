import TypeClass from '../../types/type-class';

/**
 * Create and store instances of classes and also retrieve an instance of an Injectable class
 */
class DependencyInjector {
  // registered injectable classes
  private recordsMap = new WeakMap<TypeClass, TypeClass[]>();
  // cache already instantiated classes
  private instancesMap = new WeakMap<TypeClass, object>();

  /**
   * Register a class in the DI and get its dependencies
   */
  resolve(token: TypeClass) {
    // register the class
    this.recordsMap.set(
      token,
      // get class' dependencies using the reflection capabilities of Reflect metadata
      Reflect.getOwnMetadata('design:paramtypes', token) || []
    );

    return this;
  }

  /**
   * Get the instance of an injectable class
   */
  get<T extends object = object>(token: TypeClass<T>): T {
    // get instance from cache
    const cachedInstance: T | undefined = this.instancesMap.get(token) as T;
    if (cachedInstance) {
      // return cached instance
      return cachedInstance;
    }

    // get class' dependencies
    const dependencies: TypeClass[] | undefined = this.recordsMap.get(token);
    if (!dependencies) {
      throw new Error(`Class ${token.name} is not defined with the @Injectable() decorator`);
    }

    // resolve dependencies into instances
    const depsInstances: object[] = dependencies.map((dep: TypeClass) => {
      return this.get(dep);
    });

    // create the instance of the class with the resolved dependencies
    return new token(...depsInstances);
  }
}

// create and export a single instance of the injector
const injector = new DependencyInjector();

export default injector;
