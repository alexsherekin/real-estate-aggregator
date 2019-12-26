export class Mapper {
  public static map: any = {};

  public static MapToEntity<TSource, TDest extends new () => Object>(
    sourceObject: TSource,
    destEntity: TDest,
    entityClass?: any
  ): TDest {
    entityClass = entityClass || (destEntity && destEntity.constructor);

    if (!entityClass) {
      const message = 'MapToEntity: Could not reveal entity class';
      console.log(message);
      console.log('sourceObject =');
      console.log(sourceObject);
      console.log('destEntity =');
      console.log(destEntity);
      console.log('entityClass =');
      console.log(entityClass);
      throw new Error(message);
    }

    const mapEntry = Mapper.map[entityClass.name];
    const dest = mapEntry !== undefined ? mapEntry.destination : undefined;
    const mapToEntity = mapEntry !== undefined ? mapEntry.mapToEntity : undefined;

    if (!entityClass || !sourceObject || !dest || !mapToEntity || !destEntity) {
      throw new Error('MapToEntity: Can not map to entity');
    }

    for (const objectPropertyName of Object.keys(mapToEntity)) {
      // entityPropDescriptor.name can contain a complex name like 'contact.first_name'
      const entityPropDescriptor = mapToEntity[objectPropertyName];
      if (entityPropDescriptor.handler) {
        const srcValue = (sourceObject as any)[objectPropertyName];
        const destValue = entityPropDescriptor.handler(srcValue);

        // console.log(`source value = ${srcValue}, dest value = ${destValue}`);
        const path = entityPropDescriptor.name.split('.').filter((item: string) => item.length > 0);
        let pathItem: any = destEntity;
        for (let i = 0; i < path.length - 1; i++) {
          const propertyName = path[i];
          // console.log(`path: ${propertyName}`);
          if (!pathItem[propertyName]) {
            pathItem[propertyName] = {};
          }
          pathItem = pathItem[propertyName];
        }
        // console.log(`end path: ${path[path.length - 1]}`);
        pathItem[path[path.length - 1]] = destValue;
      }
    }
    return destEntity;
  }

  public static MapFromEntity<TSource extends new () => Object, TDest>(
    sourceEntity: TSource,
    destObject: TDest,
    entityClass?: any
  ): TDest {
    entityClass = entityClass || (sourceEntity && sourceEntity.constructor);

    if (!entityClass) {
      const message = 'MapFromEntity: Could not reveal entity class';
      console.log(message);
      console.log('sourceEntity =');
      console.log(sourceEntity);
      console.log('destObject =');
      console.log(destObject);
      console.log('entityClass =');
      console.log(entityClass);
      throw new Error(message);
    }

    const mapEntry = Mapper.map[entityClass.name];
    const dest = mapEntry !== undefined ? mapEntry.destination : undefined;
    const mapFromEntity = mapEntry !== undefined ? mapEntry.mapFromEntity : undefined;

    if (!entityClass || !sourceEntity || !dest || !mapFromEntity || !destObject) {
      throw new Error('MapFromEntity: Can not map from entity');
    }

    for (const entityPropertyName of Object.keys(mapFromEntity)) {
      // entityPropertyName can contain a complex name like 'contact.first_name'
      const objectPropDescriptor = mapFromEntity[entityPropertyName];
      if (objectPropDescriptor.handler) {
        const path = entityPropertyName.split('.').filter((item) => item.length > 0);
        let srcValue: any = sourceEntity;
        for (const propertyName of path) {
          if (srcValue[propertyName] === undefined) {
            srcValue = undefined;
            break;
          }
          srcValue = srcValue[propertyName];
        }
        const destValue = objectPropDescriptor.handler(srcValue);

        // console.log(`path = ${path}, source value = ${srcValue}, dest value = ${destValue}`);
        (destObject as any)[objectPropDescriptor.name] = destValue;
      }
    }
    return destObject;
  }

  public static GetByEntityPropertyKey(property: string, entityClass: any): string {
    const dest = Mapper.map[entityClass.name].destination;
    const mapFromEntity = Mapper.map[entityClass.name].mapFromEntity;

    if (!dest) {
      throw new Error('Cannot map property');
    }

    return mapFromEntity[property] ? mapFromEntity[property].name : '';
  }

  public static GetByObjectPropertyKey(property: string, entityClass: any): string {
    const dest = Mapper.map[entityClass.name].destination;
    const mapToEntity = Mapper.map[entityClass.name].mapToEntity;

    if (!dest) {
      throw new Error('Cannot map property');
    }
    // console.dir(mapToEntity);

    return mapToEntity[property] ? mapToEntity[property].name : '';
  }
}

export function MapTo(objectClass: any) {
  // console.dir(objectClass);
  return (entityClass: any) => {
    const mapEntry = Mapper.map[entityClass.name] = Mapper.map[entityClass.name] || {
      mapFromEntity: {},
      mapToEntity: {}
    };

    mapEntry.destination = objectClass;
    const mapFromEntity = mapEntry.mapFromEntity = mapEntry.mapFromEntity || {};
    // console.log(`Map ${entityClass.name} to ${objectClass.name}`);
    const entityInstance = new entityClass();
    const objectInstance = new objectClass();
    for (const prop of Object.keys(mapFromEntity)) {
      const path = prop.split('.').filter((item) => item.length > 0);
      // console.log(`path: ${path}`);
      let pathItem = entityInstance;
      for (const propertyName of path) {
        if (!pathItem) {
          throw new Error(`Class ${entityClass.name} contains property chain ${prop} `
            + `and ${propertyName} property is of complex type. Please, initialize it `
            + `with an instance of a concrete class`);
        }
        // console.log(`propertyName: ${propertyName}`);
        if (!pathItem.hasOwnProperty(propertyName)) {
          throw new Error(`Class ${entityClass.name} does not contain property ${prop}. `
            + `Mapping with ${objectClass.name} is broken`);
        }
        pathItem = pathItem[propertyName];
      }
    }

    const mapToEntity = mapEntry.mapToEntity = mapEntry.mapToEntity || {};
    for (const prop in mapToEntity) {
      if (!objectInstance.hasOwnProperty(prop)) {
        throw new Error(`Class ${objectClass.name} does not contain property ${prop}. `
          + `Mapping with ${entityClass.name} is broken`);
      }
    }
  };
}

export function MapToField(
  objectPropertyName?: string,
  mapToEntityFunc: (value: any) => any = assignmentToEntityMap,
  mapFromEntityFunc: (value: any) => any = assignmentMap) {
  return (target: any, entityPropertyName: string) => {
    objectPropertyName = objectPropertyName || entityPropertyName;

    const mapEntry = Mapper.map[target.constructor.name] = Mapper.map[target.constructor.name] || {
      mapToEntity: {},
      mapFromEntity: {}
    };

    mapEntry.mapToEntity[objectPropertyName] = {
      name: entityPropertyName,
      handler: mapToEntityFunc
    };

    mapEntry.mapFromEntity[entityPropertyName] = {
      name: objectPropertyName,
      handler: mapFromEntityFunc
    };
  };
}

export function MapToObjectField(valueType: any) {
  if (!valueType) {
    throw new Error('MapToObjectField directive. Invalid argument');
  }

  return (target: any, entityPropertyName: string) => {
    const propertyTypeName = valueType.name;
    const propertyTypeMapEntry = Mapper.map[propertyTypeName];
    if (!propertyTypeMapEntry) {
      const timer = setInterval(() => {
        if (Mapper.map[propertyTypeName]) {
          // console.log(`Mapping settings for ${propertyTypeName} are available! Apply them`);
          clearInterval(timer);
          applyNestedMapping(target.constructor.name, entityPropertyName, propertyTypeName);
        } else {
          // console.log(`Mapping settings for ${propertyTypeName} are not available. `
          //   + `Wait further until they are ready...`);
        }
      }, 100);
    } else {
      // console.log(`Mapping settings for ${propertyTypeName} are available! Apply them`);
      applyNestedMapping(target.constructor.name, entityPropertyName, propertyTypeName);
    }
  };
}

function applyNestedMapping(
  targetName: string,
  entityPropertyName: string,
  propertyTypeName: string
) {
  const mapEntry = Mapper.map[targetName] = Mapper.map[targetName] || {
    mapToEntity: {},
    mapFromEntity: {}
  };
  const propertyTypeMapEntry = Mapper.map[propertyTypeName];
  if (!propertyTypeMapEntry) {
    throw new Error(`Invalid nested mapping for ${entityPropertyName} `
      + `property inside ${targetName} class`);
  }

  for (const nestedPropertyName of Object.keys(propertyTypeMapEntry.mapFromEntity)) {
    mapEntry.mapFromEntity[`${entityPropertyName}.${nestedPropertyName}`] = {
      name: propertyTypeMapEntry.mapFromEntity[nestedPropertyName].name,
      handler: propertyTypeMapEntry.mapFromEntity[nestedPropertyName].handler
    };
  }

  for (const objectPropertyName of Object.keys(propertyTypeMapEntry.mapToEntity)) {
    mapEntry.mapToEntity[objectPropertyName] = {
      name: `${entityPropertyName}.${propertyTypeMapEntry.mapToEntity[objectPropertyName].name}`,
      handler: propertyTypeMapEntry.mapToEntity[objectPropertyName].handler
    };
  }
}

export function clearMapping(entityClassName: string) {
  // console.log('clear mapping');
  Mapper.map[entityClassName] = undefined;
}

function assignmentMap(value: any) {
  if (value === undefined) {
    return null;
  }
  return value;
}

function assignmentToEntityMap(value: any) {
  return value;
}
