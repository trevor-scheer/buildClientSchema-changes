const {
  buildClientSchema: buildClientSchemaIncludesOnlyNecessaryTypes
} = require('graphql-pre-14.2.0');
const {
  buildClientSchema: buildClientSchemaFirstBreakingChange
} = require('graphql-14.2.0');
const {
  buildClientSchema: buildClientSchemaIncludesAllTypes
} = require('graphql-post-14.2.1');
const { buildClientSchema: buildClientSchemaLatest } = require('graphql');
const { readFileSync } = require('fs');

const schema = JSON.parse(readFileSync('schema.json').toString());

function runBuildClientSchema(versionNumber, versionedFunction) {
  const clientSchema = versionedFunction(schema);

  const typeMap = clientSchema.getTypeMap();
  Object.keys(typeMap).forEach(key => {
    if (key.startsWith('__')) delete typeMap[key];
  });

  console.log(`${versionNumber}: ${Object.keys(typeMap).length}`);
}

// 4 types
runBuildClientSchema('14.1.1', buildClientSchemaIncludesOnlyNecessaryTypes);

try {
  runBuildClientSchema('14.2.0', buildClientSchemaFirstBreakingChange);
} catch (e) {
  console.log('14.2.0 throws due to missing types (and not filling them in)');
}
// 6 types (all of them)
runBuildClientSchema('14.2.1', buildClientSchemaIncludesAllTypes);

// Fails, doesn't pull in missing built-ins
try {
  runBuildClientSchema('14.4.1', buildClientSchemaLatest);
} catch (e) {
  console.log('Latest throws due to missing types (and not filling them in)');
}
